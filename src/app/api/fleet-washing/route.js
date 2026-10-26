import { NextResponse } from "next/server";
import {
  buildFleetWashingRecord,
  buildFleetWashingEmailText,
} from "../../../lib/fleetWashingRecord";

/* ---------------------------------------------------------------------------
 * Fleet Washing Services assessment endpoint (EcoFleet Wash partner integration).
 *
 * Receives a fleet washing assessment from the configurator. Builds a flat
 * record and sends TWO emails:
 *   1) To EcoFleet Wash (partner notification for quotation)
 *   2) To Smoovely (marketing partner's records)
 *
 * Assessment only — no pricing computed. EcoFleet Wash manages quotation,
 * contracts, invoicing and customer relationship entirely.
 *
 * Env (shared with other endpoints):
 *   POWER_AUTOMATE_WEBHOOK_URL   (optional, for future List ingestion)
 *   RESEND_API_KEY               (required for emails)
 *   NOTIFY_EMAIL                 (Smoovely; defaults to support@)
 *   ECOFLEET_PARTNER_EMAIL       (EcoFleet Wash; required)
 * ------------------------------------------------------------------------- */

const SMOOVELY_TO = "support@smoovelylogistics.com";

export async function POST(req) {
  try {
    const body = await req.json();
    const { submittedAt, ...assessment } = body || {};

    // Minimal validation — company and email are required.
    if (!assessment.company || !assessment.email) {
      return NextResponse.json(
        { ok: false, error: "Company and email are required." },
        { status: 400 }
      );
    }

    const timestamp = submittedAt || new Date().toISOString();
    const record = buildFleetWashingRecord({ assessment, timestamp });

    let forwarded = false;

    // 1) Forward to Power Automate (future "Fleet Washing Enquiries" List).
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
        forwarded = res.ok;
        if (!res.ok) {
          console.error("[/api/fleet-washing] Power Automate responded", res.status);
        }
      } catch (err) {
        console.error("[/api/fleet-washing] Power Automate failed (network):", err);
      }
    }

    // 2) Send emails (both required if Resend is configured).
    const emailsSent = { ecofleet: false, smoovely: false };

    if (process.env.RESEND_API_KEY) {
      const emailText = buildFleetWashingEmailText(record);
      const ecofleetEmail = process.env.ECOFLEET_PARTNER_EMAIL;
      const smoovelyEmail = process.env.NOTIFY_EMAIL || SMOOVELY_TO;

      // Email to EcoFleet Wash
      if (ecofleetEmail) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Smoovely <support@smoovelylogistics.com>",
              to: ecofleetEmail,
              subject: `New Fleet Assessment — ${record.company}`,
              text: emailText,
            }),
          });
          const raw = await res.text();
          let payload = {};
          if (raw) {
            try {
              payload = JSON.parse(raw);
            } catch {
              payload = { raw };
            }
          }
          if (!res.ok) {
            console.error("[/api/fleet-washing] EcoFleet email rejected:", res.status, payload);
          } else {
            emailsSent.ecofleet = true;
            console.log("[/api/fleet-washing] EcoFleet email sent:", payload.id || "(no id)");
          }
        } catch (err) {
          console.error("[/api/fleet-washing] EcoFleet email failed (network):", err);
        }
      } else {
        console.warn("[/api/fleet-washing] ECOFLEET_PARTNER_EMAIL not configured");
      }

      // Email to Smoovely (records)
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Smoovely <support@smoovelylogistics.com>",
            to: smoovelyEmail,
            subject: `Fleet Washing Assessment — ${record.company}`,
            text: emailText,
          }),
        });
        const raw = await res.text();
        let payload = {};
        if (raw) {
          try {
            payload = JSON.parse(raw);
          } catch {
            payload = { raw };
          }
        }
        if (!res.ok) {
          console.error("[/api/fleet-washing] Smoovely email rejected:", res.status, payload);
        } else {
          emailsSent.smoovely = true;
          console.log("[/api/fleet-washing] Smoovely email sent:", payload.id || "(no id)");
        }
      } catch (err) {
        console.error("[/api/fleet-washing] Smoovely email failed (network):", err);
      }
    } else {
      console.warn("[/api/fleet-washing] Resend skipped — missing RESEND_API_KEY");
    }

    console.log("[/api/fleet-washing] submission:", {
      company: record.company,
      totalFleet: record.totalFleetSize,
      frequency: record.cleaningFrequency,
      forwarded,
      emailsSent,
    });

    return NextResponse.json({ ok: true, forwarded, emailsSent });
  } catch (err) {
    console.error("[/api/fleet-washing] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import {
  buildHousingRecord,
  buildHousingEmailText,
  HOUSING_SERVICES,
} from "../../../lib/housingRecord";

/* ---------------------------------------------------------------------------
 * Housing & Property Services proposal-request endpoint.
 *
 * Mirrors /api/whats-next and /api/feedback:
 *   Housing configurator → POST /api/housing → build a flat, List-ready record
 *   (priority derived server-side) → forward to Power Automate (future
 *   "Housing Enquiries" List) + optional Resend notification email.
 *
 * This is a PROPOSAL request — no pricing is computed or returned. Kept fully
 * separate from the quote/feedback/opportunity pipelines (own endpoint, own
 * record shape tagged type:"housing-enquiry") so existing flows are untouched.
 *
 * Env (all shared with the existing routes — no new server infra):
 *   POWER_AUTOMATE_WEBHOOK_URL   (required in prod)
 *   RESEND_API_KEY               (optional direct email)
 *   NOTIFY_EMAIL                 (optional override; defaults to support@)
 *
 * With no env set it still succeeds and logs the row, so local dev works.
 * ------------------------------------------------------------------------- */

const HOUSING_TO = "support@smoovelylogistics.com";

export async function POST(req) {
  try {
    const body = await req.json();
    const { submittedAt, ...enquiry } = body || {};

    // Minimal validation — a service and a contact route are required.
    const serviceRequired = (enquiry.serviceRequired || "").trim();
    if (!HOUSING_SERVICES.includes(serviceRequired)) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid service required." },
        { status: 400 }
      );
    }
    if (!enquiry.email && !enquiry.phone) {
      return NextResponse.json(
        { ok: false, error: "Missing contact details." },
        { status: 400 }
      );
    }

    const timestamp = submittedAt || new Date().toISOString();
    const record = buildHousingRecord({ enquiry, timestamp });

    let forwarded = false;

    // 1) Forward to Power Automate (future "Housing Enquiries" List + automation).
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      forwarded = res.ok;
      if (!res.ok) {
        console.error("[/api/housing] Power Automate responded", res.status);
      }
    }

    // 2) Optional direct email notification (Resend) — only if configured.
    if (process.env.RESEND_API_KEY) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Smoovely <support@smoovelylogistics.com>",
            to: process.env.NOTIFY_EMAIL || HOUSING_TO,
            subject: "New Housing & Property Services Enquiry",
            text: buildHousingEmailText(record),
          }),
        });

        // fetch does NOT throw on 4xx/5xx — inspect the response explicitly.
        const raw = await emailRes.text();
        let payload = {};
        if (raw) {
          try {
            payload = JSON.parse(raw);
          } catch {
            payload = { raw };
          }
        }
        if (!emailRes.ok) {
          console.error(
            "[/api/housing] Resend rejected email:",
            emailRes.status,
            payload
          );
        } else {
          console.log(
            "[/api/housing] Resend accepted email id:",
            payload.id || "(none)"
          );
        }
      } catch (err) {
        console.error("[/api/housing] email notify failed (network):", err);
      }
    } else {
      console.warn("[/api/housing] Resend skipped — missing RESEND_API_KEY");
    }

    // Always log the row so submissions are never silently lost in dev.
    console.log("[/api/housing] submission:", {
      serviceRequired: record.serviceRequired,
      organisationType: record.organisationType,
      priority: record.priority,
      leadSource: record.leadSource,
      forwarded,
    });

    return NextResponse.json({ ok: true, forwarded, priority: record.priority });
  } catch (err) {
    console.error("[/api/housing] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

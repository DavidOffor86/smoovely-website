import { NextResponse } from "next/server";
import {
  buildRelocationRecord,
  buildRelocationEmailText,
  RELOCATION_MOVE_TYPES,
} from "../../../lib/relocationRecord";

/* ---------------------------------------------------------------------------
 * Relocation & Mobility enquiry endpoint (Phase 1).
 *
 * Mirrors /api/housing and /api/whats-next:
 *   Relocation configurator → POST /api/relocation → build a flat, List-ready
 *   record → forward to Power Automate + optional Resend notification email.
 *
 * Enquiry / proposal request — no pricing. Kept separate from the existing
 * pipelines (own endpoint, own record tagged type:"relocation-enquiry").
 * With no env set it still succeeds and logs, so local dev works.
 *
 * Env (shared — no new infra):
 *   POWER_AUTOMATE_WEBHOOK_URL   (required in prod)
 *   RESEND_API_KEY               (optional direct email)
 *   NOTIFY_EMAIL                 (optional override; defaults to support@)
 * ------------------------------------------------------------------------- */

const RELOCATION_TO = "support@smoovelylogistics.com";

export async function POST(req) {
  try {
    const body = await req.json();
    const { submittedAt, ...enquiry } = body || {};

    // Minimal validation — a valid move type and a contact route are required.
    if (!RELOCATION_MOVE_TYPES.includes((enquiry.moveType || "").trim())) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid move type." },
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
    const record = buildRelocationRecord({ enquiry, timestamp });

    let forwarded = false;

    // 1) Forward to Power Automate (future "Relocation Enquiries" List).
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      forwarded = res.ok;
      if (!res.ok) {
        console.error("[/api/relocation] Power Automate responded", res.status);
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
            to: process.env.NOTIFY_EMAIL || RELOCATION_TO,
            subject: `New Relocation Enquiry — ${record.moveType}`,
            text: buildRelocationEmailText(record),
          }),
        });
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
          console.error("[/api/relocation] Resend rejected email:", emailRes.status, payload);
        } else {
          console.log("[/api/relocation] Resend accepted email id:", payload.id || "(none)");
        }
      } catch (err) {
        console.error("[/api/relocation] email notify failed (network):", err);
      }
    } else {
      console.warn("[/api/relocation] Resend skipped — missing RESEND_API_KEY");
    }

    console.log("[/api/relocation] submission:", {
      moveType: record.moveType,
      destinationCountry: record.destinationCountry,
      relocationCategory: record.relocationCategory,
      forwarded,
    });

    return NextResponse.json({ ok: true, forwarded });
  } catch (err) {
    console.error("[/api/relocation] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

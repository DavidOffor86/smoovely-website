import { NextResponse } from "next/server";
import {
  buildWhatsNextRecord,
  buildWhatsNextEmailText,
} from "../../../lib/whatsNextRecord";

/* ---------------------------------------------------------------------------
 * "What's Next" opportunity submission endpoint (Phase C).
 *
 * Mirrors /api/feedback and /api/quote:
 *   Survey → POST /api/whats-next → build a flat, CSV-ready record (priority +
 *   partner opportunity tags re-derived server-side) → forward to Power
 *   Automate (Microsoft Lists / Excel / CRM row) + optional Resend email.
 *
 * Kept fully separate from the quote and feedback pipelines (own endpoint, own
 * record shape tagged type:"whats-next-opportunity") so existing workflows are
 * untouched.
 *
 * Env (all shared with the existing routes — no new server infra):
 *   POWER_AUTOMATE_WEBHOOK_URL   (required in prod)
 *   RESEND_API_KEY               (optional direct email)
 *   NOTIFY_EMAIL                 (optional override; defaults to support@)
 *
 * With no env set it still succeeds and logs the row, so local dev works.
 * ------------------------------------------------------------------------- */

const WHATS_NEXT_TO = "support@smoovelylogistics.com";

const VALID_MOVE_TYPES = [
  "I'm settled for now",
  "Looking to buy",
  "Looking to rent",
  "Student accommodation",
  "Relocating for work",
  "Property investor",
  "Not sure yet",
];

export async function POST(req) {
  try {
    const body = await req.json();
    const { submittedAt, ...survey } = body || {};

    // Minimal validation — the intent (nextMoveType) is the one truly required
    // field; every other question is conditional on it.
    const nextMoveType = (survey.nextMoveType || "").trim();
    if (!VALID_MOVE_TYPES.includes(nextMoveType)) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid next move type." },
        { status: 400 }
      );
    }

    const timestamp = submittedAt || new Date().toISOString();
    const record = buildWhatsNextRecord({ survey, timestamp });

    let forwarded = false;

    // 1) Forward to Power Automate (Microsoft Lists / Excel row + automation).
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      forwarded = res.ok;
      if (!res.ok) {
        console.error("[/api/whats-next] Power Automate responded", res.status);
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
            to: process.env.NOTIFY_EMAIL || WHATS_NEXT_TO,
            subject: "New What's Next Opportunity",
            text: buildWhatsNextEmailText(record),
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
            "[/api/whats-next] Resend rejected email:",
            emailRes.status,
            payload
          );
        } else {
          console.log(
            "[/api/whats-next] Resend accepted email id:",
            payload.id || "(none)"
          );
        }
      } catch (err) {
        console.error("[/api/whats-next] email notify failed (network):", err);
      }
    } else {
      console.warn("[/api/whats-next] Resend skipped — missing RESEND_API_KEY");
    }

    // Always log the row so submissions are never silently lost in dev.
    console.log("[/api/whats-next] submission:", {
      nextMoveType: record.nextMoveType,
      timeline: record.timeline,
      priority: record.priority,
      opportunityTags: record.opportunityTags,
      partnerConsent: record.partnerConsent,
      forwarded,
    });

    return NextResponse.json({
      ok: true,
      forwarded,
      priority: record.priority,
    });
  } catch (err) {
    console.error("[/api/whats-next] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

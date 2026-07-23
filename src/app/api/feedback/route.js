import { NextResponse } from "next/server";
import { buildFeedbackRecord, buildFeedbackEmailText } from "../../../lib/feedbackRecord";

/* ---------------------------------------------------------------------------
 * Customer feedback submission endpoint (Phase B).
 *
 * Mirrors /api/quote and /api/contact:
 *   Feedback form → POST /api/feedback → build a flat, CSV-ready record
 *   (NPS category re-derived server-side) → forward to Power Automate
 *   (Microsoft Lists / Excel / CRM row) + optional Resend notification email.
 *
 * Kept fully separate from the quote pipeline (own endpoint, own record shape
 * tagged type:"customer-feedback") so existing quote workflows are untouched.
 *
 * Env (all shared with the existing routes — no new server infra):
 *   POWER_AUTOMATE_WEBHOOK_URL   (required in prod)
 *   RESEND_API_KEY               (optional direct email)
 *   NOTIFY_EMAIL                 (optional override; defaults to support@)
 *
 * With no env set it still succeeds and logs the row, so local dev works.
 * ------------------------------------------------------------------------- */

const FEEDBACK_TO = "support@smoovelylogistics.com";

export async function POST(req) {
  try {
    const body = await req.json();
    const { submittedAt, ...feedback } = body || {};

    // Minimal validation — a satisfaction score is the one truly required field.
    if (feedback.overallSatisfaction == null || feedback.overallSatisfaction === "") {
      return NextResponse.json(
        { ok: false, error: "Missing overall satisfaction score." },
        { status: 400 }
      );
    }

    const timestamp = submittedAt || new Date().toISOString();
    const record = buildFeedbackRecord({ feedback, timestamp });

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
        console.error("[/api/feedback] Power Automate responded", res.status);
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
            to: process.env.NOTIFY_EMAIL || FEEDBACK_TO,
            subject: "New Customer Feedback Submission",
            text: buildFeedbackEmailText(record),
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
          console.error("[/api/feedback] Resend rejected email:", emailRes.status, payload);
        } else {
          console.log("[/api/feedback] Resend accepted email id:", payload.id || "(none)");
        }
      } catch (err) {
        console.error("[/api/feedback] email notify failed (network):", err);
      }
    } else {
      console.warn("[/api/feedback] Resend skipped — missing RESEND_API_KEY");
    }

    // Always log the row so submissions are never silently lost in dev.
    console.log("[/api/feedback] submission:", {
      overallSatisfaction: record.overallSatisfaction,
      npsScore: record.npsScore,
      npsCategory: record.npsCategory,
      wouldUseAgain: record.wouldUseAgain,
      forwarded,
    });

    return NextResponse.json({ ok: true, forwarded, npsCategory: record.npsCategory });
  } catch (err) {
    console.error("[/api/feedback] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import {
  buildAcceptanceRecord,
  buildChecklistRecord,
  buildCompletionRecord,
  buildOperationsEmailText,
  OPERATIONS_EVENTS,
} from "../../../lib/operationsRecord";

/* ---------------------------------------------------------------------------
 * Customer Journey & Operations endpoint (Phase E).
 *
 * A single endpoint that receives booking-acceptance, pre-move-checklist and
 * move-completion submissions (discriminated by `type`), builds a flat,
 * List-ready record, and forwards it to Power Automate (future "Operations"
 * List + downstream events) plus an optional Resend notification email.
 *
 * SECURITY: IP address, browser and timestamp are captured HERE (server-side)
 * from request headers — never trusted from the client payload. Terms version
 * is a server constant (see operationsRecord.js). No pricing/quote logic.
 *
 * Env (shared with existing routes — no new infra):
 *   POWER_AUTOMATE_WEBHOOK_URL   (required in prod)
 *   RESEND_API_KEY               (optional direct email)
 *   NOTIFY_EMAIL                 (optional override; defaults to support@)
 * ------------------------------------------------------------------------- */

const OPERATIONS_TO = "support@smoovelylogistics.com";

const SUBJECTS = {
  "booking-acceptance": "Booking Accepted — Smoovely",
  "pre-move-checklist": "Pre-Move Checklist Completed — Smoovely",
  "move-completion": "Move Completion — Smoovely",
};

function clientMeta(req) {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const browser = req.headers.get("user-agent") || "";
  return { ip, browser, timestamp: new Date().toISOString() };
}

// Health check — lets a browser GET confirm the route is registered. The real
// work is POST-only (journey event submissions); GET never mutates anything.
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "operations",
    methods: ["POST"],
    message:
      "Operations endpoint is live. Submit acceptance / checklist / completion events via POST.",
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { type } = body || {};

    // Server-authoritative security metadata.
    const meta = clientMeta(req);

    let record;
    if (type === "acceptance") {
      record = buildAcceptanceRecord({ data: body, meta });
    } else if (type === "checklist") {
      record = buildChecklistRecord({ data: body, meta });
    } else if (type === "completion") {
      record = buildCompletionRecord({ data: body, meta });
    } else {
      return NextResponse.json(
        { ok: false, error: "Unknown operations type." },
        { status: 400 }
      );
    }

    // Basic validation — a quote reference is required to tie records together.
    if (!record.quoteReference) {
      return NextResponse.json(
        { ok: false, error: "Missing quote reference." },
        { status: 400 }
      );
    }

    // Secondary event for signature/completion so flows can branch on it.
    if (type === "acceptance" && record.acceptedSignature) {
      record.secondaryEvent = OPERATIONS_EVENTS.SIGNATURE_CAPTURED;
    }
    if (type === "completion" && record.completionSignature) {
      record.secondaryEvent = OPERATIONS_EVENTS.COMPLETION_SIGNED;
    }

    let forwarded = false;

    // 1) Forward to Power Automate (future "Operations" List + events).
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      forwarded = res.ok;
      if (!res.ok) {
        console.error("[/api/operations] Power Automate responded", res.status);
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
            to: process.env.NOTIFY_EMAIL || OPERATIONS_TO,
            subject: SUBJECTS[record.type] || "Smoovely Operations Event",
            text: buildOperationsEmailText(record),
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
          console.error("[/api/operations] Resend rejected email:", emailRes.status, payload);
        } else {
          console.log("[/api/operations] Resend accepted email id:", payload.id || "(none)");
        }
      } catch (err) {
        console.error("[/api/operations] email notify failed (network):", err);
      }
    } else {
      console.warn("[/api/operations] Resend skipped — missing RESEND_API_KEY");
    }

    // Always log (PII-free-ish) so submissions are never silently lost in dev.
    console.log("[/api/operations] submission:", {
      type: record.type,
      event: record.event,
      quoteReference: record.quoteReference,
      forwarded,
    });

    return NextResponse.json({
      ok: true,
      forwarded,
      event: record.event,
      moveReadinessScore: record.moveReadinessScore,
    });
  } catch (err) {
    console.error("[/api/operations] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

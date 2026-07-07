import { NextResponse } from "next/server";
import { priceQuote } from "../../../lib/pricing.server";
import { buildQuoteRecord, buildQuoteEmailText, buildLeadSummary } from "../../../lib/quoteRecord";

/* ---------------------------------------------------------------------------
 * Quote submission endpoint.
 *
 * Data flow:
 *   Configurator → POST /api/quote → RE-PRICE server-side (authoritative,
 *   tamper-proof) → build a flat CSV-ready record + leadSummary →
 *   forward to Power Automate (Excel/SharePoint row) + Resend notification.
 *
 * The client only sends { service, contact, details }. Every pricing/breakdown
 * value is recomputed here via priceQuote() so the stored figure can't be
 * edited in the browser. All pricing constants stay server-side.
 *
 * Env:
 *   POWER_AUTOMATE_WEBHOOK_URL  (required in prod)
 *   RESEND_API_KEY + NOTIFY_EMAIL  (optional direct email, in addition to PA)
 *
 * With no env set it still succeeds and logs the row, so local dev works.
 * ------------------------------------------------------------------------- */

// Flatten nested configurator answers into "key: value · key: value" — kept
// for backward compatibility with the existing details_summary column.
function summariseDetails(details = {}) {
  const skip = new Set(["name", "email", "phone"]);
  const parts = [];
  for (const [key, value] of Object.entries(details)) {
    if (skip.has(key) || value === "" || value == null) continue;
    let v = value;
    if (typeof value === "object") {
      v = Object.entries(value)
        .filter(([, val]) => val !== "" && val !== false && val != null)
        .map(([k, val]) => (val === true ? k : `${k}=${val}`))
        .join("/");
    }
    if (v === "" || v === undefined) continue;
    parts.push(`${key}: ${v}`);
  }
  return parts.join(" · ");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      service = "",
      name = "",
      email = "",
      phone = "",
      details = {},
      submittedAt,
    } = body || {};

    // Dev-only, PII-free summary — never log name/email/phone.
    if (process.env.NODE_ENV !== "production") {
      console.log("[/api/quote] request:", {
        service,
        hasEmail: Boolean(email),
        hasPhone: Boolean(phone),
      });
    }

    // Basic validation — must have a contact route and a service.
    if (!service || (!email && !phone)) {
      return NextResponse.json(
        { ok: false, error: "Missing service or contact details." },
        { status: 400 }
      );
    }

    // Re-price server-side (authoritative). Contact fields live on details too
    // so the pricing engine sees the same shape the configurator used.
    const quote = await priceQuote(service, { ...details, name, email, phone });

    const timestamp = submittedAt || new Date().toISOString();
    const record = buildQuoteRecord({
      service,
      contact: { name, email, phone },
      details,
      quote,
      timestamp,
    });
    // Preserve the legacy flat summary column.
    record.details_summary = summariseDetails(details);

    const leadSummary = buildLeadSummary(service, details, quote);

    let forwarded = false;

    // 1) Forward to Power Automate (Excel row + downstream automation).
    //    Existing columns preserved; new columns added non-destructively.
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...record, leadSummary, details }),
      });
      forwarded = res.ok;
      if (!res.ok) {
        console.error("[/api/quote] Power Automate responded", res.status);
      }
    }

    // 2) Optional direct email notification (Resend) — only if configured.
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Smoovely <support@smoovelylogistics.com>",
            to: process.env.NOTIFY_EMAIL,
            subject:
              `${record.customQuoteRequired ? "⚠ Custom Quote — " : ""}` +
              `New ${service} quote — ${name || email || phone}`,
            text: buildQuoteEmailText(record),
          }),
        });

        // fetch does NOT throw on 4xx/5xx — inspect the response explicitly.
        const payload = await emailRes.json().catch(() => ({}));
        if (!emailRes.ok) {
          console.error("[/api/quote] Resend rejected email:", emailRes.status, payload);
        } else {
          console.log("[/api/quote] Resend accepted email id:", payload.id);
        }
      } catch (err) {
        console.error("[/api/quote] email notify failed (network):", err);
      }
    } else {
      console.warn(
        "[/api/quote] Resend skipped — missing env:",
        !process.env.RESEND_API_KEY ? "RESEND_API_KEY " : "",
        !process.env.NOTIFY_EMAIL ? "NOTIFY_EMAIL" : ""
      );
    }

    // Always log the row so submissions are never silently lost in dev.
    console.log("[/api/quote] submission:", {
      service: record.service,
      estimate: record.estimate,
      pricingVersion: record.pricingVersion,
      customQuoteRequired: record.customQuoteRequired,
      forwarded,
    });

    return NextResponse.json({
      ok: true,
      forwarded,
      estimate: record.estimate,
      estimateRange: record.estimateRange,
      customQuoteRequired: record.customQuoteRequired,
      pricingVersion: record.pricingVersion,
      leadSummary,
    });
  } catch (err) {
    console.error("[/api/quote] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

/* ---------------------------------------------------------------------------
 * Quote submission endpoint.
 *
 * Data flow:
 *   Configurator → POST /api/quote → flatten to a CSV-ready row →
 *   forward to Power Automate webhook → Power Automate writes a row to the
 *   Excel/SharePoint table and sends the team notification email.
 *
 * Env:
 *   POWER_AUTOMATE_WEBHOOK_URL  (required in prod — the "When an HTTP request
 *                                is received" trigger URL)
 *   RESEND_API_KEY + NOTIFY_EMAIL  (optional direct email, in addition to PA)
 *
 * With no env set it still succeeds and logs the row, so local dev works.
 * ------------------------------------------------------------------------- */

// Flatten nested configurator answers into "key: value · key: value" — keeps
// the stored row readable in a single Excel/CSV cell.
function summariseDetails(details = {}) {
  const skip = new Set(["name", "email", "phone"]);
  const parts = [];
  for (const [key, value] of Object.entries(details)) {
    if (skip.has(key) || value === "" || value == null) continue;
    let v = value;
    if (typeof value === "object") {
      // e.g. checkbox maps { sofa: true } or access { parking: "Free" }
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
    // Dev-only, PII-free summary — never log name/email/phone.
    if (process.env.NODE_ENV !== "production") {
      console.log("[/api/quote] request:", {
        service: body?.service,
        hasEmail: Boolean(body?.email),
        hasPhone: Boolean(body?.phone),
      });
    }

    const {
      service = "",
      name = "",
      email = "",
      phone = "",
      estimate = null,
      currency = "GBP",
      details = {},
      source = "quote-configurator",
      submittedAt,
    } = body || {};

    // Basic validation — must have a contact route and a service.
    if (!service || (!email && !phone)) {
      return NextResponse.json(
        { ok: false, error: "Missing service or contact details." },
        { status: 400 }
      );
    }

    // CSV-ready, flat record. Power Automate maps these 1:1 to Excel columns.
    const record = {
      timestamp: submittedAt || new Date().toISOString(),
      service,
      name,
      email,
      phone,
      estimate: estimate ?? "",
      currency,
      details_summary: summariseDetails(details),
      source,
    };

    let forwarded = false;

    // 1) Forward to Power Automate (preferred path: Excel row + email).
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...record, details }),
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
            // Must match a verified sender/domain in Resend.
            from: "Smoovely <support@smoovelylogistics.com>",
            to: process.env.NOTIFY_EMAIL,
            subject: `New ${service} quote — ${name || email || phone}`,
            text:
              `New configurator submission\n\n` +
              `Service: ${service}\nName: ${name}\nEmail: ${email}\n` +
              `Phone: ${phone}\nEstimate: ${currency} ${estimate}\n` +
              `When: ${record.timestamp}\n\nDetails: ${record.details_summary}`,
          }),
        });

        // fetch does NOT throw on 4xx/5xx — inspect the response explicitly,
        // otherwise Resend errors (403 unverified sender, 422 validation,
        // 401 bad key) are silently swallowed.
        const payload = await emailRes.json().catch(() => ({}));
        if (!emailRes.ok) {
          console.error(
            "[/api/quote] Resend rejected email:",
            emailRes.status,
            payload
          );
        } else {
          console.log("[/api/quote] Resend accepted email id:", payload.id);
        }
      } catch (err) {
        console.error("[/api/quote] email notify failed (network):", err);
      }
    } else {
      // Surface the silent-skip case — the #1 reason "email isn't sending".
      console.warn(
        "[/api/quote] Resend skipped — missing env:",
        !process.env.RESEND_API_KEY ? "RESEND_API_KEY " : "",
        !process.env.NOTIFY_EMAIL ? "NOTIFY_EMAIL" : ""
      );
    }

    // Always log the row so submissions are never silently lost in dev.
    console.log("[/api/quote] submission:", {
      service: record.service,
      hasEmail: Boolean(record.email),
      hasPhone: Boolean(record.phone),
      forwarded,
    });

    // Clean, flat JSON for Power Automate → Excel (1:1 column mapping).
    return NextResponse.json({
      ok: true,
      forwarded,
      data: {
        name: record.name,
        email: record.email,
        phone: record.phone,
        service: record.service,
        estimate: record.estimate,
        date: record.timestamp,
        details_summary: record.details_summary,
      },
    });
  } catch (err) {
    console.error("[/api/quote] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

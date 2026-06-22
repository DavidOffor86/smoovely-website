import { NextResponse } from "next/server";

/* ---------------------------------------------------------------------------
 * Contact form submission endpoint.
 * Mirrors /api/quote: forwards a flat record to the Power Automate webhook
 * (and optional Resend email), and always logs locally so nothing is lost in
 * dev. Ready for backend connection — set POWER_AUTOMATE_WEBHOOK_URL in prod.
 * ------------------------------------------------------------------------- */

export async function POST(req) {
  try {
    const body = await req.json();
    const { name = "", email = "", phone = "", message = "", submittedAt } = body || {};

    // Basic validation — name, email and message are required.
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const record = {
      timestamp: submittedAt || new Date().toISOString(),
      type: "contact-enquiry",
      name,
      email,
      phone,
      message,
      source: "contact-page",
    };

    let forwarded = false;
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      forwarded = res.ok;
      if (!res.ok) {
        console.error("[/api/contact] Power Automate responded", res.status);
      }
    }

    // Optional direct email notification (Resend) — only if configured.
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
            subject: `New contact enquiry — ${name}`,
            text:
              `New contact form submission\n\n` +
              `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
              `When: ${record.timestamp}\n\nMessage:\n${message}`,
          }),
        });

        // Always log the raw status so the actual Resend response is visible.
        console.log("[/api/contact] Resend status:", emailRes.status);

        // fetch does NOT throw on 4xx/5xx — inspect the response explicitly.
        // Read the body safely: Resend may return an empty body, so guard the
        // JSON parse so a parse error never masks the real status.
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
          // 401 bad key · 403 unverified sender · 422 validation, etc.
          console.error(
            "[/api/contact] Resend rejected email:",
            emailRes.status,
            payload
          );
        } else {
          console.log(
            "[/api/contact] EMAIL SENT SUCCESS — Resend id:",
            payload.id || "(no id returned)"
          );
        }
      } catch (err) {
        // Network-level failure (DNS, timeout, fetch threw).
        console.error("[/api/contact] email notify failed (network):", err);
      }
    } else {
      // Surface the silent-skip case — the #1 reason "email isn't sending".
      console.warn(
        "[/api/contact] Resend skipped — missing env:",
        !process.env.RESEND_API_KEY ? "RESEND_API_KEY " : "",
        !process.env.NOTIFY_EMAIL ? "NOTIFY_EMAIL" : ""
      );
    }

    console.log("[/api/contact] submission:", record, "forwarded:", forwarded);
    return NextResponse.json({ ok: true, forwarded });
  } catch (err) {
    console.error("[/api/contact] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

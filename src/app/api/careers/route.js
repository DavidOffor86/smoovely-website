import { NextResponse } from "next/server";
import {
  buildCareersRecord,
  buildApplicantAckEmail,
  buildCareersNotifyEmail,
  CAREERS_TO,
} from "../../../lib/careersRecord";

/* ---------------------------------------------------------------------------
 * Careers application submission endpoint.
 *
 * Receives a multipart/form-data submission (fields + optional CV file):
 *   Careers form → POST /api/careers → build a flat record → forward to Power
 *   Automate → send an ACKNOWLEDGEMENT email to the applicant + a notification
 *   email to the team with the CV attached (Resend).
 *
 * The applicant acknowledgement only needs RESEND_API_KEY (the recipient is the
 * applicant's own email). Kept separate from the other pipelines. With no env
 * set it still succeeds and logs, so local dev works.
 *
 * Env (shared — no new infra):
 *   POWER_AUTOMATE_WEBHOOK_URL   (required in prod for storage)
 *   RESEND_API_KEY               (required for emails)
 *   NOTIFY_EMAIL                 (internal recipient; defaults to support@)
 * ------------------------------------------------------------------------- */

const MAX_CV_BYTES = 8 * 1024 * 1024; // 8 MB

async function sendEmail(payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  let body = {};
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = { raw };
    }
  }
  return { ok: res.ok, status: res.status, body };
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const application = {
      name: (form.get("name") || "").toString().trim(),
      email: (form.get("email") || "").toString().trim(),
      phone: (form.get("phone") || "").toString().trim(),
      role: (form.get("role") || "").toString().trim(),
    };

    // Name + email are required (email is where the acknowledgement is sent).
    if (!application.name || !application.email) {
      return NextResponse.json(
        { ok: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Optional CV → base64 for the notification attachment / Power Automate.
    let cv = null;
    const file = form.get("cv");
    if (file && typeof file === "object" && typeof file.arrayBuffer === "function" && file.size > 0) {
      if (file.size > MAX_CV_BYTES) {
        return NextResponse.json(
          { ok: false, error: "CV is too large (max 8MB)." },
          { status: 400 }
        );
      }
      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
      cv = {
        filename: file.name || "cv",
        contentType: file.type || "application/octet-stream",
        size: file.size,
        base64,
      };
    }

    const timestamp = new Date().toISOString();
    const record = buildCareersRecord({ application, cv, timestamp });

    // 1) Forward to Power Automate (Excel / SharePoint row; CV base64 included).
    let forwarded = false;
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...record,
          cv: cv
            ? { filename: cv.filename, contentType: cv.contentType, contentBase64: cv.base64 }
            : null,
        }),
      });
      forwarded = res.ok;
      if (!res.ok) console.error("[/api/careers] Power Automate responded", res.status);
    }

    // 2) Emails (Resend). Acknowledgement → applicant; notification → team.
    let acknowledged = false;
    if (process.env.RESEND_API_KEY) {
      // Applicant acknowledgement (the key "no email received" fix).
      try {
        const ack = await sendEmail({
          from: "Smoovely <support@smoovelylogistics.com>",
          to: application.email,
          subject: "We've received your application — Smoovely",
          text: buildApplicantAckEmail(record),
        });
        acknowledged = ack.ok;
        if (!ack.ok) {
          console.error("[/api/careers] acknowledgement rejected:", ack.status, ack.body);
        } else {
          console.log("[/api/careers] acknowledgement sent:", ack.body.id || "(no id)");
        }
      } catch (err) {
        console.error("[/api/careers] acknowledgement failed (network):", err);
      }

      // Internal notification with the CV attached.
      try {
        const notify = await sendEmail({
          from: "Smoovely <support@smoovelylogistics.com>",
          to: process.env.NOTIFY_EMAIL || CAREERS_TO,
          subject: `New careers application — ${application.name}`,
          text: buildCareersNotifyEmail(record),
          attachments: cv ? [{ filename: cv.filename, content: cv.base64 }] : undefined,
        });
        if (!notify.ok) {
          console.error("[/api/careers] notification rejected:", notify.status, notify.body);
        } else {
          console.log("[/api/careers] notification sent:", notify.body.id || "(no id)");
        }
      } catch (err) {
        console.error("[/api/careers] notification failed (network):", err);
      }
    } else {
      console.warn("[/api/careers] Resend skipped — missing RESEND_API_KEY (no acknowledgement sent)");
    }

    console.log("[/api/careers] submission:", {
      name: record.name,
      role: record.role,
      cvProvided: record.cvProvided,
      forwarded,
      acknowledged,
    });

    return NextResponse.json({ ok: true, forwarded, acknowledged });
  } catch (err) {
    console.error("[/api/careers] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

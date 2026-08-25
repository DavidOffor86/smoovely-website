"use client";

import { useState } from "react";
import Link from "next/link";
import SignaturePad from "./SignaturePad";
import { Field, TextInput, CheckRow, SubmitButton } from "./FormBits";

/* ---------------------------------------------------------------------------
 * Booking Acceptance form (Phase E, Features 1 & 2).
 *
 * Captures quote reference, full name, move date, explicit consent to the
 * quotation and Terms & Conditions, and a canvas digital signature. Posts to
 * /api/operations (type: "acceptance"); IP / browser / timestamp / terms
 * version are stamped server-side.
 * ------------------------------------------------------------------------- */

export default function BookingAcceptanceForm() {
  const [form, setForm] = useState({
    quoteReference: "",
    customerName: "",
    moveDate: "",
    acceptQuote: false,
    acceptTerms: false,
    signature: "",
  });
  const [status, setStatus] = useState("idle"); // idle|sending|done|error
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.quoteReference.trim() &&
    form.customerName.trim() &&
    form.moveDate &&
    form.acceptQuote &&
    form.acceptTerms &&
    form.signature;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending" || !valid) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "acceptance", ...form }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setStatus("done");
    } catch (err) {
      console.error("[BookingAcceptanceForm] submit failed:", err);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-green" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-navy">Booking accepted</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Thank you, {form.customerName}. Your acceptance and signature have been
          recorded against {form.quoteReference}. Our team will be in touch to
          confirm the next steps.
        </p>
        <div className="mt-8">
          <Link
            href={`/booking/${encodeURIComponent(form.quoteReference)}`}
            className="inline-flex items-center justify-center rounded-lg bg-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-green/90"
          >
            View your booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Quote Reference" required>
          <TextInput
            placeholder="e.g. SM-10432"
            value={form.quoteReference}
            onChange={(e) => set("quoteReference", e.target.value)}
          />
        </Field>
        <Field label="Move Date" required>
          <TextInput type="date" value={form.moveDate} onChange={(e) => set("moveDate", e.target.value)} />
        </Field>
      </div>

      <Field label="Full Name" required>
        <TextInput
          placeholder="Your full name"
          value={form.customerName}
          onChange={(e) => set("customerName", e.target.value)}
        />
      </Field>

      <div className="space-y-2">
        <CheckRow checked={form.acceptQuote} onChange={(v) => set("acceptQuote", v)}>
          I accept this quotation
        </CheckRow>
        <CheckRow checked={form.acceptTerms} onChange={(v) => set("acceptTerms", v)}>
          I accept the Terms &amp; Conditions
        </CheckRow>
      </div>

      <Field label="Digital Signature" required>
        <SignaturePad value={form.signature} onChange={(sig) => set("signature", sig)} />
      </Field>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again, or contact us directly.
        </p>
      )}

      <SubmitButton disabled={!valid || status === "sending"} sending={status === "sending"}>
        Accept Booking
      </SubmitButton>
      {!valid && (
        <p className="text-center text-xs text-gray-400">
          Complete all fields, tick both boxes and sign to continue.
        </p>
      )}
    </form>
  );
}

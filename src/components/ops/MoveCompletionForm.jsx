"use client";

import { useState } from "react";
import SignaturePad from "./SignaturePad";
import { Field, TextInput, YesNo, SubmitButton } from "./FormBits";

/* ---------------------------------------------------------------------------
 * Move Completion form (Phase E, Features 8, 9 & 10).
 *
 * Confirms whether all items were received safely, captures a digital
 * signature, and — when "No" — opens an issue with description, comments and an
 * optional photo URL. Posts to /api/operations (type: "completion"); IP /
 * browser / timestamp are stamped server-side.
 * ------------------------------------------------------------------------- */

export default function MoveCompletionForm() {
  const [form, setForm] = useState({
    quoteReference: "",
    completionStatus: "",
    customerName: "",
    signature: "",
    issueDescription: "",
    comments: "",
    photoUrl: "",
  });
  const [status, setStatus] = useState("idle");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const hasIssue = form.completionStatus === "No";
  const valid =
    form.quoteReference.trim() &&
    form.completionStatus &&
    form.customerName.trim() &&
    form.signature &&
    (!hasIssue || form.issueDescription.trim());

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending" || !valid) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "completion", ...form }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setStatus("done");
    } catch (err) {
      console.error("[MoveCompletionForm] submit failed:", err);
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
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-navy">Move confirmed</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          {hasIssue
            ? "Thank you — we've logged the issue you reported and our team will be in touch to resolve it."
            : "Thank you for confirming your move is complete. We'd love to hear your feedback next."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Quote Reference" required>
        <TextInput
          placeholder="e.g. SM-10432"
          value={form.quoteReference}
          onChange={(e) => set("quoteReference", e.target.value)}
        />
      </Field>

      <Field label="Were all items received safely?" required>
        <YesNo value={form.completionStatus} onChange={(v) => set("completionStatus", v)} />
      </Field>

      {hasIssue && (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <Field label="Issue Description" required>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
              placeholder="Tell us what went wrong…"
              value={form.issueDescription}
              onChange={(e) => set("issueDescription", e.target.value)}
            />
          </Field>
          <Field label="Comments">
            <textarea
              rows={2}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
              placeholder="Anything else we should know? (optional)"
              value={form.comments}
              onChange={(e) => set("comments", e.target.value)}
            />
          </Field>
          <Field label="Photo URL" hint="Link to a photo of any damage (optional)">
            <TextInput
              placeholder="https://…"
              value={form.photoUrl}
              onChange={(e) => set("photoUrl", e.target.value)}
            />
          </Field>
        </div>
      )}

      <Field label="Full Name" required>
        <TextInput
          placeholder="Your full name"
          value={form.customerName}
          onChange={(e) => set("customerName", e.target.value)}
        />
      </Field>

      <Field label="Digital Signature" required>
        <SignaturePad value={form.signature} onChange={(sig) => set("signature", sig)} />
      </Field>

      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      <SubmitButton disabled={!valid || status === "sending"} sending={status === "sending"}>
        Confirm Completion
      </SubmitButton>
    </form>
  );
}

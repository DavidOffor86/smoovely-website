"use client";

import { useState } from "react";
import {
  CHECKLIST_QUESTIONS,
  OPERATIONS_NOTES_FIELDS,
  moveReadinessScore,
} from "../../lib/operationsRecord";
import { Field, TextInput, YesNo, SubmitButton } from "./FormBits";

/* ---------------------------------------------------------------------------
 * Pre-Move Checklist form (Phase E, Features 3, 4 & 5).
 *
 * Captures the pre-move checklist, shows a live Move Readiness %, and collects
 * operations notes (parking, access, lift, building contact, codes, special
 * instructions). Posts to /api/operations (type: "checklist").
 * ------------------------------------------------------------------------- */

export default function PreMoveChecklistForm() {
  const [quoteReference, setQuoteReference] = useState("");
  const [responses, setResponses] = useState({});
  const [notes, setNotes] = useState({});
  const [status, setStatus] = useState("idle");

  const setResponse = (k, v) => setResponses((r) => ({ ...r, [k]: v }));
  const setNote = (k, v) => setNotes((n) => ({ ...n, [k]: v }));

  const readiness = moveReadinessScore(responses);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending" || !quoteReference.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "checklist", quoteReference, responses, notes }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setStatus("done");
    } catch (err) {
      console.error("[PreMoveChecklistForm] submit failed:", err);
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
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-navy">Checklist submitted</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Thanks — your move readiness is <strong>{readiness}%</strong>. Anything
          outstanding will be confirmed with you before move day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Field label="Quote Reference" required>
        <TextInput
          placeholder="e.g. SM-10432"
          value={quoteReference}
          onChange={(e) => setQuoteReference(e.target.value)}
        />
      </Field>

      {/* Move Readiness meter */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-navy">
          <span>Move Readiness</span>
          <span>{readiness}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-green transition-all duration-300"
            style={{ width: `${readiness}%` }}
            role="progressbar"
            aria-valuenow={readiness}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {CHECKLIST_QUESTIONS.map((q) => (
          <div key={q.key} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-3">
            <span className="text-sm font-medium text-gray-800">{q.label}</span>
            <div className="w-28 shrink-0">
              <YesNo value={responses[q.key] || ""} onChange={(v) => setResponse(q.key, v)} />
            </div>
          </div>
        ))}
      </div>

      {/* Operations notes */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-800">Operations notes (optional)</h3>
        <div className="space-y-3">
          {OPERATIONS_NOTES_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <TextInput
                placeholder={f.label}
                value={notes[f.key] || ""}
                onChange={(e) => setNote(f.key, e.target.value)}
              />
            </Field>
          ))}
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      <SubmitButton disabled={!quoteReference.trim() || status === "sending"} sending={status === "sending"}>
        Submit Checklist
      </SubmitButton>
    </form>
  );
}

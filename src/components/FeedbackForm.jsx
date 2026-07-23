"use client";

import { useState } from "react";
import Link from "next/link";
import { npsCategory } from "../lib/feedbackRecord";

/* ---------------------------------------------------------------------------
 * Customer feedback form (Phase B).
 *
 * Six short sections designed to complete in under two minutes, then a success
 * screen with a Google Review CTA and a "Continue" button to the (not yet
 * built) What's Next journey. Posts to /api/feedback, which mirrors the quote
 * pipeline (Power Automate + Resend). Self-contained, mobile-first.
 * ------------------------------------------------------------------------- */

// Smoovely's Google Business review link. Can be overridden per-environment via
// NEXT_PUBLIC_GOOGLE_REVIEW_URL; otherwise the live default below is used.
const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
  "https://g.page/r/CWBz1lkamy9_EBM/review";

const WOULD_USE_AGAIN = ["Definitely", "Probably", "Maybe", "No"];

const STAR_FIELDS = [
  { key: "professionalism", label: "Professionalism" },
  { key: "communication", label: "Communication" },
  { key: "punctuality", label: "Punctuality" },
  { key: "careOfItems", label: "Care Taken With Belongings" },
];

const initialForm = {
  overallSatisfaction: null,
  npsScore: null,
  professionalism: 0,
  communication: 0,
  punctuality: 0,
  careOfItems: 0,
  wouldUseAgain: "",
  positiveFeedback: "",
  improvementFeedback: "",
};

/* ----- Section shell -------------------------------------------------------- */
function Section({ index, title, question, children }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 w-full">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green/10 text-[11px]">
            {index}
          </span>
          {title}
        </span>
        {question && (
          <span className="mt-2 block text-base font-medium text-navy">{question}</span>
        )}
      </legend>
      {children}
    </fieldset>
  );
}

/* ----- Numeric scale (1–10 / 0–10) ------------------------------------------ */
function ScaleSelector({ min, max, value, onChange, lowLabel, highLabel }) {
  const options = [];
  for (let n = min; n <= max; n += 1) options.push(n);
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2">
        {options.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={active}
              aria-label={`${n} out of ${max}`}
              onClick={() => onChange(n)}
              className={`flex h-11 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                active
                  ? "border-green bg-green text-white shadow-sm shadow-green/25"
                  : "border-slate-300 bg-white text-navy hover:border-green hover:bg-green/5"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      {(lowLabel || highLabel) && (
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ----- Star rating (1–5) ---------------------------------------------------- */
function StarRating({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm font-medium text-navy">{label}</span>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => onChange(star)}
              className="p-0.5 text-2xl leading-none transition hover:scale-110"
            >
              <span className={filled ? "text-amber-400" : "text-slate-300"}>★</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ----- Choice pills --------------------------------------------------------- */
function ChoiceGroup({ options, value, onChange, ariaLabel }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
              active
                ? "border-green bg-green text-white shadow-sm shadow-green/25"
                : "border-slate-300 bg-white text-navy hover:border-green hover:bg-green/5"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ----- Success screen ------------------------------------------------------- */
function SuccessScreen() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-green"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="mt-5 text-2xl font-bold tracking-tight text-navy">Thank You</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        Thank you for choosing Smoovely Logistics. We appreciate your feedback and
        continuously use it to improve our service.
      </p>

      {/* Google Review CTA */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="text-2xl tracking-wide text-amber-400" aria-hidden="true">
          ★★★★★
        </div>
        <p className="mt-2 text-sm font-medium text-navy">
          Would you be willing to leave us a Google Review?
        </p>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90"
        >
          Leave A Google Review
        </a>
      </div>

      {/* Next step CTA → What's Next (placeholder for now) */}
      <div className="mt-6">
        <p className="text-sm font-medium text-navy">
          How can we help with your next step?
        </p>
        <Link
          href="/whats-next"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-green px-6 py-3.5 text-sm font-semibold text-green transition hover:bg-green/5"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}

export default function FeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const liveNps = form.npsScore == null ? "" : npsCategory(form.npsScore);
  const npsBadgeColour =
    liveNps === "Promoter"
      ? "bg-green/10 text-green"
      : liveNps === "Passive"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-600";

  const validate = () => {
    const e = {};
    if (form.overallSatisfaction == null) e.overallSatisfaction = "Please pick a score.";
    if (form.npsScore == null) e.npsScore = "Please pick a score.";
    for (const { key, label } of STAR_FIELDS) {
      if (!form[key]) e[key] = `Please rate ${label.toLowerCase()}.`;
    }
    if (!form.wouldUseAgain) e.wouldUseAgain = "Please choose an option.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") return <SuccessScreen />;

  const err = (key) =>
    errors[key] ? <p className="mt-2 text-xs text-red-500">{errors[key]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {/* 1 — Overall experience */}
      <Section
        index={1}
        title="Overall experience"
        question="How satisfied were you with your move?"
      >
        <ScaleSelector
          min={1}
          max={10}
          value={form.overallSatisfaction}
          onChange={(n) => set("overallSatisfaction", n)}
          lowLabel="Very unsatisfied"
          highLabel="Very satisfied"
        />
        {err("overallSatisfaction")}
      </Section>

      {/* 2 — Net Promoter Score */}
      <Section
        index={2}
        title="Recommend us"
        question="How likely are you to recommend Smoovely to friends, family or colleagues?"
      >
        <ScaleSelector
          min={0}
          max={10}
          value={form.npsScore}
          onChange={(n) => set("npsScore", n)}
          lowLabel="Not likely"
          highLabel="Extremely likely"
        />
        {liveNps && (
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${npsBadgeColour}`}
          >
            {liveNps}
          </span>
        )}
        {err("npsScore")}
      </Section>

      {/* 3 — Service performance */}
      <Section index={3} title="Service performance" question="How did our team do?">
        <div className="rounded-xl border border-slate-200 px-4">
          {STAR_FIELDS.map(({ key, label }) => (
            <StarRating
              key={key}
              label={label}
              value={form[key]}
              onChange={(n) => set(key, n)}
            />
          ))}
        </div>
        {STAR_FIELDS.some(({ key }) => errors[key]) && (
          <p className="mt-2 text-xs text-red-500">Please rate each area above.</p>
        )}
      </Section>

      {/* 4 — Future relationship */}
      <Section index={4} title="Future relationship" question="Would you use Smoovely again?">
        <ChoiceGroup
          options={WOULD_USE_AGAIN}
          value={form.wouldUseAgain}
          onChange={(v) => set("wouldUseAgain", v)}
          ariaLabel="Would you use Smoovely again?"
        />
        {err("wouldUseAgain")}
      </Section>

      {/* 5 — Positive feedback */}
      <Section index={5} title="What went well" question="What did we do particularly well?">
        <textarea
          rows={4}
          aria-label="What did we do particularly well?"
          className="w-full rounded-lg border border-slate-300 p-3 text-sm text-navy outline-none transition focus:border-green focus:ring-2 focus:ring-green/30"
          placeholder="Tell us what you loved… (optional)"
          value={form.positiveFeedback}
          onChange={(e) => set("positiveFeedback", e.target.value)}
        />
      </Section>

      {/* 6 — Improvement feedback */}
      <Section index={6} title="What we can improve" question="What could we improve?">
        <textarea
          rows={4}
          aria-label="What could we improve?"
          className="w-full rounded-lg border border-slate-300 p-3 text-sm text-navy outline-none transition focus:border-green focus:ring-2 focus:ring-green/30"
          placeholder="Anything we could do better next time… (optional)"
          value={form.improvementFeedback}
          onChange={(e) => set("improvementFeedback", e.target.value)}
        />
      </Section>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again, or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {status === "sending" ? "Sending…" : "Submit Feedback"}
      </button>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/* ---------------------------------------------------------------------------
 * What's Next — opportunity capture survey (Phase C).
 *
 * A mobile-first, one-question-per-screen wizard designed to complete in under
 * 60 seconds. Single-select questions auto-advance; free-text, multi-select and
 * consent use an explicit Continue. The branch of questions shown is driven
 * entirely by the first answer (nextMoveType). Posts to /api/whats-next, which
 * mirrors the quote and feedback pipelines (Power Automate + Resend).
 *
 * Customer experience first: minimum questions per branch, Back always
 * available, clear progress, generous tap targets. Self-contained.
 * ------------------------------------------------------------------------- */

const MOVE_TYPES = [
  "I'm settled for now",
  "Looking to buy",
  "Looking to rent",
  "Student accommodation",
  "Relocating for work",
  "Property investor",
  "Not sure yet",
];

const TIMELINE = [
  "Immediately",
  "Within 3 Months",
  "Within 6 Months",
  "6+ Months",
  "Just Exploring",
];

const PROPERTY_SIZE = ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "4+ Bedroom"];

const BUY_BUDGET = ["Under £250k", "£250k–£500k", "£500k–£750k", "£750k+"];
const RENT_BUDGET = ["Under £1,000", "£1,000–£1,500", "£1,500–£2,000", "£2,000+"];

const HOUSEHOLD = ["Just Me", "Couple", "Family", "Students", "Other"];
const INVESTMENT = ["Buy To Let", "HMO", "Development"];

const SUPPORT = [
  "Estate Agent Support",
  "Mortgage Advice",
  "Solicitor",
  "Property Search",
  "Storage",
  "Packing Services",
  "House Clearance",
  "Utilities Setup",
  "Nothing Else",
];

const CONSENT_TEXT =
  "I agree that Smoovely may share my details with carefully selected partners who may be able to assist with my requirements.";

/* ----- Step definitions ------------------------------------------------------
 * Each step declares how to render itself and which record field it stores into.
 * `targetArea`/`destinationArea` both store into targetArea; `budgetBuy`/
 * `budgetRent` both store into budgetRange. */
const STEP_LIBRARY = {
  nextMoveType: {
    type: "single",
    eyebrow: "Your next step",
    question: "How can we help with your next step?",
    options: MOVE_TYPES,
    store: "nextMoveType",
  },
  targetArea: {
    type: "text",
    eyebrow: "Location",
    question: "Which area are you interested in?",
    store: "targetArea",
    placeholder: "e.g. Manchester, M20",
  },
  destinationArea: {
    type: "text",
    eyebrow: "Location",
    question: "Which area are you relocating to?",
    store: "targetArea",
    placeholder: "e.g. London, SW1",
  },
  timeline: {
    type: "single",
    eyebrow: "Timing",
    question: "When are you hoping to move?",
    options: TIMELINE,
    store: "timeline",
  },
  propertySize: {
    type: "single",
    eyebrow: "Property",
    question: "What size property are you looking for?",
    options: PROPERTY_SIZE,
    store: "propertySize",
  },
  budgetBuy: {
    type: "single",
    eyebrow: "Budget",
    question: "What is your purchase budget?",
    options: BUY_BUDGET,
    store: "budgetRange",
  },
  budgetRent: {
    type: "single",
    eyebrow: "Budget",
    question: "What is your monthly budget?",
    options: RENT_BUDGET,
    store: "budgetRange",
  },
  householdType: {
    type: "single",
    eyebrow: "Household",
    question: "Who will be moving?",
    options: HOUSEHOLD,
    store: "householdType",
  },
  investmentType: {
    type: "single",
    eyebrow: "Investment",
    question: "What type of investment are you considering?",
    options: INVESTMENT,
    store: "investmentType",
  },
  storageRequired: {
    type: "single",
    eyebrow: "Storage",
    question: "Will you need storage as part of your move?",
    options: ["Yes", "No"],
    store: "storageRequired",
  },
  additionalSupport: {
    type: "multi",
    eyebrow: "Additional support",
    question: "Would any of these be useful?",
    options: SUPPORT,
    store: "additionalSupport",
  },
  consent: {
    type: "consent",
    eyebrow: "Consent",
    question:
      "Would you like us to connect you with trusted partners who may be able to help?",
    options: ["Yes", "No"],
    store: "partnerConsent",
  },
};

// Question branch per intent. Every branch ends with additionalSupport + consent.
function branchFor(nextMoveType) {
  switch (nextMoveType) {
    case "Looking to buy":
      return ["targetArea", "timeline", "propertySize", "budgetBuy"];
    case "Looking to rent":
      return ["targetArea", "timeline", "propertySize", "budgetRent", "householdType"];
    case "Student accommodation":
      return ["targetArea", "timeline", "budgetRent"];
    case "Relocating for work":
      return ["destinationArea", "timeline", "storageRequired"];
    case "Property investor":
      return ["targetArea", "timeline", "investmentType", "budgetBuy"];
    // "I'm settled for now" and "Not sure yet" skip straight to support.
    default:
      return [];
  }
}

function buildStepIds(nextMoveType) {
  return ["nextMoveType", ...branchFor(nextMoveType), "additionalSupport", "consent"];
}

const initialForm = {
  nextMoveType: "",
  targetArea: "",
  timeline: "",
  propertySize: "",
  budgetRange: "",
  householdType: "",
  investmentType: "",
  storageRequired: "",
  additionalSupport: [],
  partnerConsent: "",
};

/* ----- Choice pills (single-select) ----------------------------------------- */
function ChoiceGroup({ options, value, onSelect, ariaLabel }) {
  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(opt)}
            className={`rounded-xl border px-4 py-4 text-left text-sm font-semibold transition ${
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

/* ----- Multi-select pills --------------------------------------------------- */
function MultiGroup({ options, values, onToggle, ariaLabel }) {
  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(opt)}
            className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-4 text-left text-sm font-semibold transition ${
              active
                ? "border-green bg-green text-white shadow-sm shadow-green/25"
                : "border-slate-300 bg-white text-navy hover:border-green hover:bg-green/5"
            }`}
          >
            <span>{opt}</span>
            {active && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
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
        We&apos;ll review your information and contact you if we can help with your
        next step.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90"
        >
          Contact Us
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-green px-6 py-3.5 text-sm font-semibold text-green transition hover:bg-green/5"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function WhatsNextSurvey() {
  const [form, setForm] = useState(initialForm);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const stepIds = useMemo(() => buildStepIds(form.nextMoveType), [form.nextMoveType]);
  const total = stepIds.length;
  const stepId = stepIds[Math.min(index, total - 1)];
  const step = STEP_LIBRARY[stepId];
  const isLast = index === total - 1;

  const goBack = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));

  // Single-select: store the value then auto-advance (unless it's the last
  // step, which is the consent submit and handled separately).
  const onSelectSingle = (value) => {
    setForm((f) => ({ ...f, [step.store]: value }));
    window.setTimeout(goNext, 180);
  };

  const onToggleSupport = (opt) => {
    setForm((f) => {
      const current = f.additionalSupport;
      // "Nothing Else" is exclusive both ways.
      if (opt === "Nothing Else") {
        return { ...f, additionalSupport: current.includes(opt) ? [] : ["Nothing Else"] };
      }
      const withoutNothing = current.filter((x) => x !== "Nothing Else");
      return {
        ...f,
        additionalSupport: withoutNothing.includes(opt)
          ? withoutNothing.filter((x) => x !== opt)
          : [...withoutNothing, opt],
      };
    });
  };

  const setText = (value) => setForm((f) => ({ ...f, [step.store]: value }));

  const submit = async () => {
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/whats-next", {
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

  // Continue is enabled only once the current step has a valid answer.
  const canContinue = (() => {
    if (step.type === "text") return form[step.store].trim().length > 0;
    if (step.type === "multi") return form.additionalSupport.length > 0;
    if (step.type === "consent") return form.partnerConsent === "Yes" || form.partnerConsent === "No";
    return true;
  })();

  const progressPct = Math.round(((index + 1) / total) * 100);

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-green">
          <span>{step.eyebrow}</span>
          <span className="text-slate-400">
            Step {index + 1} of {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-green transition-all duration-300"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
        {step.question}
      </h2>

      <div className="mt-6">
        {step.type === "single" && (
          <ChoiceGroup
            options={step.options}
            value={form[step.store]}
            onSelect={onSelectSingle}
            ariaLabel={step.question}
          />
        )}

        {step.type === "text" && (
          <input
            type="text"
            autoFocus
            aria-label={step.question}
            className="w-full rounded-lg border border-slate-300 p-3.5 text-sm text-navy outline-none transition focus:border-green focus:ring-2 focus:ring-green/30"
            placeholder={step.placeholder}
            value={form[step.store]}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canContinue) goNext();
            }}
          />
        )}

        {step.type === "multi" && (
          <>
            <p className="mb-3 text-xs text-slate-400">Select any that apply.</p>
            <MultiGroup
              options={step.options}
              values={form.additionalSupport}
              onToggle={onToggleSupport}
              ariaLabel={step.question}
            />
          </>
        )}

        {step.type === "consent" && (
          <>
            <ChoiceGroup
              options={step.options}
              value={form.partnerConsent}
              onSelect={(v) => setForm((f) => ({ ...f, partnerConsent: v }))}
              ariaLabel={step.question}
            />
            <p className="mt-4 rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
              {CONSENT_TEXT}
            </p>
          </>
        )}
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-500">
          Something went wrong. Please try again, or contact us directly.
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {index > 0 ? (
          <button
            type="button"
            onClick={goBack}
            disabled={status === "sending"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-navy disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        ) : (
          <span />
        )}

        {/* Single-select auto-advances, so it needs no Continue button. */}
        {step.type !== "single" &&
          (isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={!canContinue || status === "sending"}
              className="inline-flex items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {status === "sending" ? "Submitting…" : "Submit"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="inline-flex items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Continue
            </button>
          ))}
      </div>
    </div>
  );
}

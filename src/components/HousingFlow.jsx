"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  HOUSING_SERVICES,
  ORGANISATION_TYPES,
  HOUSING_TIMESCALES,
  HOUSING_SUPPORT,
  OPPORTUNITY_TYPES,
  ANNUAL_VOLUMES,
} from "../lib/housingRecord";
import { ATTRIBUTION_DEFAULTS } from "../lib/leadAttribution";
import LeadAttributionStep, { useReferralParam } from "./quote/LeadAttributionStep";
import ReviewSummary from "./quote/ReviewSummary";

/* ---------------------------------------------------------------------------
 * Housing & Property Services flow for the QuickMove configurator.
 *
 * A PROPOSAL request — NOT a priced quote. There is no pricing anywhere in this
 * flow: the final screen confirms receipt and promises a follow-up, never an
 * estimate. Self-contained; reuses the shared Lead Attribution + Review Summary
 * components so it matches the other configurators. Posts to /api/housing.
 * ------------------------------------------------------------------------- */

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: "easeOut" },
};

/* ---- reusable UI helpers (shared language with the other flows) ---- */

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function PillGroup({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-lg border p-3 text-sm font-medium transition ${
            value === opt
              ? "border-blue-600 bg-blue-50 text-blue-800"
              : "border-gray-300 text-gray-700 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CheckGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((label) => {
        const active = !!value[label];
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange({ ...value, [label]: !active })}
            className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition ${
              active
                ? "border-blue-600 bg-blue-50 font-medium text-blue-800"
                : "border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"
              }`}
            >
              {active && "✓"}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

const STEPS = [
  "service",
  "organisation",
  "opportunity",
  "volume",
  "address",
  "timescale",
  "support",
  "project",
  "contact",
  "leadAttribution",
  "review",
  "final",
];

export default function HousingFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    serviceRequired: "",
    organisationType: "",
    opportunityType: "",
    annualVolume: "",
    address: "",
    postcode: "",
    propertyReference: "",
    timescale: "",
    support: {},
    projectDetails: "",
    organisation: "",
    name: "",
    email: "",
    phone: "",
    ...ATTRIBUTION_DEFAULTS,
  });
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle|sending|done|error

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Pre-fill lead attribution from a ?ref= referral URL (editable afterwards).
  useReferralParam(setForm);

  const totalSteps = STEPS.length;
  const current = STEPS[step - 1];

  const contactValid = form.organisation && form.name && form.email;
  const canContinue =
    (current !== "service" || !!form.serviceRequired) &&
    (current !== "contact" || contactValid) &&
    (current !== "leadAttribution" || !!form.leadSource);

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  // Request Proposal — submits the enquiry (Power Automate row + Resend email)
  // and advances to the confirmation screen. No pricing is ever shown.
  const submitProposal = async () => {
    if (submitStatus === "sending") return;
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/housing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "housing-configurator",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setSubmitStatus("done");
      goNext();
    } catch (err) {
      console.error("[HousingFlow] Request Proposal submit failed:", err);
      setSubmitStatus("error");
    }
  };

  // Standardised Review Summary sections (empty rows are dropped downstream).
  const reviewSections = [
    {
      title: "Service Details",
      rows: [
        { label: "Service Required", value: form.serviceRequired },
        { label: "Organisation Type", value: form.organisationType },
        { label: "Opportunity Type", value: form.opportunityType },
        { label: "Annual Volume", value: form.annualVolume },
        { label: "Timescale", value: form.timescale },
        {
          label: "Support Requirements",
          value: Object.keys(form.support)
            .filter((k) => form.support[k])
            .join(", "),
        },
      ],
    },
    {
      title: "Location Details",
      rows: [
        { label: "Property Address", value: form.address },
        { label: "Postcode", value: form.postcode },
        { label: "Property Reference", value: form.propertyReference },
      ],
    },
    {
      title: "Contact Details",
      rows: [
        { label: "Organisation", value: form.organisation },
        { label: "Contact Name", value: form.name },
        { label: "Email", value: form.email },
        { label: "Phone", value: form.phone },
      ],
    },
    {
      title: "Lead Attribution",
      rows: [
        { label: "Lead Source", value: form.leadSource },
        { label: "Referrer Name", value: form.referrerName },
        { label: "Lead Source Code", value: form.leadSourceCode },
      ],
    },
    {
      title: "Additional Information",
      rows: [{ label: "Project Details", value: form.projectDetails }],
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Step indicator */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Housing & Property Services</span>
          <span>
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} {...stepMotion}>
          {/* STEP — Service required */}
          {current === "service" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What service do you require?
              </h2>
              <PillGroup
                options={HOUSING_SERVICES}
                value={form.serviceRequired}
                onChange={(v) => set("serviceRequired", v)}
              />
            </div>
          )}

          {/* STEP — Organisation type */}
          {current === "organisation" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What type of organisation are you?
              </h2>
              <PillGroup
                options={ORGANISATION_TYPES}
                value={form.organisationType}
                onChange={(v) => set("organisationType", v)}
              />
            </div>
          )}

          {/* STEP — Opportunity type (commercial qualification) */}
          {current === "opportunity" && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                What type of opportunity is this?
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                Helps us shape the right partnership — optional.
              </p>
              <PillGroup
                options={OPPORTUNITY_TYPES}
                value={form.opportunityType}
                onChange={(v) => set("opportunityType", v)}
              />
            </div>
          )}

          {/* STEP — Estimated annual volume (commercial qualification) */}
          {current === "volume" && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                Estimated annual volume
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                A rough idea of yearly jobs — optional.
              </p>
              <PillGroup
                options={ANNUAL_VOLUMES}
                value={form.annualVolume}
                onChange={(v) => set("annualVolume", v)}
              />
            </div>
          )}

          {/* STEP — Property address */}
          {current === "address" && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">
                Property address
              </h2>
              <Field label="Address">
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="Property address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Postcode">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. SE10 9AB"
                    value={form.postcode}
                    onChange={(e) => set("postcode", e.target.value)}
                  />
                </Field>
                <Field label="Property Reference">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="Internal ref (optional)"
                    value={form.propertyReference}
                    onChange={(e) => set("propertyReference", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP — Timescale */}
          {current === "timescale" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What is your timescale?
              </h2>
              <PillGroup
                options={HOUSING_TIMESCALES}
                value={form.timescale}
                onChange={(v) => set("timescale", v)}
              />
            </div>
          )}

          {/* STEP — Support requirements */}
          {current === "support" && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                Support requirements
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                Select any that apply.
              </p>
              <CheckGrid
                options={HOUSING_SUPPORT}
                value={form.support}
                onChange={(v) => set("support", v)}
              />
            </div>
          )}

          {/* STEP — Project details */}
          {current === "project" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Tell us about the project
              </h2>
              <textarea
                rows={5}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                placeholder="Number of properties, resident circumstances, access, deadlines, anything else we should know…"
                value={form.projectDetails}
                onChange={(e) => set("projectDetails", e.target.value)}
              />
            </div>
          )}

          {/* STEP — Contact details */}
          {current === "contact" && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">
                Contact details
              </h2>
              <Field label="Organisation" required>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="Organisation name"
                  value={form.organisation}
                  onChange={(e) => set("organisation", e.target.value)}
                />
              </Field>
              <Field label="Contact Name" required>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email Address" required>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="you@organisation.gov.uk"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="0…"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>
              </div>
              {!contactValid && (
                <p className="text-xs text-gray-400">
                  Organisation, contact name and email are required to continue.
                </p>
              )}
            </div>
          )}

          {/* STEP — Lead Attribution */}
          {current === "leadAttribution" && (
            <LeadAttributionStep
              leadSource={form.leadSource}
              referrerName={form.referrerName}
              onChange={set}
            />
          )}

          {/* STEP — Review Summary (no pricing; submission happens here) */}
          {current === "review" && (
            <ReviewSummary sections={reviewSections}>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={submitProposal}
                  disabled={submitStatus === "sending"}
                  className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitStatus === "sending" ? "Sending…" : "Request Proposal"}
                </button>
              </div>
              {submitStatus === "error" && (
                <p className="mt-2 text-center text-sm text-red-500">
                  Something went wrong. Please try again, or contact us directly.
                </p>
              )}
            </ReviewSummary>
          )}

          {/* STEP — Confirmation (NO pricing) */}
          {current === "final" && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 text-green-600"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
                Thank you.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
                Your proposal request has been received. A member of the Smoovely
                team will review your requirements and contact you.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Contact Us
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Return Home
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation — capture + attribution steps only (Review & Final own theirs) */}
      {current !== "review" && current !== "final" && (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={goBack}
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

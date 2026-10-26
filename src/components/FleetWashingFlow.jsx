"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  VEHICLE_TYPES,
  VEHICLE_CONDITIONS,
  EXTERIOR_SERVICES,
  INTERIOR_SERVICES,
  CLEANING_FREQUENCIES,
  SITE_ACCESS_TYPES,
  SITE_ACCESS_REQUIREMENTS,
} from "../lib/fleetWashingRecord";
import { ATTRIBUTION_DEFAULTS } from "../lib/leadAttribution";
import LeadAttributionStep, { useReferralParam } from "./quote/LeadAttributionStep";
import ReviewSummary from "./quote/ReviewSummary";

/* ---------------------------------------------------------------------------
 * Fleet Washing Services flow for the QuickMove configurator.
 *
 * 9-step assessment request (no pricing). EcoFleet Wash partner integration.
 * Reuses LeadAttributionStep and ReviewSummary. Posts to /api/fleet-washing.
 * Final screen emphasises EcoFleet Wash will contact directly.
 * ------------------------------------------------------------------------- */

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: "easeOut" },
};

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
  "business",
  "fleet",
  "condition",
  "services",
  "frequency",
  "siteAccess",
  "leadAttribution",
  "review",
  "final",
];

export default function FleetWashingFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    company: "",
    contactName: "",
    jobTitle: "",
    email: "",
    phone: "",
    siteAddress: "",
    fleetSize: { cars: 0, smallVans: 0, largeVans: 0, lutonVans: 0, hgvUnits: 0, trailers: 0, other: 0 },
    vehicleConditions: {},
    exteriorServices: {},
    interiorServices: {},
    cleaningFrequency: "",
    preferredDays: {},
    preferredTime: "",
    siteAccessType: "",
    siteAccessRequirements: {},
    ...ATTRIBUTION_DEFAULTS,
  });
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle|sending|done|error

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  useReferralParam(setForm);

  const totalSteps = STEPS.length;
  const current = STEPS[step - 1];

  const businessValid = form.company && form.contactName && form.email;
  const canContinue =
    (current !== "business" || businessValid) &&
    (current !== "leadAttribution" || !!form.leadSource);

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  const submitAssessment = async () => {
    if (submitStatus === "sending") return;
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/fleet-washing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "fleet-washing-configurator",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setSubmitStatus("done");
      goNext();
    } catch (err) {
      console.error("[FleetWashingFlow] submit failed:", err);
      setSubmitStatus("error");
    }
  };

  const reviewSections = [
    {
      title: "Business Details",
      rows: [
        { label: "Company", value: form.company },
        { label: "Contact Name", value: form.contactName },
        { label: "Job Title", value: form.jobTitle },
        { label: "Email", value: form.email },
        { label: "Phone", value: form.phone },
        { label: "Site Address", value: form.siteAddress },
      ],
    },
    {
      title: "Fleet Summary",
      rows: [
        { label: "Cars", value: form.fleetSize.cars || "" },
        { label: "Small Vans", value: form.fleetSize.smallVans || "" },
        { label: "Large Vans", value: form.fleetSize.largeVans || "" },
        { label: "Luton Vans", value: form.fleetSize.lutonVans || "" },
        { label: "HGV Units", value: form.fleetSize.hgvUnits || "" },
        { label: "Trailers", value: form.fleetSize.trailers || "" },
        { label: "Other", value: form.fleetSize.other || "" },
      ],
    },
    {
      title: "Vehicle Condition",
      rows: [
        {
          label: "Conditions",
          value: Object.keys(form.vehicleConditions)
            .filter((k) => form.vehicleConditions[k])
            .join(", "),
        },
      ],
    },
    {
      title: "Services Required",
      rows: [
        {
          label: "Exterior Services",
          value: Object.keys(form.exteriorServices)
            .filter((k) => form.exteriorServices[k])
            .join(", "),
        },
        {
          label: "Interior Services",
          value: Object.keys(form.interiorServices)
            .filter((k) => form.interiorServices[k])
            .join(", "),
        },
      ],
    },
    {
      title: "Cleaning Frequency & Availability",
      rows: [
        { label: "Frequency", value: form.cleaningFrequency },
        {
          label: "Preferred Days",
          value: Object.keys(form.preferredDays)
            .filter((k) => form.preferredDays[k])
            .join(", "),
        },
        { label: "Preferred Time", value: form.preferredTime },
      ],
    },
    {
      title: "Site Information",
      rows: [
        { label: "Site Access Type", value: form.siteAccessType },
        {
          label: "Access Requirements",
          value: Object.keys(form.siteAccessRequirements)
            .filter((k) => form.siteAccessRequirements[k])
            .join(", "),
        },
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
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Fleet Washing Services Powered by EcoFleet Wash</span>
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
          {/* STEP 1 — Business Information */}
          {current === "business" && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">Business Information</h2>
              <Field label="Company Name" required>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="Your company name"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </Field>
              <Field label="Contact Name" required>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="Contact person"
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                />
              </Field>
              <Field label="Job Title">
                <input
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="e.g. Logistics Manager"
                  value={form.jobTitle}
                  onChange={(e) => set("jobTitle", e.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email" required>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="020 XXXX XXXX"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Site Address">
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                  placeholder="Main depot or site address"
                  value={form.siteAddress}
                  onChange={(e) => set("siteAddress", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* STEP 2 — Build Your Fleet */}
          {current === "fleet" && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">Build Your Fleet</h2>
              <p className="text-center text-sm text-gray-500">How many vehicles do you have?</p>
              {Object.entries({
                cars: "Cars",
                smallVans: "Small Vans",
                largeVans: "Large Vans",
                lutonVans: "Luton Vans",
                hgvUnits: "HGV Tractor Units",
                trailers: "Trailers",
                other: "Other",
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <input
                    type="number"
                    min="0"
                    className="w-16 rounded-lg border border-gray-300 p-2 text-center"
                    value={form.fleetSize[key]}
                    onChange={(e) =>
                      set("fleetSize", { ...form.fleetSize, [key]: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 — Vehicle Condition */}
          {current === "condition" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">Vehicle Condition</h2>
              <CheckGrid
                options={VEHICLE_CONDITIONS}
                value={form.vehicleConditions}
                onChange={(v) => set("vehicleConditions", v)}
              />
            </div>
          )}

          {/* STEP 4 — Services Required */}
          {current === "services" && (
            <div className="space-y-5">
              <h2 className="text-center font-semibold text-gray-800">Services Required</h2>
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">Exterior Services</p>
                <CheckGrid
                  options={EXTERIOR_SERVICES}
                  value={form.exteriorServices}
                  onChange={(v) => set("exteriorServices", v)}
                />
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">Interior Services</p>
                <CheckGrid
                  options={INTERIOR_SERVICES}
                  value={form.interiorServices}
                  onChange={(v) => set("interiorServices", v)}
                />
              </div>
            </div>
          )}

          {/* STEP 5 — Cleaning Frequency */}
          {current === "frequency" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">Cleaning Frequency</h2>
              <PillGroup
                options={CLEANING_FREQUENCIES}
                value={form.cleaningFrequency}
                onChange={(v) => set("cleaningFrequency", v)}
              />
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700">Preferred Days</p>
                <CheckGrid
                  options={[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ]}
                  value={form.preferredDays}
                  onChange={(v) => set("preferredDays", v)}
                />
                <Field label="Preferred Time (e.g. 9am–1pm)">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="e.g. 9am–1pm"
                    value={form.preferredTime}
                    onChange={(e) => set("preferredTime", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 6 — Site Access */}
          {current === "siteAccess" && (
            <div className="space-y-5">
              <h2 className="text-center font-semibold text-gray-800">Vehicle Availability & Site Access</h2>
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">Where are your vehicles based?</p>
                <PillGroup
                  options={SITE_ACCESS_TYPES}
                  value={form.siteAccessType}
                  onChange={(v) => set("siteAccessType", v)}
                />
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">Site Access Requirements</p>
                <CheckGrid
                  options={SITE_ACCESS_REQUIREMENTS}
                  value={form.siteAccessRequirements}
                  onChange={(v) => set("siteAccessRequirements", v)}
                />
              </div>
            </div>
          )}

          {/* STEP 7 — Lead Attribution */}
          {current === "leadAttribution" && (
            <LeadAttributionStep
              leadSource={form.leadSource}
              referrerName={form.referrerName}
              onChange={set}
            />
          )}

          {/* STEP 8 — Review Summary */}
          {current === "review" && (
            <ReviewSummary sections={reviewSections}>
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative h-10 w-auto mb-3">
                  <Image
                    src="/images/fleet-washing/Eco_Fleet_Wash_Logo_1.png"
                    alt="EcoFleet Wash - Fleet Washing Services"
                    height={40}
                    width={140}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Fleet Washing Services</h3>
                <p className="text-sm font-semibold text-center text-gray-700 mb-1">Powered by EcoFleet Wash</p>
                <p className="text-xs text-center text-gray-500">In partnership with Smoovely</p>
              </div>
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
                  onClick={submitAssessment}
                  disabled={submitStatus === "sending"}
                  className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitStatus === "sending" ? "Sending…" : "Submit Fleet Assessment"}
                </button>
              </div>
              {submitStatus === "error" && (
                <p className="mt-2 text-center text-sm text-red-500">
                  Something went wrong. Please try again or contact us.
                </p>
              )}
            </ReviewSummary>
          )}

          {/* STEP 9 — Confirmation (EcoFleet Wash will contact) */}
          {current === "final" && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-6">
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

              <div className="flex justify-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative h-12 w-auto">
                  <Image
                    src="/images/fleet-washing/Eco_Fleet_Wash_Logo_1.png"
                    alt="EcoFleet Wash - Professional Fleet Washing"
                    height={48}
                    width={160}
                    className="object-contain"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
                Assessment Submitted Successfully
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-green-900 mb-2">Next Steps</p>
                <p className="text-sm text-green-800 leading-relaxed">
                  A member of the EcoFleet Wash team will contact you regarding your tailored quotation.
                  They will work directly with you to finalize the fleet washing service that meets your needs.
                </p>
              </div>
              <p className="text-xs text-gray-500">
                In partnership with Smoovely
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

      {/* Navigation */}
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

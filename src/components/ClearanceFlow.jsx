"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountEligibility from "./DiscountEligibility";
import SubmitQuoteButton from "./SubmitQuoteButton";
import { formatRange } from "../lib/pricing";
import { useServerQuote } from "../lib/useServerQuote";

/* ---------------------------------------------------------------------------
 * Home & Site Clearance flow for the QuickMove Quote configurator.
 * Self-contained — Home Removals / Office Moves / B2B / Storage untouched.
 * Uses an ordered active-steps array so the two conditional steps
 * (Site Waste, Complexity) slot in/out without leaving numbering gaps.
 * ------------------------------------------------------------------------- */

/* Clearance-type buttons — images from the EXACT provided path:
 * public/images/Home and Site Clearance Configurator
 * Only 4 source images exist, so some options reuse the closest artwork.
 */
const ICONS = "/images/Home and Site Clearance Configurator";
const clearanceTypes = [
  { id: "House Clearance", image: `${ICONS}/Home Clearance.png` },
  { id: "Flat / Apartment Clearance", image: `${ICONS}/Home Clearance.png` },
  { id: "Garage / Shed Clearance", image: `${ICONS}/Garden and Shed Clearance.png` },
  { id: "Garden Clearance", image: `${ICONS}/Garden and Shed Clearance.png` },
  { id: "Office Clearance", image: `${ICONS}/Office Clearance.png` },
  { id: "Construction Site Clearance", image: `${ICONS}/Construction Site Clearance.png` },
  { id: "Mixed Clearance", image: `${ICONS}/Home Clearance.png` },
];

const propertySizes = [
  "Single room",
  "1 bed property",
  "2 bed property",
  "3 bed property",
  "4+ property",
  "Full site clearance",
];
const loadSizes = ["¼ load", "½ load", "1 full van", "2+ loads", "Multiple truck loads"];

const contentTypes = [
  { key: "household", label: "General household items" },
  { key: "furniture", label: "Furniture" },
  { key: "whiteGoods", label: "White goods" },
  { key: "garden", label: "Garden waste" },
  { key: "construction", label: "Construction waste" },
  { key: "office", label: "Office equipment" },
  { key: "mixed", label: "Mixed waste" },
];

const specialItems = [
  { key: "heavy", label: "Heavy items (safes, pianos)", tag: "heavy_items" },
  { key: "fridges", label: "Fridges / freezers", tag: "fridges" },
  { key: "mattresses", label: "Mattresses", tag: "mattresses" },
  { key: "electrical", label: "Electrical items", tag: "electrical" },
  { key: "hazardous", label: "Hazardous materials", tag: "hazardous_items" },
];

const siteWasteTypes = [
  { key: "rubble", label: "Rubble / hardcore" },
  { key: "soil", label: "Soil / earth" },
  { key: "wood", label: "Wood" },
  { key: "metal", label: "Metal" },
  { key: "mixedSite", label: "Mixed waste" },
];

const jobConditions = [
  "Clean / organised",
  "General clutter",
  "Heavy clutter",
  "Waste piled",
  "Overgrown / neglected",
];

const additionalServices = [
  { key: "dismantling", label: "Dismantling", tag: "dismantling_required" },
  { key: "sorting", label: "Sorting / packing" },
  { key: "deepClean", label: "Deep clean" },
  { key: "gardenCutting", label: "Garden cutting" },
  { key: "sitePrep", label: "Site prep / leveling" },
];

const complexityFactors = [
  { key: "multiArea", label: "Multi-area clearance", tag: "multi_area" },
  { key: "multiProperty", label: "Multiple properties", tag: "multi_area" },
  { key: "projectManaged", label: "Project-managed job", tag: "project_managed" },
  { key: "supervision", label: "On-site supervision required", tag: "supervision" },
  { key: "restrictedHours", label: "Restricted working hours", tag: "out_of_hours" },
];

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: "easeOut" },
};

/* ---- reusable UI helpers (mirrors the other flows) ---- */

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

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-lg border p-2 text-sm font-medium transition ${
            value === opt
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
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
      {options.map((item) => {
        const active = !!value[item.key];
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange({ ...value, [item.key]: !active })}
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
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ClearanceFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    postcode: "",
    name: "",
    phone: "",
    email: "",
    clearanceType: "",
    propertySize: "",
    loadSize: "",
    content: {},
    special: {},
    specialDetail: "",
    siteWaste: {},
    siteVolume: "",
    parking: "Free",
    distance: "Short",
    floor: "Ground",
    lift: "No",
    stairs: "No",
    access: {}, // narrow / restricted / permit
    condition: "",
    disposal: "Clearance + disposal",
    skip: "No",
    recyclingPriority: "No",
    services: {},
    complexity: {},
    date: "",
    flexible: "Yes",
    urgency: "Standard",
    photos: [],
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Server-authoritative quote (single-postcode service → travel £0 in Phase 1).
  const { estimate, distanceMiles, travelComponent, loading } = useServerQuote(
    "Clearance & Disposal",
    form
  );

  // Conditional triggers
  const showSiteWaste = form.clearanceType === "Construction Site Clearance";
  const showComplexity =
    form.propertySize === "Full site clearance" ||
    form.loadSize === "2+ loads" ||
    form.loadSize === "Multiple truck loads" ||
    form.clearanceType === "Construction Site Clearance" ||
    form.clearanceType === "Mixed Clearance";

  // Ordered list of ACTIVE steps — conditional ones slot in only when triggered.
  const steps = [
    "contact",
    "type",
    "size",
    "content",
    "special",
    showSiteWaste && "siteWaste",
    "access",
    "condition",
    "disposal",
    "services",
    showComplexity && "complexity",
    "timeline",
    "upload",
    "review",
  ].filter(Boolean);

  const totalSteps = steps.length;
  const current = steps[step - 1];
  const isLast = step === totalSteps;

  const detailsValid = form.postcode && form.email;
  const canContinue = current !== "contact" || detailsValid;
  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  // Internal pricing flags — Total = Labour + Disposal + Transport + Complexity
  const buildPricingFlags = () => {
    const flags = [];
    if (form.propertySize || form.loadSize) flags.push("volume_size");
    Object.keys(form.content).forEach((k) => form.content[k] && flags.push("waste_type"));
    specialItems.forEach((s) => form.special[s.key] && flags.push(s.tag));
    if (
      form.distance === "Long" ||
      form.stairs === "Yes" ||
      form.access.narrow ||
      form.access.restricted ||
      form.access.permit
    )
      flags.push("access_difficulty");
    if (form.condition) flags.push("job_condition");
    if (form.urgency !== "Standard") flags.push("urgency");
    complexityFactors.forEach((c) => form.complexity[c.key] && flags.push(c.tag));
    additionalServices.forEach((a) => a.tag && form.services[a.key] && flags.push(a.tag));
    return [...new Set(flags)];
  };

  // Pricing is server-authoritative — computed in pricing.server.js via
  // /api/price (see useServerQuote above). No pricing constants on the client.

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Step indicator */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Home & Site Clearance</span>
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
          {/* STEP — Contact & Location */}
          {current === "contact" && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">
                Contact & location
              </h2>
              <Field label="Collection Postcode" required>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                  placeholder="e.g. SE1 1AB"
                  value={form.postcode}
                  onChange={(e) => set("postcode", e.target.value)}
                />
              </Field>
              <Field label="Full Name">
                <input
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Phone Number">
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="07…"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP — Clearance type (IMAGE SELECTOR) */}
          {current === "type" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What needs clearing?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {clearanceTypes.map((opt) => {
                  const active = form.clearanceType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("clearanceType", opt.id)}
                      className={`overflow-hidden rounded-xl border-2 bg-white text-center transition ${
                        active
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {/* Image from the provided clearance icons path */}
                      <img
                        src={opt.image}
                        alt={opt.id}
                        className="h-24 w-full bg-gray-50 object-contain p-2"
                      />
                      {/* Label UNDER the image */}
                      <span className="block px-2 pb-3 pt-1 text-sm font-semibold text-gray-800">
                        {opt.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP — Job size / volume */}
          {current === "size" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                How big is the job?
              </h2>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  By property size
                </p>
                <PillGroup
                  options={propertySizes}
                  value={form.propertySize}
                  onChange={(v) => set("propertySize", v)}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Or estimate by load
                </p>
                <PillGroup
                  options={loadSizes}
                  value={form.loadSize}
                  onChange={(v) => set("loadSize", v)}
                />
              </div>
            </div>
          )}

          {/* STEP — Content type */}
          {current === "content" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What's being cleared?
              </h2>
              <CheckGrid
                options={contentTypes}
                value={form.content}
                onChange={(v) => set("content", v)}
              />
            </div>
          )}

          {/* STEP — Special / cost items */}
          {current === "special" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Any special items?
              </h2>
              <CheckGrid
                options={specialItems}
                value={form.special}
                onChange={(v) => set("special", v)}
              />
              {Object.values(form.special).some(Boolean) && (
                <div className="mt-3">
                  <Field label="Add details (optional)">
                    <textarea
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                      placeholder="e.g. upright piano on 2nd floor, 2 chest freezers"
                      value={form.specialDetail}
                      onChange={(e) => set("specialDetail", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* STEP — Site waste type (conditional) */}
          {current === "siteWaste" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Site waste type
              </h2>
              <CheckGrid
                options={siteWasteTypes}
                value={form.siteWaste}
                onChange={(v) => set("siteWaste", v)}
              />
              <div className="mt-3">
                <Field label="Volume estimate (optional)">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="e.g. ~3 tonnes / 2 skips"
                    value={form.siteVolume}
                    onChange={(e) => set("siteVolume", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP — Access conditions */}
          {current === "access" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Access conditions
              </h2>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Parking</p>
                <Segmented
                  options={["Free", "Paid", "No Parking"]}
                  value={form.parking}
                  onChange={(v) => set("parking", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Distance to vehicle
                </p>
                <Segmented
                  options={["Short", "Medium", "Long"]}
                  value={form.distance}
                  onChange={(v) => set("distance", v)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Floor level">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="e.g. Ground, 2nd"
                    value={form.floor}
                    onChange={(e) => set("floor", e.target.value)}
                  />
                </Field>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">Lift?</p>
                  <Segmented
                    options={["Yes", "No"]}
                    value={form.lift}
                    onChange={(v) => set("lift", v)}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Stairs?</p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.stairs}
                  onChange={(v) => set("stairs", v)}
                />
              </div>
              <CheckGrid
                options={[
                  { key: "narrow", label: "Narrow access" },
                  { key: "restricted", label: "Restricted entry" },
                  { key: "permit", label: "Permit required" },
                ]}
                value={form.access}
                onChange={(v) => set("access", v)}
              />
            </div>
          )}

          {/* STEP — Job condition */}
          {current === "condition" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Job condition
              </h2>
              <PillGroup
                options={jobConditions}
                value={form.condition}
                onChange={(v) => set("condition", v)}
              />
            </div>
          )}

          {/* STEP — Disposal */}
          {current === "disposal" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Disposal
              </h2>
              <PillGroup
                options={["Clearance + disposal", "Waste collection only"]}
                value={form.disposal}
                onChange={(v) => set("disposal", v)}
              />
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Skip required?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.skip}
                  onChange={(v) => set("skip", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Recycling priority?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.recyclingPriority}
                  onChange={(v) => set("recyclingPriority", v)}
                />
              </div>
            </div>
          )}

          {/* STEP — Additional services */}
          {current === "services" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Additional services
              </h2>
              <CheckGrid
                options={additionalServices}
                value={form.services}
                onChange={(v) => set("services", v)}
              />
            </div>
          )}

          {/* STEP — Complexity (conditional) */}
          {current === "complexity" && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                A few extra details
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                For larger or multi-site clearances, these help us quote
                accurately.
              </p>
              <CheckGrid
                options={complexityFactors}
                value={form.complexity}
                onChange={(v) => set("complexity", v)}
              />
            </div>
          )}

          {/* STEP — Timeline */}
          {current === "timeline" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Timeline
              </h2>
              <Field label="Preferred date">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Flexible on date?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.flexible}
                  onChange={(v) => set("flexible", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Urgency</p>
                <Segmented
                  options={["Standard", "Next day", "Same day"]}
                  value={form.urgency}
                  onChange={(v) => set("urgency", v)}
                />
              </div>
            </div>
          )}

          {/* STEP — Image upload */}
          {current === "upload" && (
            <div>
              <h2 className="mb-2 text-center font-semibold text-gray-800">
                Add photos (optional)
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                Photos of the site help us give a more accurate quote.
              </p>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-blue-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 h-8 w-8 text-blue-600"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Tap to upload photos
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    set("photos", Array.from(e.target.files).map((f) => f.name))
                  }
                />
              </label>
              {form.photos.length > 0 && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  {form.photos.length} photo(s) selected
                </p>
              )}
            </div>
          )}

          {/* STEP — Review & submit */}
          {current === "review" && (
            <div
              className="text-center"
              data-pricing-flags={buildPricingFlags().join(",")}
            >
              <h2 className="mb-1 text-sm font-medium text-gray-500">
                Your estimated quote
              </h2>
              <p className="mb-1 text-4xl font-bold text-gray-900">
                {loading && !estimate ? "Calculating…" : formatRange(estimate)}
              </p>
              <p className="mb-4 text-xs text-gray-500">
                Estimated range · final price confirmed on site assessment
              </p>
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left text-xs text-gray-600">
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {form.clearanceType || "—"}
                </p>
                <p>
                  <span className="font-semibold">Size:</span>{" "}
                  {form.propertySize || form.loadSize || "—"}
                </p>
                <p>
                  <span className="font-semibold">Condition:</span>{" "}
                  {form.condition || "—"}
                </p>
              </div>
              <p className="mb-5 text-xs italic text-gray-500">
                We handle clearances efficiently, safely, and responsibly.
              </p>
              <SubmitQuoteButton
                service="Clearance & Disposal"
                form={form}
                estimate={estimate}
                distanceMiles={distanceMiles}
                travelComponent={travelComponent}
                label="Get My Clearance Quote"
              />
              <button
                type="button"
                onClick={goBack}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                ← Back &amp; Edit Quote
              </button>
              <DiscountEligibility
                name={form.name}
                email={form.email}
                phone={form.phone}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!isLast && (
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

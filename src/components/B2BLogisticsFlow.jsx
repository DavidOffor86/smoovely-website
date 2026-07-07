"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountEligibility from "./DiscountEligibility";
import SubmitQuoteButton from "./SubmitQuoteButton";
import { formatRange } from "../lib/pricing";
import { useServerQuote } from "../lib/useServerQuote";

/* ---------------------------------------------------------------------------
 * Enhanced B2B Delivery & Logistics flow for the QuickMove Quote configurator.
 * Self-contained — Home Removals / Office Moves / others are untouched.
 * ------------------------------------------------------------------------- */

/* Delivery-type buttons — images from the EXACT provided path:
 * public/images/B2B Delivery & Logistics - Icons
 * (best-fit mapping of the supplied artwork to each option)
 */
const ICONS = "/images/B2B Delivery & Logistics - Icons";
const deliveryTypes = [
  {
    id: "Medical Deliveries",
    label: "Medical Deliveries",
    hint: "Pharmacy / sensitive goods",
    image: `${ICONS}/B2B Delivery & Logistics - Medical Deliveries image.png`,
  },
  {
    id: "Business Deliveries",
    label: "Business Deliveries",
    image: `${ICONS}/B2B Delivery & Logistics - Retailer Deliveries image.png`,
  },
  {
    id: "Pallet Delivery",
    label: "Pallet Delivery",
    image: `${ICONS}/B2B Delivery & Logistics - Cold Goods.png`,
  },
  {
    id: "Dedicated Same-Day Delivery",
    label: "Dedicated Same-Day",
    image: `${ICONS}/B2B Delivery & Logistics - Food Deliveries image.png`,
  },
  {
    id: "Multi-drop Logistics",
    label: "Multi-drop Logistics",
    image: `${ICONS}/B2B Delivery & Logistics - Construction image.png`,
  },
];

const vehicleSizes = ["Small Van", "Medium Van", "Luton Van", "7.5T Truck"];

const goodsTypes = [
  { key: "standard", label: "Standard goods" },
  { key: "fragile", label: "Fragile items", tag: "fragile" },
  { key: "highValue", label: "High-value goods", tag: "high_value" },
  { key: "medical", label: "Medical / regulated", tag: "regulated" },
  { key: "hazardous", label: "Hazardous (flag only)", tag: "hazardous" },
];

const serviceLevels = [
  { id: "Standard", hint: "Kerbside / tail-lift" },
  { id: "Premium", hint: "Inside delivery" },
  { id: "White-glove", hint: "Placement / setup" },
];

const complexityFactors = [
  { key: "multiStops", label: "Multiple delivery stops", tag: "multi_drop" },
  { key: "returnJourney", label: "Return journey required", tag: "return_journey" },
  { key: "waiting", label: "Waiting time onsite", tag: "waiting_time" },
  { key: "restrictedWindows", label: "Restricted delivery windows", tag: "restricted_window" },
  { key: "liftBooking", label: "Lift booking required", tag: "lift_booking" },
  { key: "nightDelivery", label: "Night / early morning", tag: "out_of_hours" },
  { key: "congestion", label: "Congestion / ULEZ zone", tag: "congestion_zone" },
];

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: "easeOut" },
};

/* ---- small reusable UI helpers (mirrors the other flows) ---- */

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

export default function B2BLogisticsFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    pickupPostcode: "",
    deliveryPostcode: "",
    name: "",
    phone: "",
    email: "",
    deliveryType: "",
    siteType: "Commercial",
    parking: "Free",
    vehicleDistance: "Short",
    stairs: "No",
    lift: "No",
    loadingBay: "Yes",
    heightRestriction: "No",
    vehicleSize: "Medium Van",
    loadKind: "Palletised",
    pallets: 1,
    stackable: "Yes",
    looseSize: "Medium",
    goods: { standard: true },
    serviceLevel: "Standard",
    date: "",
    timeSlot: "Flexible",
    urgency: "Scheduled",
    factors: {},
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Server-authoritative quote (service + travel computed in /api/price).
  const { estimate, distanceMiles, travelComponent, loading } = useServerQuote(
    "B2B Delivery & Logistics",
    form
  );

  const detailsValid =
    form.pickupPostcode && form.deliveryPostcode && form.email;

  // Step 8 (complexity) only surfaces for complex jobs.
  const showComplexity =
    form.deliveryType === "Multi-drop Logistics" ||
    form.deliveryType === "Medical Deliveries" ||
    form.vehicleSize === "7.5T Truck" ||
    form.goods.highValue ||
    form.goods.medical;

  const totalSteps = showComplexity ? 9 : 8;

  // Internal pricing tags — structured for a future engine:
  // Total = (Base + Labour + Distance + Surcharges) × Margin
  const buildPricingFlags = () => {
    const flags = [];
    if (form.siteType === "Residential" && form.stairs === "Yes")
      flags.push("stairs"); // labour increase
    if (form.vehicleDistance === "Long") flags.push("long_distance"); // mileage calc
    if (form.loadKind === "Palletised") flags.push("pallets"); // volume scaling
    if (form.goods.highValue) flags.push("high_value"); // insurance premium
    if (form.urgency !== "Scheduled") flags.push("urgency"); // rate multiplier
    if (form.deliveryType === "Multi-drop Logistics" || form.factors.multiStops)
      flags.push("multi_drop"); // routing complexity
    if (form.factors.congestion) flags.push("congestion_zone"); // surcharge
    goodsTypes.forEach((g) => g.tag && form.goods[g.key] && flags.push(g.tag));
    complexityFactors.forEach((f) => form.factors[f.key] && flags.push(f.tag));
    return [...new Set(flags)];
  };

  // Pricing is server-authoritative — computed in pricing.server.js via
  // /api/price (see useServerQuote above). No pricing constants on the client.

  const canContinue = step !== 1 || detailsValid;
  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Step indicator */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>B2B Delivery & Logistics</span>
          <span>
            Step {Math.min(step, totalSteps)} of {totalSteps}
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
          {/* STEP 1 — Contact & Routing */}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">
                Contact & routing
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Pickup Postcode" required>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. EC1A 1AB"
                    value={form.pickupPostcode}
                    onChange={(e) => set("pickupPostcode", e.target.value)}
                  />
                </Field>
                <Field label="Delivery Postcode" required>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. M1 1AB"
                    value={form.deliveryPostcode}
                    onChange={(e) => set("deliveryPostcode", e.target.value)}
                  />
                </Field>
              </div>
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
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 — Delivery type (IMAGE BUTTONS) */}
          {step === 2 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What type of delivery?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {deliveryTypes.map((opt) => {
                  const active = form.deliveryType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("deliveryType", opt.id)}
                      className={`overflow-hidden rounded-xl border-2 bg-white text-center transition ${
                        active
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {/* Image from the provided B2B icons path */}
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="h-28 w-full bg-gray-50 object-contain p-2"
                      />
                      {/* Label UNDER the image */}
                      <span className="block px-2 pb-1 text-sm font-semibold text-gray-800">
                        {opt.label}
                      </span>
                      {opt.hint && (
                        <span className="block px-2 pb-3 text-xs text-gray-500">
                          {opt.hint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — Site type & access (conditional) */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Site type & access
              </h2>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Site type</p>
                <Segmented
                  options={["Commercial", "Residential", "Construction Site"]}
                  value={form.siteType}
                  onChange={(v) => set("siteType", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Parking</p>
                <Segmented
                  options={["Free", "Paid", "Restricted"]}
                  value={form.parking}
                  onChange={(v) => set("parking", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Distance from vehicle to entry
                </p>
                <Segmented
                  options={["Short", "Medium", "Long"]}
                  value={form.vehicleDistance}
                  onChange={(v) => set("vehicleDistance", v)}
                />
              </div>

              {/* Conditional: Residential */}
              {form.siteType === "Residential" && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-gray-700">Stairs?</p>
                    <Segmented
                      options={["Yes", "No"]}
                      value={form.stairs}
                      onChange={(v) => set("stairs", v)}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-gray-700">Lift?</p>
                    <Segmented
                      options={["Yes", "No"]}
                      value={form.lift}
                      onChange={(v) => set("lift", v)}
                    />
                  </div>
                </div>
              )}

              {/* Conditional: Commercial */}
              {form.siteType === "Commercial" && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-gray-700">
                      Loading bay?
                    </p>
                    <Segmented
                      options={["Yes", "No"]}
                      value={form.loadingBay}
                      onChange={(v) => set("loadingBay", v)}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-gray-700">
                      Height limit?
                    </p>
                    <Segmented
                      options={["Yes", "No"]}
                      value={form.heightRestriction}
                      onChange={(v) => set("heightRestriction", v)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 — Load profile (vehicle + pallet/loose switch) */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Load profile
              </h2>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Vehicle size
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {vehicleSizes.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set("vehicleSize", v)}
                      className={`rounded-lg border p-3 text-sm font-medium transition ${
                        form.vehicleSize === v
                          ? "border-blue-600 bg-blue-50 text-blue-800"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Load type</p>
                <Segmented
                  options={["Palletised", "Loose"]}
                  value={form.loadKind}
                  onChange={(v) => set("loadKind", v)}
                />
              </div>

              {/* Conditional: pallet vs loose */}
              {form.loadKind === "Palletised" ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Field label="Number of pallets">
                      <input
                        type="number"
                        min="1"
                        className="w-full rounded-lg border border-gray-300 p-3"
                        value={form.pallets}
                        onChange={(e) => set("pallets", e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-gray-700">
                      Stackable?
                    </p>
                    <Segmented
                      options={["Yes", "No"]}
                      value={form.stackable}
                      onChange={(v) => set("stackable", v)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">
                    Loose load size
                  </p>
                  <Segmented
                    options={["Small", "Medium", "Large"]}
                    value={form.looseSize}
                    onChange={(v) => set("looseSize", v)}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Goods type */}
          {step === 5 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What are you sending?
              </h2>
              <CheckGrid
                options={goodsTypes}
                value={form.goods}
                onChange={(v) => set("goods", v)}
              />
            </div>
          )}

          {/* STEP 6 — Service level */}
          {step === 6 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Service level
              </h2>
              <div className="space-y-2">
                {serviceLevels.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set("serviceLevel", s.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                      form.serviceLevel === s.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <span className="font-medium text-gray-800">{s.id}</span>
                    <span className="text-xs text-gray-500">{s.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7 — Time & urgency */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Time & urgency
              </h2>
              <Field label="Delivery date">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Time slot</p>
                <Segmented
                  options={["AM", "PM", "Flexible"]}
                  value={form.timeSlot}
                  onChange={(v) => set("timeSlot", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Urgency</p>
                <Segmented
                  options={["Scheduled", "Same-day", "Dedicated express"]}
                  value={form.urgency}
                  onChange={(v) => set("urgency", v)}
                />
              </div>
            </div>
          )}

          {/* STEP 8 — Complexity factors (conditional) */}
          {step === 8 && showComplexity && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                A few logistics details
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                These help us route and price complex jobs accurately.
              </p>
              <CheckGrid
                options={complexityFactors}
                value={form.factors}
                onChange={(v) => set("factors", v)}
              />
            </div>
          )}

          {/* REVIEW & submit (always final step) */}
          {step === totalSteps && (
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
                Estimated range · confirmed once route &amp; load are reviewed
              </p>
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left text-xs text-gray-600">
                <p>
                  <span className="font-semibold">Route:</span>{" "}
                  {form.pickupPostcode || "—"} → {form.deliveryPostcode || "—"}
                </p>
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {form.deliveryType || "—"}
                </p>
                <p>
                  <span className="font-semibold">Vehicle / load:</span>{" "}
                  {form.vehicleSize} ·{" "}
                  {form.loadKind === "Palletised"
                    ? `${form.pallets} pallet(s)`
                    : `${form.looseSize} loose`}
                </p>
                <p>
                  <span className="font-semibold">Service / urgency:</span>{" "}
                  {form.serviceLevel} · {form.urgency}
                </p>
              </div>
              <p className="mb-5 text-xs italic text-gray-500">
                We deliver structured, reliable logistics solutions tailored to
                your business needs.
              </p>
              <SubmitQuoteButton
                service="B2B Delivery & Logistics"
                form={form}
                estimate={estimate}
                distanceMiles={distanceMiles}
                travelComponent={travelComponent}
                label="Get My Quote"
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
      {step < totalSteps && (
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

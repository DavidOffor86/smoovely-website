"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountEligibility from "./DiscountEligibility";
import SubmitQuoteButton from "./SubmitQuoteButton";
import { formatRange } from "../lib/pricing";

/* ---------------------------------------------------------------------------
 * Enhanced Home Removals flow for the QuickMove Quote configurator.
 * Self-contained: keeps the rest of MultiServicePlatform untouched.
 * ------------------------------------------------------------------------- */

const propertyOptions = [
  {
    id: "1 Bedroom Flat",
    label: "1 Bedroom Flat",
    image: "/images/House Icons Configurator/1 Bed Flat.jpg",
  },
  {
    id: "2 Bedroom Property",
    label: "2 Bedroom Property",
    image: "/images/House Icons Configurator/2 Bedroom House.jpg",
  },
  {
    id: "3 Bedroom Property",
    label: "3 Bedroom Property",
    image: "/images/House Icons Configurator/3 Bedroom House.jpg",
  },
  {
    id: "4+ Bedroom Property",
    label: "4+ Bedroom Property",
    image: "/images/House Icons Configurator/4 Bedroom House.jpg",
  },
];

const loadOptions = [
  { id: "Small Load", sub: "¼ Van", value: 0 },
  { id: "Medium Load", sub: "½ Van", value: 70 },
  { id: "Large Load", sub: "¾ Van", value: 140 },
  { id: "Full Load", sub: "1 Luton Van", value: 230 },
];

const itemList = [
  { key: "sofa", label: "Sofa(s)" },
  { key: "fridge", label: "Fridge" },
  { key: "freezer", label: "Freezer" },
  { key: "washing", label: "Washing Machine" },
  { key: "beds", label: "Beds / Mattresses" },
  { key: "wardrobes", label: "Wardrobes" },
  { key: "dining", label: "Dining Table" },
];

const extras = [
  { key: "packing", label: "Packing service required", price: 150 },
  { key: "dismantling", label: "Dismantling / reassembly", price: 90 },
  { key: "extraCare", label: "Extra care handling", price: 60 },
];

const TOTAL_STEPS = 8;

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: "easeOut" },
};

/* ---- small reusable UI helpers ---- */

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
    <div className="flex gap-2">
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

function AccessGroup({ title, value, onChange }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <h3 className="mb-3 text-sm font-bold text-gray-800">{title}</h3>
      <div className="space-y-3">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Parking
          </p>
          <Segmented
            options={["Free", "Paid", "No Parking"]}
            value={value.parking}
            onChange={(v) => onChange({ ...value, parking: v })}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Stairs
            </p>
            <Segmented
              options={["Yes", "No"]}
              value={value.stairs}
              onChange={(v) => onChange({ ...value, stairs: v })}
            />
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Lift
            </p>
            <Segmented
              options={["Yes", "No"]}
              value={value.lift}
              onChange={(v) => onChange({ ...value, lift: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeRemovalsFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    pickupPostcode: "",
    destPostcode: "",
    name: "",
    phone: "",
    email: "",
    property: "",
    load: "",
    items: {},
    boxes: 0,
    fragile: "No",
    fragileDetails: "",
    pickup: { parking: "", stairs: "", lift: "" },
    dropoff: { parking: "", stairs: "", lift: "" },
    packing: false,
    dismantling: false,
    extraCare: false,
    date: "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const detailsValid =
    form.pickupPostcode &&
    form.destPostcode &&
    form.name &&
    form.phone &&
    form.email;

  // Pricing structure: Labour (base + property + load + items) + Access
  // (parking / stairs / lift) + Services (packing / dismantling / care).
  // London-aligned: ~2 movers + Luton from £180; stairs without a lift is a
  // major labour add, so lift availability now changes the price.
  const calculatePrice = () => {
    let price = 180; // Home Removals base — 2 movers + Luton, half-day floor
    const propertyAdd = { "1 Bedroom Flat": 0, "2 Bedroom Property": 120, "3 Bedroom Property": 240, "4+ Bedroom Property": 400 };
    price += propertyAdd[form.property] || 0;
    price += loadOptions.find((l) => l.id === form.load)?.value || 0;
    price += Object.values(form.items).filter(Boolean).length * 18;
    price += Number(form.boxes || 0) * 3;
    if (form.fragile === "Yes") price += 40;
    [form.pickup, form.dropoff].forEach((a) => {
      if (a.parking === "Paid") price += 20;
      if (a.parking === "No Parking") price += 45;
      // Stairs with no lift = significant extra carrying labour.
      if (a.stairs === "Yes") price += a.lift === "Yes" ? 20 : 90;
    });
    extras.forEach((e) => form[e.key] && (price += e.price));
    return price;
  };

  const canContinue = step !== 1 || detailsValid;

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Home Removals</span>
          <span>
            Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} {...stepMotion}>
          {/* STEP 1 — Customer & address details */}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">
                Your move details
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Pickup Postcode" required>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. SE10 9AB"
                    value={form.pickupPostcode}
                    onChange={(e) => set("pickupPostcode", e.target.value)}
                  />
                </Field>
                <Field label="Destination Postcode" required>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. DA1 1AB"
                    value={form.destPostcode}
                    onChange={(e) => set("destPostcode", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Full Name" required>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Phone Number" required>
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
              {!detailsValid && (
                <p className="text-xs text-gray-400">
                  All fields are required to continue.
                </p>
              )}
            </div>
          )}

          {/* STEP 2 — Property size (visual) */}
          {step === 2 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What size is your property?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {propertyOptions.map((opt) => {
                  const active = form.property === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("property", opt.id)}
                      className={`overflow-hidden rounded-xl border-2 bg-white text-center transition ${
                        active
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="h-28 w-full object-cover"
                      />
                      <span className="block p-2 text-sm font-semibold text-gray-700">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — Load size estimation */}
          {step === 3 && (
            <div>
              <h2 className="mb-2 text-center font-semibold text-gray-800">
                Estimate your load size
              </h2>
              <div className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
                <p className="font-semibold">Quick guide:</p>
                <ul className="mt-1 list-disc pl-4">
                  <li>1 bed → Small / Medium</li>
                  <li>2 bed → Medium / Full</li>
                  <li>3 bed → Full Luton</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {loadOptions.map((opt) => {
                  const active = form.load === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("load", opt.id)}
                      className={`rounded-xl border-2 p-4 text-center transition ${
                        active
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      <span className="block font-semibold text-gray-800">
                        {opt.id}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {opt.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 — Item checklist */}
          {step === 4 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What are you moving?
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {itemList.map((item) => {
                  const active = !!form.items[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        set("items", { ...form.items, [item.key]: !active })
                      }
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition ${
                        active
                          ? "border-blue-600 bg-blue-50 font-medium text-blue-800"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {active && "✓"}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <Field label="Number of boxes">
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    value={form.boxes}
                    onChange={(e) => set("boxes", e.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Any fragile or high-value items?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.fragile}
                  onChange={(v) => set("fragile", v)}
                />
                {form.fragile === "Yes" && (
                  <textarea
                    className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-sm"
                    rows={2}
                    placeholder="Tell us about them (e.g. piano, artwork, antiques)"
                    value={form.fragileDetails}
                    onChange={(e) => set("fragileDetails", e.target.value)}
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 5 — Access & logistics */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Access at each address
              </h2>
              <AccessGroup
                title="Pickup address"
                value={form.pickup}
                onChange={(v) => set("pickup", v)}
              />
              <AccessGroup
                title="Drop-off address"
                value={form.dropoff}
                onChange={(v) => set("dropoff", v)}
              />
            </div>
          )}

          {/* STEP 6 — Additional services */}
          {step === 6 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Add extra services
              </h2>
              <div className="space-y-3">
                {extras.map((e) => {
                  const active = form[e.key];
                  return (
                    <button
                      key={e.key}
                      type="button"
                      onClick={() => set(e.key, !active)}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {e.label}
                      </span>
                      <span
                        className={`relative h-6 w-11 rounded-full transition ${
                          active ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                            active ? "left-[22px]" : "left-0.5"
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7 — Date */}
          {step === 7 && (
            <div className="text-center">
              <h2 className="mb-4 font-semibold text-gray-800">
                Preferred moving date
              </h2>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 p-3"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
          )}

          {/* STEP 8 — Quote */}
          {step === 8 && (
            <div className="text-center">
              <h2 className="mb-1 text-sm font-medium text-gray-500">
                Your estimated quote
              </h2>
              <p className="mb-1 text-4xl font-bold text-gray-900">
                {formatRange(calculatePrice())}
              </p>
              <p className="mb-4 text-xs text-gray-500">
                Estimated range · final price confirmed on survey
              </p>
              <div className="mb-5 rounded-lg bg-gray-50 p-4 text-left text-xs text-gray-600">
                <p>
                  <span className="font-semibold">Route:</span>{" "}
                  {form.pickupPostcode || "—"} → {form.destPostcode || "—"}
                </p>
                <p>
                  <span className="font-semibold">Property:</span>{" "}
                  {form.property || "—"}
                </p>
                <p>
                  <span className="font-semibold">Load:</span> {form.load || "—"}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {form.date || "Flexible"}
                </p>
              </div>
              <SubmitQuoteButton
                service="Home Removals"
                form={form}
                estimate={calculatePrice()}
                label="Pay Deposit"
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
      {step < TOTAL_STEPS && (
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountEligibility from "./DiscountEligibility";
import SubmitQuoteButton from "./SubmitQuoteButton";
import { formatRange } from "../lib/pricing";

/* ---------------------------------------------------------------------------
 * Storage Services flow for the QuickMove Quote configurator.
 * Self-contained — the four completed flows are untouched.
 * Ordered active-steps array lets the conditional steps (Access, Complexity)
 * slot in/out without leaving numbering gaps.
 * ------------------------------------------------------------------------- */

/* Storage-size buttons — images from the EXACT provided path:
 * public/images/Storage Services Configurator
 * Filenames referenced verbatim (they contain en-dashes / double spaces).
 */
const ICONS = "/images/Storage Services Configurator";
const storageSizes = [
  {
    id: "Small Storage",
    hint: "Boxes / small furniture",
    image: `${ICONS}/Small Storage - Small boxes and furniture (2).png`,
  },
  {
    id: "Medium Storage",
    hint: "1 bed contents",
    image: `${ICONS}/Medium Storage  (1 bed contents) –.png`,
  },
  {
    id: "Large Storage",
    hint: "2–3 bed contents",
    image: `${ICONS}/Large Storage (2–3 bed contents) –.png`,
  },
  {
    id: "XL Storage",
    hint: "Full house / office",
    image: `${ICONS}/XL Storage (5+bedrooms).png`,
  },
];

const vanLoads = ["¼ Van", "½ Van", "1 Luton Van", "2+ Loads"];

const serviceTypes = [
  { id: "Storage Only", hint: "You deliver to us" },
  { id: "Collection + Storage", hint: "We collect & store" },
  { id: "Storage as part of Move", hint: "Move-linked" },
  { id: "Storage as part of Clearance", hint: "Clearance-linked" },
];

const inventoryItems = [
  { key: "boxes", label: "Boxes" },
  { key: "sofas", label: "Sofas" },
  { key: "beds", label: "Beds / mattresses" },
  { key: "wardrobes", label: "Wardrobes" },
  { key: "tables", label: "Tables" },
  { key: "appliances", label: "Appliances" },
  { key: "office", label: "Office equipment" },
];

const specialHandling = [
  { key: "fragile", label: "Fragile items?", tag: "fragile_items" },
  { key: "highValue", label: "High-value items?", tag: "high_value" },
  { key: "antiques", label: "Antiques / artwork?", tag: "antiques" },
  { key: "electronics", label: "Electronics / IT?", tag: "electronics" },
];

const packingOptions = [
  { key: "packing", label: "Packing required?", tag: "packing_required" },
  { key: "wrapping", label: "Professional wrapping?", tag: "packing_required" },
  { key: "fragilePacking", label: "Fragile packing?", tag: "packing_required" },
  { key: "materials", label: "Boxes / materials?", tag: "packing_required" },
];

const durations = ["< 1 month", "1–3 months", "3–6 months", "6+ months"];
const itemConditions = ["Clean / organised", "Light clutter", "Heavy clutter", "Mixed unsorted"];

const complexityFactors = [
  { key: "multiLocation", label: "Multi-location collection?", tag: "multi_location" },
  { key: "businessContract", label: "Business contract?", tag: "business_contract" },
  { key: "projectManaged", label: "Project-managed move?", tag: "project_managed" },
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

export default function StorageFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    postcode: "",
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    size: "",
    vanLoad: "",
    inventory: {},
    boxesQty: 0,
    otherItems: "",
    special: {},
    specialDetail: "",
    packing: {},
    packingDetail: "",
    dismantling: "No",
    reassembly: "No",
    parking: "Free",
    distance: "Short",
    floor: "Ground",
    lift: "No",
    stairs: "No",
    storagePlace: "Indoor",
    climate: "No",
    pallet: "No",
    duration: "",
    flexible: "Yes",
    accessNeeded: "No",
    accessFreq: "Occasional",
    returnDelivery: "No",
    returnPostcode: "",
    condition: "",
    complexity: {},
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Conditional triggers
  const showAccess = [
    "Collection + Storage",
    "Storage as part of Move",
    "Storage as part of Clearance",
  ].includes(form.serviceType);
  const showComplexity =
    form.size === "XL Storage" || form.vanLoad === "2+ Loads";

  // Ordered list of ACTIVE steps.
  const steps = [
    "contact",
    "service",
    "size",
    "inventory",
    "special",
    "packing",
    "dismantling",
    showAccess && "access",
    "storageType",
    "duration",
    "accessDuring",
    "returnDelivery",
    "condition",
    showComplexity && "complexity",
    "review",
  ].filter(Boolean);

  const totalSteps = steps.length;
  const current = steps[step - 1];
  const isLast = step === totalSteps;

  const detailsValid = !!form.email;
  const canContinue = current !== "contact" || detailsValid;
  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  // Internal pricing flags — Total = Storage + Labour + Transport + Services + Complexity
  const buildPricingFlags = () => {
    const flags = [];
    if (form.size || form.vanLoad) flags.push("volume_size");
    if (form.duration) flags.push("duration_band");
    if (Object.values(form.packing).some(Boolean)) flags.push("packing_required");
    specialHandling.forEach((s) => form.special[s.key] && flags.push(s.tag));
    if (form.dismantling === "Yes") flags.push("dismantling_required");
    if (
      form.distance === "Long" ||
      form.stairs === "Yes" ||
      (form.lift === "No" && form.floor !== "Ground")
    )
      flags.push("access_difficulty");
    if (showAccess) flags.push("collection_required");
    if (form.returnDelivery === "Yes") flags.push("return_delivery");
    if (form.accessNeeded === "Yes") flags.push("repeat_access");
    complexityFactors.forEach((c) => form.complexity[c.key] && flags.push(c.tag));
    return [...new Set(flags)];
  };

  // Pricing structure: Storage (size/volume + duration band) + Services
  // (packing / dismantling / climate) + Transport (collection + access) +
  // Complexity. Access factors only apply when a collection is involved, so
  // they are gated under showAccess (no phantom charges for storage-only).
  const calculatePrice = () => {
    let price = 70; // storage base — admin + first handling
    price += (storageSizes.findIndex((s) => s.id === form.size) + 1) * 45;
    price += (vanLoads.indexOf(form.vanLoad) + 1) * 25;
    price += { "< 1 month": 0, "1–3 months": 70, "3–6 months": 150, "6+ months": 260 }[form.duration] || 0;
    if (Object.values(form.packing).some(Boolean)) price += 80;
    price += Object.values(form.special).filter(Boolean).length * 30;
    if (form.dismantling === "Yes") price += 60;
    if (form.reassembly === "Yes") price += 60;
    // Collection / linked labour + the access factors collected on that step.
    if (showAccess) {
      price += 90;
      if (form.parking === "Paid") price += 15;
      if (form.parking === "No Parking") price += 35;
      if (form.distance === "Medium") price += 20;
      if (form.distance === "Long") price += 45;
      if (form.stairs === "Yes") price += 25;
      // Upper floor with no lift = extra carrying labour.
      if (form.lift === "No" && form.floor && !/ground/i.test(form.floor))
        price += 40;
    }
    if (form.climate === "Yes") price += 50;
    if (form.storagePlace === "Container") price += 30;
    if (form.pallet === "Yes") price += 45; // business pallet storage
    if (form.accessNeeded === "Yes")
      price += { Rare: 15, Occasional: 30, Frequent: 60 }[form.accessFreq] || 20;
    if (form.returnDelivery === "Yes") price += 90;
    price += Object.values(form.complexity).filter(Boolean).length * 50;
    return price;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Step indicator */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Storage Services</span>
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
              <Field label="Collection Postcode (if applicable)">
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

          {/* STEP — Service type (logic control) */}
          {current === "service" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                How would you like to store?
              </h2>
              <div className="space-y-2">
                {serviceTypes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set("serviceType", s.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                      form.serviceType === s.id
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

          {/* STEP — Storage size (IMAGE SELECTOR) */}
          {current === "size" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                How much storage do you need?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {storageSizes.map((opt) => {
                  const active = form.size === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("size", opt.id)}
                      className={`overflow-hidden rounded-xl border-2 bg-white text-center transition ${
                        active
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {/* Image from the provided Storage Services path */}
                      <img
                        src={opt.image}
                        alt={opt.id}
                        className="h-24 w-full bg-gray-50 object-contain p-2"
                      />
                      {/* Label UNDER the image */}
                      <span className="block px-2 pt-1 text-sm font-semibold text-gray-800">
                        {opt.id}
                      </span>
                      <span className="block px-2 pb-3 text-xs text-gray-500">
                        {opt.hint}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Optional alternative selector */}
              <p className="mb-2 mt-5 text-sm font-medium text-gray-700">
                Or estimate by load (optional)
              </p>
              <Segmented
                options={vanLoads}
                value={form.vanLoad}
                onChange={(v) => set("vanLoad", v)}
              />
            </div>
          )}

          {/* STEP — Inventory */}
          {current === "inventory" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What are you storing?
              </h2>
              <CheckGrid
                options={inventoryItems}
                value={form.inventory}
                onChange={(v) => set("inventory", v)}
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Field label="Approx. boxes">
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    value={form.boxesQty}
                    onChange={(e) => set("boxesQty", e.target.value)}
                  />
                </Field>
                <Field label="Other items">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder="Optional"
                    value={form.otherItems}
                    onChange={(e) => set("otherItems", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP — Special handling */}
          {current === "special" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Special handling
              </h2>
              <CheckGrid
                options={specialHandling}
                value={form.special}
                onChange={(v) => set("special", v)}
              />
              {Object.values(form.special).some(Boolean) && (
                <div className="mt-3">
                  <Field label="Add details (optional)">
                    <textarea
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                      placeholder="e.g. framed artwork, antique dresser, gaming PC"
                      value={form.specialDetail}
                      onChange={(e) => set("specialDetail", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* STEP — Packing & preparation */}
          {current === "packing" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Packing & preparation
              </h2>
              <CheckGrid
                options={packingOptions}
                value={form.packing}
                onChange={(v) => set("packing", v)}
              />
              {Object.values(form.packing).some(Boolean) && (
                <div className="mt-3">
                  <Field label="Packing notes (optional)">
                    <input
                      className="w-full rounded-lg border border-gray-300 p-3"
                      placeholder="Anything we should know?"
                      value={form.packingDetail}
                      onChange={(e) => set("packingDetail", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* STEP — Dismantling / reassembly */}
          {current === "dismantling" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Dismantling & reassembly
              </h2>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Dismantling required?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.dismantling}
                  onChange={(v) => set("dismantling", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Reassembly required later?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.reassembly}
                  onChange={(v) => set("reassembly", v)}
                />
              </div>
            </div>
          )}

          {/* STEP — Access conditions (conditional) */}
          {current === "access" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Collection access
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
                <p className="mb-1 text-sm font-medium text-gray-700">Distance</p>
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
            </div>
          )}

          {/* STEP — Storage type */}
          {current === "storageType" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Storage type
              </h2>
              <PillGroup
                options={["Indoor", "Container"]}
                value={form.storagePlace}
                onChange={(v) => set("storagePlace", v)}
              />
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Climate-controlled?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.climate}
                  onChange={(v) => set("climate", v)}
                />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Pallet storage? (business)
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.pallet}
                  onChange={(v) => set("pallet", v)}
                />
              </div>
            </div>
          )}

          {/* STEP — Duration */}
          {current === "duration" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                How long do you need storage?
              </h2>
              <PillGroup
                options={durations}
                value={form.duration}
                onChange={(v) => set("duration", v)}
              />
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Flexible on duration?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.flexible}
                  onChange={(v) => set("flexible", v)}
                />
              </div>
            </div>
          )}

          {/* STEP — Access during storage */}
          {current === "accessDuring" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Access during storage
              </h2>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Will you need access?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.accessNeeded}
                  onChange={(v) => set("accessNeeded", v)}
                />
              </div>
              {form.accessNeeded === "Yes" && (
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">
                    How often?
                  </p>
                  <Segmented
                    options={["Rare", "Occasional", "Frequent"]}
                    value={form.accessFreq}
                    onChange={(v) => set("accessFreq", v)}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP — Return delivery */}
          {current === "returnDelivery" && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Return delivery
              </h2>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Delivery required later?
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={form.returnDelivery}
                  onChange={(v) => set("returnDelivery", v)}
                />
              </div>
              {form.returnDelivery === "Yes" && (
                <Field label="Delivery postcode (optional)">
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. N1 1AB"
                    value={form.returnPostcode}
                    onChange={(e) => set("returnPostcode", e.target.value)}
                  />
                </Field>
              )}
            </div>
          )}

          {/* STEP — Item condition */}
          {current === "condition" && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Item condition
              </h2>
              <PillGroup
                options={itemConditions}
                value={form.condition}
                onChange={(v) => set("condition", v)}
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
                For larger or business jobs, these help us quote accurately.
              </p>
              <CheckGrid
                options={complexityFactors}
                value={form.complexity}
                onChange={(v) => set("complexity", v)}
              />
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
                {formatRange(calculatePrice())}
              </p>
              <p className="mb-4 text-xs text-gray-500">
                Estimated range · storage billed per month, confirmed on enquiry
              </p>
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left text-xs text-gray-600">
                <p>
                  <span className="font-semibold">Size:</span>{" "}
                  {form.size || form.vanLoad || "—"}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {form.duration || "—"}
                </p>
                <p>
                  <span className="font-semibold">Service:</span>{" "}
                  {form.serviceType || "—"}
                </p>
              </div>
              <p className="mb-5 text-xs italic text-gray-500">
                We provide secure, flexible storage solutions tailored to your
                needs.
              </p>
              <SubmitQuoteButton
                service="Storage Solutions"
                form={form}
                estimate={calculatePrice()}
                label="Get My Storage Quote"
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

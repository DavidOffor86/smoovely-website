"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountEligibility from "./DiscountEligibility";
import SubmitQuoteButton from "./SubmitQuoteButton";
import { formatRange } from "../lib/pricing";
import { useServerQuote } from "../lib/useServerQuote";
import { ROOMS, ROOM_ORDER } from "../lib/homeInventory";

/* ---------------------------------------------------------------------------
 * Home Removals flow (room-based inventory model).
 * Pricing is server-authoritative (pricing.server.js via /api/price). This
 * component only captures inputs and renders the returned breakdown — no
 * pricing constants live here. Room/item labels come from the shared
 * homeInventory catalog (same source the server uses for summaries).
 * Mobile-first; same card/segmented UI language.
 * ------------------------------------------------------------------------- */

const roomsCatalog = ROOMS;
const ROOM_KEYS = ROOM_ORDER;
const HIGH_VALUE = ["None", "Low", "Medium", "High", "Very High"];
const FRAGILE = ["Standard", "Some Fragile", "Delicate", "Very Delicate", "Specialist Handling"];
const PACKING = ["Boxes", "Bubble Wrap", "Shrink Wrap", "Mattress Covers", "Wardrobe Boxes", "Full Packing Service"];
const SPECIAL_HANDLING = ["Piano", "Safe", "Large Artwork", "Antique Furniture", "Gym Equipment", "American Fridge Freezer", "Other"];
const FLOORS = ["Ground", "1st", "2nd", "3rd+", "Lift Available"];
const PARKING = ["Free", "Paid", "No Parking"];
const FLEXIBILITY = ["Exact Date", "+/- 3 Days", "Flexible"];
const BUDGETS = ["Under £500", "£500-£1000", "£1000-£2000", "£2000+"];

// Property type — contextual (does not affect price; rooms drive the quote).
// Uses the original property images from /public/images/House Icons Configurator.
const PROPERTY_TYPES = [
  { id: "1 Bedroom Flat", label: "1 Bedroom Flat", image: "/images/House Icons Configurator/1 Bed Flat.jpg" },
  { id: "2 Bedroom Property", label: "2 Bedroom Property", image: "/images/House Icons Configurator/2 Bedroom House.jpg" },
  { id: "3 Bedroom Property", label: "3 Bedroom Property", image: "/images/House Icons Configurator/3 Bedroom House.jpg" },
  { id: "4+ Bedroom Property", label: "4+ Bedroom Property", image: "/images/House Icons Configurator/4 Bedroom House.jpg" },
];

const TOTAL_STEPS = 12;

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

// Quantity stepper — large tap targets for mobile.
function Stepper({ value, onChange, min = 0 }) {
  const v = Number(value || 0);
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, v - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-700 transition hover:border-blue-400 disabled:opacity-40"
        disabled={v <= min}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold text-gray-800">{v}</span>
      <button
        type="button"
        onClick={() => onChange(v + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-700 transition hover:border-blue-400"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

function BreakdownRow({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={muted ? "text-gray-500" : "font-medium text-gray-700"}>{label}</span>
      <span className={muted ? "text-gray-500" : "font-semibold text-gray-900"}>{value}</span>
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
    propertyType: "",
    selectedRooms: {},
    rooms: {},
    boxes: 0,
    bags: 0,
    suitcases: 0,
    highValue: "None",
    fragileLevel: "Standard",
    packing: {},
    specialHandling: {},
    specialHandlingOther: "",
    pickup: { parking: "Free", floor: "Ground" },
    dropoff: { parking: "Free", floor: "Ground" },
    moveDate: "",
    moveFlexibility: "Flexible",
    customerBudget: "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Server-authoritative quote (service + travel + packing + complexity).
  const quote = useServerQuote("Home Removals", form);
  const {
    estimate,
    distanceMiles,
    serviceComponent,
    travelComponent,
    packingComponent,
    complexityComponent,
    vehicleRecommendation,
    crewRecommendation,
    customQuoteRequired,
    loading,
  } = quote;

  const detailsValid =
    form.pickupPostcode && form.destPostcode && form.name && form.phone && form.email;

  const toggleRoom = (roomKey) =>
    setForm((f) => {
      const on = !f.selectedRooms[roomKey];
      const rooms = { ...f.rooms };
      if (!on) delete rooms[roomKey]; // clear items when a room is removed
      return { ...f, selectedRooms: { ...f.selectedRooms, [roomKey]: on }, rooms };
    });

  const setItemQty = (roomKey, itemKey, qty) =>
    setForm((f) => ({
      ...f,
      rooms: { ...f.rooms, [roomKey]: { ...(f.rooms[roomKey] || {}), [itemKey]: qty } },
    }));

  const togglePacking = (key) =>
    setForm((f) => ({ ...f, packing: { ...f.packing, [key]: !f.packing[key] } }));

  const toggleSpecial = (key) =>
    setForm((f) => ({ ...f, specialHandling: { ...f.specialHandling, [key]: !f.specialHandling[key] } }));

  const activeRooms = ROOM_KEYS.filter((k) => form.selectedRooms[k]);
  const canContinue = step !== 1 || detailsValid;

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  const gbp = (n) => `£${Number(n || 0).toLocaleString()}`;

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
          {/* STEP 1 — Contact & addresses */}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">Your move details</h2>
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
                    placeholder="e.g. M2 5BQ"
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
                <p className="text-xs text-gray-400">All fields are required to continue.</p>
              )}
            </div>
          )}

          {/* STEP 2 — Property type (contextual) */}
          {step === 2 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                What type of property?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {PROPERTY_TYPES.map((opt) => {
                  const active = form.propertyType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("propertyType", opt.id)}
                      className={`overflow-hidden rounded-xl border-2 bg-white text-center transition ${
                        active
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      <img src={opt.image} alt={opt.label} className="h-28 w-full object-cover" />
                      <span className="block p-2 text-sm font-semibold text-gray-700">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-xs text-gray-400">
                Helps our team picture your move — you&apos;ll add exact items next.
              </p>
            </div>
          )}

          {/* STEP 3 — Rooms */}
          {step === 3 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Which rooms are you moving?
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ROOM_KEYS.map((key) => {
                  const active = !!form.selectedRooms[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleRoom(key)}
                      className={`rounded-xl border-2 p-4 text-sm font-semibold transition ${
                        active
                          ? "border-blue-600 bg-blue-50 text-blue-800"
                          : "border-gray-200 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {roomsCatalog[key].label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-xs text-gray-400">
                Select all that apply — you&apos;ll add items next.
              </p>
            </div>
          )}

          {/* STEP 4 — Items & quantities */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">What are you moving?</h2>
              {activeRooms.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  No rooms selected — go back and choose your rooms.
                </p>
              )}
              {activeRooms.map((roomKey) => (
                <div key={roomKey} className="rounded-xl border border-gray-200 p-4">
                  <h3 className="mb-3 text-sm font-bold text-gray-800">
                    {roomsCatalog[roomKey].label}
                  </h3>
                  <div className="space-y-2">
                    {roomsCatalog[roomKey].items.map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <Stepper
                          value={form.rooms[roomKey]?.[item.key] || 0}
                          onChange={(q) => setItemQty(roomKey, item.key, q)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5 — Boxes / bags / suitcases */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">Boxes & bags</h2>
              {[
                ["boxes", "Boxes"],
                ["bags", "Bags"],
                ["suitcases", "Suitcases"],
              ].map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                >
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                  <Stepper value={form[key]} onChange={(q) => set(key, q)} />
                </div>
              ))}
            </div>
          )}

          {/* STEP 6 — Value & fragility */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-3 text-center font-semibold text-gray-800">
                  High-value items?
                </h2>
                <PillGroup
                  options={HIGH_VALUE}
                  value={form.highValue}
                  onChange={(v) => set("highValue", v)}
                />
              </div>
              <div>
                <h2 className="mb-3 text-center font-semibold text-gray-800">Fragile level</h2>
                <PillGroup
                  options={FRAGILE}
                  value={form.fragileLevel}
                  onChange={(v) => set("fragileLevel", v)}
                />
              </div>
            </div>
          )}

          {/* STEP 7 — Special handling */}
          {step === 7 && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                Special handling requirements
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                Items needing specialist care, equipment, or extra crew.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SPECIAL_HANDLING.map((key) => {
                  const active = !!form.specialHandling[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleSpecial(key)}
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
                      {key}
                    </button>
                  );
                })}
              </div>
              {form.specialHandling.Other && (
                <div className="mt-3">
                  <Field label="Tell us more (optional)">
                    <input
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                      placeholder="e.g. pool table, motorbike, chandelier"
                      value={form.specialHandlingOther}
                      onChange={(e) => set("specialHandlingOther", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* STEP 8 — Packing requirements */}
          {step === 8 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Packing requirements
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PACKING.map((key) => {
                  const active = !!form.packing[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePacking(key)}
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
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9 — Access & floors */}
          {step === 9 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">Access at each address</h2>
              {[
                ["pickup", "Pickup address"],
                ["dropoff", "Drop-off address"],
              ].map(([addrKey, title]) => (
                <div key={addrKey} className="rounded-xl border border-gray-200 p-4">
                  <h3 className="mb-3 text-sm font-bold text-gray-800">{title}</h3>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Parking
                  </p>
                  <Segmented
                    options={PARKING}
                    value={form[addrKey].parking}
                    onChange={(v) => set(addrKey, { ...form[addrKey], parking: v })}
                  />
                  <p className="mb-1 mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Floor
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {FLOORS.map((fl) => (
                      <button
                        key={fl}
                        type="button"
                        onClick={() => set(addrKey, { ...form[addrKey], floor: fl })}
                        className={`rounded-lg border p-2 text-xs font-medium transition ${
                          form[addrKey].floor === fl
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                        }`}
                      >
                        {fl}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 10 — Move date & flexibility */}
          {step === 10 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">Preferred move date</h2>
              <Field label="Date">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3"
                  value={form.moveDate}
                  onChange={(e) => set("moveDate", e.target.value)}
                />
              </Field>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">Flexibility</p>
                <Segmented
                  options={FLEXIBILITY}
                  value={form.moveFlexibility}
                  onChange={(v) => set("moveFlexibility", v)}
                />
              </div>
            </div>
          )}

          {/* STEP 11 — Budget */}
          {step === 11 && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                What&apos;s your budget?
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                Optional — helps us tailor the right service.
              </p>
              <PillGroup
                options={BUDGETS}
                value={form.customerBudget}
                onChange={(v) => set("customerBudget", v)}
              />
            </div>
          )}

          {/* STEP 12 — Review & breakdown */}
          {step === 12 && (
            <div className="text-center">
              <h2 className="mb-1 text-sm font-medium text-gray-500">Your estimated quote</h2>
              <p className="mb-1 text-4xl font-bold text-gray-900">
                {loading && !estimate ? "Calculating…" : formatRange(estimate)}
              </p>
              <p className="mb-4 text-xs text-gray-500">
                Estimated range · final price confirmed on survey
              </p>

              {/* Breakdown */}
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left text-xs text-gray-600">
                <BreakdownRow label="Service" value={gbp(serviceComponent)} />
                <BreakdownRow label="Travel" value={gbp(travelComponent)} />
                <BreakdownRow label="Packing" value={gbp(packingComponent)} />
                <BreakdownRow label="Complexity" value={gbp(complexityComponent)} />
                <div className="my-2 border-t border-gray-200" />
                <BreakdownRow
                  label="Distance"
                  value={distanceMiles != null ? `${distanceMiles} miles` : "Local / included"}
                  muted
                />
                <BreakdownRow label="Vehicle" value={vehicleRecommendation || "—"} muted />
                <BreakdownRow label="Crew" value={crewRecommendation || "—"} muted />
              </div>

              {customQuoteRequired && (
                <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
                  ⚠ Custom Quote Required — submit your details and our team will
                  confirm a tailored price.
                </div>
              )}

              <SubmitQuoteButton
                service="Home Removals"
                form={form}
                estimate={estimate}
                distanceMiles={distanceMiles}
                travelComponent={travelComponent}
                label="Pay Deposit"
              />
              <button
                type="button"
                onClick={goBack}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                ← Back &amp; Edit Quote
              </button>
              <DiscountEligibility name={form.name} email={form.email} phone={form.phone} />
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

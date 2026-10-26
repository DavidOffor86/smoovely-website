"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountEligibility from "./DiscountEligibility";
import { formatRange } from "../lib/pricing";
import { useServerQuote } from "../lib/useServerQuote";
import { ROOMS, ROOM_ORDER, summariseInventory } from "../lib/homeInventory";
import { ATTRIBUTION_DEFAULTS } from "../lib/leadAttribution";
import LeadAttributionStep, { useReferralParam } from "./quote/LeadAttributionStep";
import ReviewSummary from "./quote/ReviewSummary";
import SpecialItemsSection from "./SpecialItemsSection";
import PhotoUploadSection from "./PhotoUploadSection";

/* ---------------------------------------------------------------------------
 * Home Removals flow (room-based inventory model).
 * Pricing is server-authoritative (pricing.server.js via /api/price). This
 * component only captures inputs and renders the returned breakdown — no
 * pricing constants live here. Room/item labels come from the shared
 * homeInventory catalog (same source the server uses for summaries).
 * Mobile-first; same card/segmented UI language.
 *
 * Steps: 1-11 capture, 12 special items, 13 dismantling, 14 photos,
 * 15 proposal notes, 16 lead attribution, 17 review, 18 final.
 * ------------------------------------------------------------------------- */

const roomsCatalog = ROOMS;
const ROOM_KEYS = ROOM_ORDER;
const HIGH_VALUE = ["None", "Low", "Medium", "High", "Very High"];
const FRAGILE = ["Standard", "Some Fragile", "Delicate", "Very Delicate", "Specialist Handling"];
const PACKING = ["Boxes", "Bubble Wrap", "Shrink Wrap", "Mattress Covers", "Wardrobe Boxes", "Full Packing Service"];
const FLOORS = ["Ground", "1st", "2nd", "3rd+", "Lift Available"];
const PARKING = ["Free", "Paid", "No Parking"];
const FLEXIBILITY = ["Exact Date", "+/- 3 Days", "Flexible"];
const BUDGETS = ["Under £500", "£500-£1000", "£1000-£2000", "£2000+"];
const DISMANTLING_ITEMS = [
  { key: "beds", label: "Beds" },
  { key: "wardrobes", label: "Wardrobes" },
  { key: "desks", label: "Desks" },
  { key: "diningTables", label: "Dining Tables" },
  { key: "other", label: "Other" },
];

// Property type — contextual (does not affect price; rooms drive the quote).
// Uses the original property images from /public/images/House Icons Configurator.
const PROPERTY_TYPES = [
  { id: "1 Bedroom Flat", label: "1 Bedroom Flat", image: "/images/House Icons Configurator/1 Bed Flat.jpg" },
  { id: "2 Bedroom Property", label: "2 Bedroom Property", image: "/images/House Icons Configurator/2 Bedroom House.jpg" },
  { id: "3 Bedroom Property", label: "3 Bedroom Property", image: "/images/House Icons Configurator/3 Bedroom House.jpg" },
  { id: "4+ Bedroom Property", label: "4+ Bedroom Property", image: "/images/House Icons Configurator/4 Bedroom House.jpg" },
];

// Steps 1–11 capture location/rooms/items; 12 special items; 13 dismantling;
// 14 photos; 15 proposal notes; 16 lead attribution; 17 review; 18 final.
const TOTAL_STEPS = 18;
const REVIEW_STEP = 17;
const LEAD_STEP = 16;

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
  const [quoteRef, setQuoteRef] = useState(""); // Generated before photo upload
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
    specialItems: [],
    dismantling: {},
    propertyPhotos: [],
    proposalNotes: "",
    pickup: { parking: "Free", floor: "Ground" },
    dropoff: { parking: "Free", floor: "Ground" },
    moveDate: "",
    moveFlexibility: "Flexible",
    customerBudget: "",
    ...ATTRIBUTION_DEFAULTS,
  });

  // Generate quote reference on mount for use in photo uploads
  useEffect(() => {
    if (!quoteRef) {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
      const seq = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      setQuoteRef(`HR-${dateStr}-${seq}`);
    }
  }, [quoteRef]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Pre-fill lead attribution from a ?ref= referral URL (editable afterwards).
  useReferralParam(setForm);

  // Lead submission state. "Get My Quote" (Review Summary) fires the email,
  // lead capture, Power Automate submission and server-side quote generation.
  // quoteVersion increments on every submission so edits produce a new,
  // resent, re-forwarded quote version (never permanently locked).
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle|sending|done|error
  const [quoteVersion, setQuoteVersion] = useState(0);

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

  const activeRooms = ROOM_KEYS.filter((k) => form.selectedRooms[k]);
  const canContinue =
    (step !== 1 || detailsValid) && (step !== LEAD_STEP || !!form.leadSource);

  // Standardised Review Summary sections (empty rows are dropped downstream).
  const packingList = Object.keys(form.packing)
    .filter((k) => form.packing[k])
    .join(", ");
  const specialItemsList = form.specialItems
    .map((item) => {
      let desc = item.description || "Unknown";
      if (item.quantity && item.quantity > 1) desc += ` (qty ${item.quantity})`;
      const flags = [];
      if (item.isHeavy === "Yes") flags.push("heavy");
      if (item.requiresDismantling === "Yes") flags.push("dismantling");
      if (item.requiresReassembly === "Yes") flags.push("reassembly");
      if (flags.length) desc += ` [${flags.join(", ")}]`;
      return desc;
    })
    .join(" · ");
  const dismantlingList = Object.entries(form.dismantling)
    .filter(([_, v]) => v && v.qty > 0)
    .map(([key, v]) => {
      const label = DISMANTLING_ITEMS.find((i) => i.key === key)?.label || key;
      return `${label} (qty ${v.qty}${
        v.reassemblyRequired === "Yes" ? ", reassembly required" : ""
      })`;
    })
    .join(" · ");
  const accessStr = (a) => `${a.floor} · Parking: ${a.parking}`;
  const reviewSections = [
    {
      title: "Service Details",
      rows: [
        { label: "Service", value: "Home Removals" },
        { label: "Property Type", value: form.propertyType },
        {
          label: "Rooms",
          value: activeRooms.map((k) => roomsCatalog[k].label).join(", "),
        },
        { label: "Inventory", value: summariseInventory(form) },
        { label: "Boxes", value: form.boxes ? String(form.boxes) : "" },
        { label: "Bags", value: form.bags ? String(form.bags) : "" },
        { label: "Suitcases", value: form.suitcases ? String(form.suitcases) : "" },
        { label: "High Value Level", value: form.highValue },
        { label: "Fragile Level", value: form.fragileLevel },
        { label: "Packing Requirements", value: packingList },
        { label: "Special/Oversized Items", value: specialItemsList },
        { label: "Dismantling & Reassembly", value: dismantlingList },
      ],
    },
    {
      title: "Location Details",
      rows: [
        { label: "Pickup Postcode", value: form.pickupPostcode },
        { label: "Destination Postcode", value: form.destPostcode },
        { label: "Pickup Access", value: accessStr(form.pickup) },
        { label: "Drop-off Access", value: accessStr(form.dropoff) },
        {
          label: "Distance",
          value: distanceMiles != null ? `${distanceMiles} miles` : "",
        },
      ],
    },
    {
      title: "Contact Details",
      rows: [
        { label: "Name", value: form.name },
        { label: "Phone", value: form.phone },
        { label: "Email", value: form.email },
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
      rows: [
        {
          label: "Move Date",
          value: form.moveDate
            ? `${form.moveDate} (${form.moveFlexibility})`
            : `Flexible (${form.moveFlexibility})`,
        },
        { label: "Budget", value: form.customerBudget },
        {
          label: "Property Photos",
          value: form.propertyPhotos.length ? `${form.propertyPhotos.length}/10 uploaded` : "",
        },
        { label: "Proposal Notes", value: form.proposalNotes },
      ],
    },
  ];

  // Quote Overview for Review Summary — printable executive summary
  const quoteOverview = [
    { label: "Quote Ref", value: quoteRef },
    { label: "Customer", value: form.name },
    { label: "Move Date", value: form.moveDate || "Flexible" },
    { label: "Service", value: "Home Removals" },
    {
      label: "Special Items",
      value: form.specialItems.length ? String(form.specialItems.length) : "",
    },
    {
      label: "Dismantling",
      value: Object.values(form.dismantling).filter((v) => v?.qty > 0).length
        ? String(
            Object.values(form.dismantling).reduce(
              (sum, v) => sum + (v?.qty || 0),
              0
            )
          )
        : "",
    },
    {
      label: "Photos",
      value: form.propertyPhotos.length ? `${form.propertyPhotos.length}/10` : "",
    },
    {
      label: "Proposal Notes",
      value: form.proposalNotes ? "Yes" : "",
    },
    { label: "Estimated Quote", value: formatRange(estimate) },
  ];

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => (step === 1 ? onBack?.() : setStep((s) => s - 1));

  const gbp = (n) => `£${Number(n || 0).toLocaleString()}`;

  // "Get My Quote" — moved here from the final screen. Fires the full lead
  // submission (server re-price → Power Automate row + Resend email) and
  // advances to the final quote screen. Re-clicking after edits regenerates the
  // quote, resends the email, resubmits the Power Automate payload and creates
  // an updated quote version. Only a request already in flight is blocked.
  const submitQuote = async () => {
    if (submitStatus === "sending") return;
    const version = quoteVersion + 1;
    setQuoteVersion(version);
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "Home Removals",
          name: form.name || "",
          email: form.email || "",
          phone: form.phone || "",
          estimate,
          distanceMiles,
          travelComponent,
          currency: "GBP",
          quoteVersion: version,
          details: { ...form, quoteVersion: version },
          source: "quote-configurator",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setSubmitStatus("done");
      setStep(TOTAL_STEPS); // advance to the final quote screen
    } catch (err) {
      console.error("[HomeRemovalsFlow] Get My Quote submit failed:", err);
      setSubmitStatus("error");
    }
  };

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

          {/* STEP 7 — Special/Oversized Items */}
          {step === 7 && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                Any special or oversized items?
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                Pianos, safes, trampolines, servers, or anything requiring specialist handling.
              </p>
              <SpecialItemsSection
                items={form.specialItems}
                onChange={(items) => set("specialItems", items)}
              />
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

          {/* STEP 12 — Dismantling & Reassembly */}
          {step === 12 && (
            <div className="space-y-4">
              <h2 className="text-center font-semibold text-gray-800">
                Items requiring dismantling?
              </h2>
              <p className="text-center text-xs text-gray-500 mb-4">
                Capture quantity for each item type. Reassembly can be added at destination.
              </p>
              {DISMANTLING_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-gray-200 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <Stepper
                      value={form.dismantling[item.key]?.qty || 0}
                      onChange={(q) =>
                        set("dismantling", {
                          ...form.dismantling,
                          [item.key]: {
                            qty: q,
                            reassemblyRequired: form.dismantling[item.key]?.reassemblyRequired || "No",
                          },
                        })
                      }
                    />
                  </div>
                  {form.dismantling[item.key]?.qty > 0 && (
                    <div className="text-xs font-medium text-gray-700 pt-2 border-t border-gray-100">
                      Reassembly?
                      <div className="mt-1 flex gap-1">
                        {["Yes", "No"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              set("dismantling", {
                                ...form.dismantling,
                                [item.key]: {
                                  ...form.dismantling[item.key],
                                  reassemblyRequired: opt,
                                },
                              })
                            }
                            className={`flex-1 rounded border px-2 py-1 text-xs font-medium transition ${
                              form.dismantling[item.key]?.reassemblyRequired === opt
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 13 — Property Photos */}
          {step === 13 && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                Add property photos (optional)
              </h2>
              <PhotoUploadSection
                quoteRef={quoteRef}
                photos={form.propertyPhotos}
                onChange={(photos) => set("propertyPhotos", photos)}
              />
            </div>
          )}

          {/* STEP 14 — Proposal Notes */}
          {step === 14 && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                Any additional notes?
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                Special requirements, access details, or anything else our team should know.
              </p>
              <Field label="Notes (optional)">
                <textarea
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                  rows="5"
                  placeholder="e.g., Building requires prior notice, main staircase is narrow, prefer morning delivery..."
                  value={form.proposalNotes}
                  onChange={(e) => set("proposalNotes", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* STEP 15 — Lead Attribution */}
          {step === 15 && (
            <LeadAttributionStep
              leadSource={form.leadSource}
              referrerName={form.referrerName}
              onChange={set}
            />
          )}

          {/* STEP 17 — Review Summary */}
          {step === 17 && (
            <ReviewSummary sections={reviewSections} overview={quoteOverview}>
              {customQuoteRequired && (
                <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
                  ⚠ Custom Quote Required — submit your details and our team will
                  confirm a tailored price.
                </div>
              )}

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
                  onClick={submitQuote}
                  disabled={submitStatus === "sending"}
                  className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitStatus === "sending" ? "Sending…" : "Get My Quote"}
                </button>
              </div>
              {submitStatus === "error" && (
                <p className="mt-2 text-center text-sm text-red-500">
                  Something went wrong. Please try again, or call us to confirm.
                </p>
              )}
            </ReviewSummary>
          )}

          {/* STEP 18 — Final quote & breakdown */}
          {step === 18 && (
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

              <div className="w-full rounded-lg bg-green-50 px-6 py-3 text-center text-sm font-semibold text-green-800 ring-1 ring-green-200">
                ✅ Thank you — your request has been sent. Our team will be in
                touch shortly to confirm your quote.
              </div>
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

      {/* Navigation — capture steps only; Review (12) & Final (13) have their own */}
      {step < REVIEW_STEP && (
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

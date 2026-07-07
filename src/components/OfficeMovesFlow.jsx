"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscountEligibility from "./DiscountEligibility";
import SubmitQuoteButton from "./SubmitQuoteButton";
import { formatRange } from "../lib/pricing";
import { useServerQuote } from "../lib/useServerQuote";

/* ---------------------------------------------------------------------------
 * Enhanced Office Moves flow for the QuickMove Quote configurator.
 * Self-contained — does not touch the rest of MultiServicePlatform.
 * ------------------------------------------------------------------------- */

/* Office size buttons — images come from the EXACT provided path:
 * public/images/Office Icons Configurator  →  served at "/images/Office Icons Configurator/"
 */
const officeSizes = [
  {
    id: "Small Office",
    label: "Small Office",
    hint: "Single floor · up to ~10 desks",
    image: "/images/Office Icons Configurator/Smoovely Office Move - Small Office - One floor.png",
  },
  {
    id: "Medium Office",
    label: "Medium Office",
    hint: "10–25 desks",
    image: "/images/Office Icons Configurator/Smoovely Office Move - Medium Office - Two floors.png",
  },
  {
    id: "Large Office",
    label: "Large Office",
    hint: "25+ desks",
    image: "/images/Office Icons Configurator/Smoovely Office Move - Large Office - 1-3 floors.png",
  },
  {
    id: "Multi-Site / Phased Move",
    label: "Multi-Site / Phased Move",
    hint: "Project managed",
    image: "/images/Office Icons Configurator/Smoovely Office Move - Multiple Office Moves - Project Managed.png",
  },
];

const inventory = [
  { key: "desks", label: "Desks" },
  { key: "chairs", label: "Chairs" },
  { key: "filing", label: "Filing cabinets" },
  { key: "it", label: "IT equipment" },
  { key: "servers", label: "Servers" },
  { key: "printers", label: "Printers" },
];

const complexity = [
  { key: "movingIT", label: "Moving IT equipment?", follow: "managed disconnection of servers" },
  { key: "packing", label: "Packing required?" },
  { key: "dismantling", label: "Dismantling required?" },
  { key: "outOfHours", label: "Out-of-hours move?", follow: "preferred window" },
  { key: "phased", label: "Phased move?", follow: "number of phases" },
];

// Optional complexity factors (checkboxes) — each maps to a future pricing tag.
const complexityFactors = [
  { key: "longWalk", label: "Long walk from vehicle to office", tag: "long_walk" },
  { key: "restrictedLoading", label: "Restricted loading times", tag: "restricted_loading" },
  { key: "buildingMgmt", label: "Building management restrictions", tag: "building_mgmt" },
  { key: "liftBooking", label: "Lift booking required", tag: "lift_booking" },
  { key: "ooh", label: "Weekend / out-of-hours move", tag: "out_of_hours" },
  { key: "heavyIT", label: "Heavy IT/server relocation", tag: "IT_equipment" },
  { key: "meetingRooms", label: "Large meeting room setups", tag: "meeting_rooms" },
  { key: "partition", label: "Partition / office breakdown", tag: "partition_breakdown" },
];

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

function AccessSection({ title, value, onChange, open, onToggle }) {
  const summary =
    [value.parking, value.lift && `Lift: ${value.lift}`, value.stairs && `Stairs: ${value.stairs}`]
      .filter(Boolean)
      .join(" · ") || "Tap to set access";
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span>
          <span className="block text-sm font-bold text-gray-800">{title}</span>
          <span className="block text-xs text-gray-500">{summary}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-gray-100 p-4">
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
                  Lift
                </p>
                <Segmented
                  options={["Yes", "No"]}
                  value={value.lift}
                  onChange={(v) => onChange({ ...value, lift: v })}
                />
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange, children }) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <div className="w-28 shrink-0">
          <Segmented options={["Yes", "No"]} value={value} onChange={onChange} />
        </div>
      </div>
      {value === "Yes" && children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function OfficeMovesFlow({ onBack }) {
  const [step, setStep] = useState(1);
  const [openAccess, setOpenAccess] = useState("pickup"); // first open by default
  const [form, setForm] = useState({
    pickupPostcode: "",
    destPostcode: "",
    name: "",
    phone: "",
    email: "",
    officeSize: "",
    desks: 0,
    boxes: 0,
    inventory: {},
    pickup: { parking: "Free", lift: "No", stairs: "No" },
    dropoff: { parking: "Free", lift: "No", stairs: "No" },
    movingIT: "No",
    servers: "No",
    packing: "No",
    dismantling: "No",
    outOfHours: "No",
    oohWindow: "Evenings",
    phased: "No",
    phases: 2,
    // --- Advanced Move Complexity (only collected when triggered) ---
    multiFloor: "No",
    floors: 3,
    phasedMove: "No",
    phaseCount: 2,
    phaseDays: 2,
    multiSite: "No",
    siteCount: 2,
    projectMgmt: "No",
    projectNote: "",
    onSiteCoord: "No",
    tightTimeline: "No",
    sensitiveAreas: "No",
    factors: {},
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Server-authoritative quote (service + travel computed in /api/price).
  const { estimate, distanceMiles, travelComponent, loading } = useServerQuote(
    "Office Moves",
    form
  );

  // Conditions that surface the optional Advanced Complexity step.
  const showComplexity =
    form.officeSize === "Large Office" ||
    form.officeSize === "Multi-Site / Phased Move" ||
    Number(form.desks) > 15 ||
    form.phased === "Yes";

  // Step 6 = Complexity (only when triggered); Review is always the last step.
  const totalSteps = showComplexity ? 7 : 6;

  const detailsValid =
    form.pickupPostcode && form.destPostcode && form.email;

  // Internal pricing tags — structured now to feed a future pricing engine:
  // TOTAL = Labour + Transport + Complexity + Services
  const buildPricingFlags = () => {
    const flags = [];
    [form.pickup, form.dropoff].forEach((a) => {
      if (a.stairs === "Yes" && a.lift === "No") flags.push("stairs_no_lift");
    });
    if (form.movingIT === "Yes") flags.push("IT_equipment");
    if (form.outOfHours === "Yes") flags.push("out_of_hours"); // multiplier
    if (form.phased === "Yes" || form.phasedMove === "Yes") flags.push("phased_move");
    if (form.multiFloor === "Yes") flags.push("multi_floor");
    if (form.multiSite === "Yes") flags.push("multi_site");
    if (form.projectMgmt === "Yes") flags.push("project_management"); // premium
    if (form.tightTimeline === "Yes") flags.push("tight_timeline");
    if (form.sensitiveAreas === "Yes") flags.push("sensitive_areas");
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
          <span>Office Moves</span>
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
          {/* STEP 1 — Contact & Locations */}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">
                Contact & locations
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Pickup Postcode" required>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. EC2A 1AB"
                    value={form.pickupPostcode}
                    onChange={(e) => set("pickupPostcode", e.target.value)}
                  />
                </Field>
                <Field label="Destination Postcode" required>
                  <input
                    className="w-full rounded-lg border border-gray-300 p-3 uppercase"
                    placeholder="e.g. E14 5AB"
                    value={form.destPostcode}
                    onChange={(e) => set("destPostcode", e.target.value)}
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

          {/* STEP 2 — Office size (VISUAL IMAGE BUTTONS) */}
          {step === 2 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                How big is the office?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {officeSizes.map((opt) => {
                  const active = form.officeSize === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("officeSize", opt.id)}
                      className={`overflow-hidden rounded-xl border-2 bg-white text-center transition ${
                        active
                          ? "border-blue-600 shadow-lg"
                          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {/* Image from the provided "Office Icons Configurator" path */}
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="h-28 w-full bg-gray-50 object-contain p-2"
                      />
                      {/* Text UNDER the image */}
                      <span className="block px-2 pb-1 text-sm font-semibold text-gray-800">
                        {opt.label}
                      </span>
                      <span className="block px-2 pb-3 text-xs text-gray-500">
                        {opt.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — Scope & Volume */}
          {step === 3 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Scope & volume
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Number of desks">
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    value={form.desks}
                    onChange={(e) => set("desks", e.target.value)}
                  />
                </Field>
                <Field label="Boxes">
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    value={form.boxes}
                    onChange={(e) => set("boxes", e.target.value)}
                  />
                </Field>
              </div>
              <p className="mb-2 mt-4 text-sm font-medium text-gray-700">
                What needs moving?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {inventory.map((item) => {
                  const active = !!form.inventory[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        set("inventory", {
                          ...form.inventory,
                          [item.key]: !active,
                        })
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
            </div>
          )}

          {/* STEP 4 — Access (collapsible) */}
          {step === 4 && (
            <div className="space-y-3">
              <h2 className="text-center font-semibold text-gray-800">
                Access at each site
              </h2>
              <AccessSection
                title="Pickup"
                value={form.pickup}
                onChange={(v) => set("pickup", v)}
                open={openAccess === "pickup"}
                onToggle={() =>
                  setOpenAccess(openAccess === "pickup" ? "" : "pickup")
                }
              />
              <AccessSection
                title="Drop-off"
                value={form.dropoff}
                onChange={(v) => set("dropoff", v)}
                open={openAccess === "dropoff"}
                onToggle={() =>
                  setOpenAccess(openAccess === "dropoff" ? "" : "dropoff")
                }
              />
            </div>
          )}

          {/* STEP 5 — Services & complexity (conditional follow-ups) */}
          {step === 5 && (
            <div>
              <h2 className="mb-4 text-center font-semibold text-gray-800">
                Services & complexity
              </h2>
              <div className="space-y-3">
                {complexity.map((c) => (
                  <div
                    key={c.key}
                    className="rounded-xl border border-gray-200 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-gray-800">
                        {c.label}
                      </span>
                      <div className="w-28">
                        <Segmented
                          options={["Yes", "No"]}
                          value={form[c.key]}
                          onChange={(v) => set(c.key, v)}
                        />
                      </div>
                    </div>

                    {/* Conditional follow-ups — only when YES */}
                    {c.key === "movingIT" && form.movingIT === "Yes" && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs text-gray-500">
                          Servers needing managed disconnection?
                        </p>
                        <Segmented
                          options={["Yes", "No"]}
                          value={form.servers}
                          onChange={(v) => set("servers", v)}
                        />
                      </div>
                    )}
                    {c.key === "outOfHours" && form.outOfHours === "Yes" && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs text-gray-500">
                          Preferred window
                        </p>
                        <Segmented
                          options={["Evenings", "Weekend"]}
                          value={form.oohWindow}
                          onChange={(v) => set("oohWindow", v)}
                        />
                      </div>
                    )}
                    {c.key === "phased" && form.phased === "Yes" && (
                      <div className="mt-3">
                        <Field label="Number of phases">
                          <input
                            type="number"
                            min="2"
                            className="w-full rounded-lg border border-gray-300 p-2"
                            value={form.phases}
                            onChange={(e) => set("phases", e.target.value)}
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 — Advanced Move Complexity (conditional) */}
          {step === 6 && showComplexity && (
            <div>
              <h2 className="mb-1 text-center font-semibold text-gray-800">
                A few extra details
              </h2>
              <p className="mb-4 text-center text-xs text-gray-500">
                For larger or complex moves, just a few extra details help us
                give a more accurate quote.
              </p>

              <div className="space-y-3">
                <ToggleRow
                  label="Move across multiple floors (3+)?"
                  value={form.multiFloor}
                  onChange={(v) => set("multiFloor", v)}
                >
                  <Field label="Number of floors">
                    <input
                      type="number"
                      min="3"
                      className="w-full rounded-lg border border-gray-300 p-2"
                      value={form.floors}
                      onChange={(e) => set("floors", e.target.value)}
                    />
                  </Field>
                </ToggleRow>

                <ToggleRow
                  label="Will the move happen in phases?"
                  value={form.phasedMove}
                  onChange={(v) => set("phasedMove", v)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Phases">
                      <input
                        type="number"
                        min="2"
                        className="w-full rounded-lg border border-gray-300 p-2"
                        value={form.phaseCount}
                        onChange={(e) => set("phaseCount", e.target.value)}
                      />
                    </Field>
                    <Field label="Duration (days)">
                      <input
                        type="number"
                        min="1"
                        className="w-full rounded-lg border border-gray-300 p-2"
                        value={form.phaseDays}
                        onChange={(e) => set("phaseDays", e.target.value)}
                      />
                    </Field>
                  </div>
                </ToggleRow>

                <ToggleRow
                  label="Multiple office locations involved?"
                  value={form.multiSite}
                  onChange={(v) => set("multiSite", v)}
                >
                  <Field label="Number of locations">
                    <input
                      type="number"
                      min="2"
                      className="w-full rounded-lg border border-gray-300 p-2"
                      value={form.siteCount}
                      onChange={(e) => set("siteCount", e.target.value)}
                    />
                  </Field>
                </ToggleRow>

                <ToggleRow
                  label="Require a dedicated move manager?"
                  value={form.projectMgmt}
                  onChange={(v) => set("projectMgmt", v)}
                >
                  <Field label="Anything we should know?">
                    <input
                      className="w-full rounded-lg border border-gray-300 p-2"
                      placeholder="Optional note"
                      value={form.projectNote}
                      onChange={(e) => set("projectNote", e.target.value)}
                    />
                  </Field>
                </ToggleRow>

                <ToggleRow
                  label="Need on-site coordination by Smoovely?"
                  value={form.onSiteCoord}
                  onChange={(v) => set("onSiteCoord", v)}
                />
                <ToggleRow
                  label="Time-sensitive / deadline-driven move?"
                  value={form.tightTimeline}
                  onChange={(v) => set("tightTimeline", v)}
                />
                <ToggleRow
                  label="Sensitive areas (finance, legal, confidential)?"
                  value={form.sensitiveAreas}
                  onChange={(v) => set("sensitiveAreas", v)}
                />
              </div>

              {/* Optional complexity factors */}
              <p className="mb-2 mt-5 text-sm font-medium text-gray-700">
                Anything else apply? (optional)
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {complexityFactors.map((f) => {
                  const active = !!form.factors[f.key];
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() =>
                        set("factors", { ...form.factors, [f.key]: !active })
                      }
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition ${
                        active
                          ? "border-blue-600 bg-blue-50 font-medium text-blue-800"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {active && "✓"}
                      </span>
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* REVIEW & submit (always the final step) */}
          {step === totalSteps && (
            <div className="text-center" data-pricing-flags={buildPricingFlags().join(",")}>
              <h2 className="mb-1 text-sm font-medium text-gray-500">
                Your estimated quote
              </h2>
              <p className="mb-1 text-4xl font-bold text-gray-900">
                {loading && !estimate ? "Calculating…" : formatRange(estimate)}
              </p>
              <p className="mb-4 text-xs text-gray-500">
                Estimated range · final price confirmed on site survey
              </p>
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-left text-xs text-gray-600">
                <p>
                  <span className="font-semibold">Route:</span>{" "}
                  {form.pickupPostcode || "—"} → {form.destPostcode || "—"}
                </p>
                <p>
                  <span className="font-semibold">Office:</span>{" "}
                  {form.officeSize || "—"}
                </p>
                <p>
                  <span className="font-semibold">Desks:</span>{" "}
                  {form.desks || 0}
                </p>
                <p>
                  <span className="font-semibold">IT / Servers:</span>{" "}
                  {form.movingIT}
                  {form.movingIT === "Yes" && ` · Servers: ${form.servers}`}
                </p>
              </div>
              <p className="mb-5 text-xs italic text-gray-500">
                We focus on structured office moves to minimise disruption to
                your business.
              </p>
              <SubmitQuoteButton
                service="Office Moves"
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

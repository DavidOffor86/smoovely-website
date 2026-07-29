"use client";

import { useEffect } from "react";
import {
  LEAD_SOURCES,
  shouldAskReferrer,
  parseRefParam,
} from "../../lib/leadAttribution";

/* ---------------------------------------------------------------------------
 * Lead Attribution step — shared by every quote configurator.
 *
 * Renders "How did you hear about Smoovely?" (required) and the conditional
 * "Who referred you?" free-text follow-up. Placed AFTER contact details and
 * immediately BEFORE the Review Summary in each flow — never at the start.
 *
 * useReferralParam() reads ?ref= from the URL once on mount and pre-fills the
 * attribution fields (leadSource = Estate Agent, referrerName = prettified
 * code, leadSourceCode = raw code), leaving them fully editable. Reading
 * window.location avoids a Suspense boundary requirement.
 * ------------------------------------------------------------------------- */

export function useReferralParam(setForm) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = parseRefParam(window.location.search);
    if (!parsed) return;
    // Only fill blanks so a customer's manual edits are never overwritten.
    setForm((f) => ({
      ...f,
      leadSource: f.leadSource || parsed.leadSource,
      referrerName: f.referrerName || parsed.referrerName,
      leadSourceCode: f.leadSourceCode || parsed.leadSourceCode,
    }));
  }, [setForm]);
}

export default function LeadAttributionStep({ leadSource, referrerName, onChange }) {
  return (
    <div>
      <h2 className="mb-1 text-center font-semibold text-gray-800">
        How did you hear about Smoovely?
      </h2>
      <p className="mb-4 text-center text-xs text-gray-500">
        Just one quick question — it helps us understand how customers find us.
        <span className="text-red-500"> *</span>
      </p>

      <div className="grid grid-cols-2 gap-2">
        {LEAD_SOURCES.map((opt) => {
          const active = leadSource === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange("leadSource", opt)}
              className={`rounded-lg border p-3 text-sm font-medium transition ${
                active
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {shouldAskReferrer(leadSource) && (
        <div className="mt-5">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Who referred you?{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </span>
            <input
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="e.g. Robinson Jackson, Acorn, Haart, John Smith"
              value={referrerName}
              onChange={(e) => onChange("referrerName", e.target.value)}
            />
          </label>
          <p className="mt-2 text-xs text-gray-400">
            If a local agent or professional recommended us, let us know who — it
            helps us thank them.
          </p>
        </div>
      )}
    </div>
  );
}

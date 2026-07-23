"use client";

import { useMemo, useState } from "react";
import {
  referralStatusLabel,
  isActiveReferral,
  calculateReferralValue,
} from "../lib/referralRecord";

/* ---------------------------------------------------------------------------
 * Referral management table (Phase D) — READ-ONLY.
 *
 * Internal admin view of referral records with simple client-side filtering
 * (All / Active / Converted / Lost). No editing, no auth, no network — data is
 * passed in (mock rows today, a live "Smoovely Referrals" source later). All
 * derived values come from the shared referralRecord helpers so the table and
 * future automations stay consistent.
 * ------------------------------------------------------------------------- */

const FILTERS = ["All", "Active", "Converted", "Lost"];

// Status → badge styling. Falls back to neutral for anything unmapped.
const STATUS_STYLES = {
  New: "bg-slate-100 text-slate-600",
  Sent: "bg-sky-100 text-sky-700",
  Contacted: "bg-sky-100 text-sky-700",
  Qualified: "bg-indigo-100 text-indigo-700",
  "Viewing Booked": "bg-amber-100 text-amber-700",
  "Offer Made": "bg-amber-100 text-amber-700",
  Converted: "bg-green/10 text-green",
  Closed: "bg-slate-100 text-slate-500",
  Lost: "bg-red-100 text-red-600",
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {referralStatusLabel(status)}
    </span>
  );
}

function matchesFilter(referral, filter) {
  switch (filter) {
    case "Active":
      return isActiveReferral(referral.status);
    case "Converted":
      return referral.status === "Converted";
    case "Lost":
      return referral.status === "Lost";
    default:
      return true;
  }
}

export default function ReferralsTable({ referrals = [] }) {
  const [filter, setFilter] = useState("All");

  const counts = useMemo(() => {
    const c = { All: referrals.length, Active: 0, Converted: 0, Lost: 0 };
    for (const r of referrals) {
      if (isActiveReferral(r.status)) c.Active += 1;
      if (r.status === "Converted") c.Converted += 1;
      if (r.status === "Lost") c.Lost += 1;
    }
    return c;
  }, [referrals]);

  const rows = useMemo(
    () => referrals.filter((r) => matchesFilter(r, filter)),
    [referrals, filter]
  );

  // Totals reflect the currently filtered rows.
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => {
          const { revenue, referralFee } = calculateReferralValue(r);
          acc.revenue += revenue;
          acc.referralFee += referralFee;
          return acc;
        },
        { revenue: 0, referralFee: 0 }
      ),
    [rows]
  );

  const GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${
                active
                  ? "border-green bg-green text-white shadow-sm shadow-green/25"
                  : "border-slate-300 bg-white text-navy hover:border-green hover:bg-green/5"
              }`}
            >
              {f}
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Referral Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Referral Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No referrals in this view.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => {
                const { revenueDisplay, referralFeeDisplay } =
                  calculateReferralValue(r);
                return (
                  <tr key={`${r.leadEmail}-${r.partner}-${i}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-navy">
                        {r.leadName || "—"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {r.leadEmail || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy">{r.partner || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.referralType || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-navy">
                      {revenueDisplay}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-navy">
                      {referralFeeDisplay}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot className="bg-slate-50 text-sm font-semibold text-navy">
              <tr>
                <td className="px-4 py-3" colSpan={4}>
                  {rows.length} referral{rows.length === 1 ? "" : "s"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {GBP.format(totals.revenue)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {GBP.format(totals.referralFee)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Read-only view · Mock data for UI development · Aligns with the “Smoovely
        Referrals” Microsoft List.
      </p>
    </div>
  );
}

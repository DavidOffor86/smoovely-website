/* ---------------------------------------------------------------------------
 * Referral record model + helpers (Phase D) — pure, no framework/network deps.
 *
 * Foundations for turning qualified opportunity captures (Phase C) into
 * trackable referral records that align 1:1 with the "Smoovely Referrals"
 * Microsoft List. NO live automations, NO auth, NO portals — just the data
 * shapes and helper functions later Power Automate flows and reporting can
 * build on.
 *
 * Keeps the quote / feedback / opportunity pipelines completely untouched.
 * ------------------------------------------------------------------------- */

/** Partner categories a lead can be referred to. */
export const PARTNER_TYPES = [
  "Estate Agent",
  "Letting Agent",
  "Mortgage Broker",
  "Solicitor",
  "Property Search",
  "Storage Provider",
  "Packing Services",
  "House Clearance",
  "Utilities Partner",
  "Other",
];

/** The nature of the lead being referred. */
export const REFERRAL_TYPES = [
  "Buyer Lead",
  "Rental Lead",
  "Investor Lead",
  "Student Lead",
  "Relocation Lead",
  "Mortgage Lead",
  "Solicitor Lead",
  "Storage Lead",
  "Packing Lead",
  "House Clearance Lead",
  "Utilities Lead",
];

/** Ordered referral status pipeline. */
export const STATUS_VALUES = [
  "New",
  "Sent",
  "Contacted",
  "Qualified",
  "Viewing Booked",
  "Offer Made",
  "Converted",
  "Closed",
  "Lost",
];

// Statuses that represent in-flight work (everything before a terminal state).
const ACTIVE_STATUSES = new Set([
  "New",
  "Sent",
  "Contacted",
  "Qualified",
  "Viewing Booked",
  "Offer Made",
]);

// Default referral fee rate (fraction of revenue) per partner type. Used ONLY
// to derive a fee when none has been recorded — a hook for future automation.
// Conservative placeholders; real rates are set per partner agreement later.
const DEFAULT_FEE_RATE = {
  "Estate Agent": 0.1,
  "Letting Agent": 0.1,
  "Mortgage Broker": 0.25,
  Solicitor: 0.1,
  "Property Search": 0.1,
  "Storage Provider": 0.1,
  "Packing Services": 0.1,
  "House Clearance": 0.1,
  "Utilities Partner": 0.15,
  Other: 0.1,
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/**
 * Human-friendly status label. Currently a pass-through validated against the
 * known pipeline, but centralised so future wording / i18n changes live in one
 * place and unknown values degrade gracefully.
 */
export function referralStatusLabel(status) {
  return STATUS_VALUES.includes(status) ? status : status || "New";
}

/** True while a referral is still in progress (not Converted / Closed / Lost). */
export function isActiveReferral(status) {
  return ACTIVE_STATUSES.has(status);
}

/**
 * Normalise the monetary value of a referral.
 *
 * Returns numeric `revenue` and `referralFee` plus GBP-formatted display
 * strings. When no explicit fee is recorded, derives one from the partner's
 * default rate (future-automation hook) — never overrides an explicit fee.
 */
export function calculateReferralValue(referral = {}) {
  const revenue = toNumber(referral.revenue);

  let referralFee = toNumber(referral.referralFee);
  const feeWasProvided =
    referral.referralFee != null && referral.referralFee !== "";

  if (!feeWasProvided && revenue > 0) {
    const rate = DEFAULT_FEE_RATE[referral.partner] ?? DEFAULT_FEE_RATE.Other;
    referralFee = Math.round(revenue * rate);
  }

  return {
    revenue,
    referralFee,
    revenueDisplay: GBP.format(revenue),
    referralFeeDisplay: GBP.format(referralFee),
  };
}

/**
 * Flat referral record — a superset of the "Smoovely Referrals" List columns
 * plus internal context fields (nextMoveType / targetArea / source) for
 * traceability. One key = one column.
 */
export function buildReferralRecord({
  timestamp,
  lead = {},
  opportunity = {},
  partner = "Other",
  referralType = "",
  status = "New",
  revenue,
  referralFee,
  notes = "",
  source = "whats-next-opportunity",
} = {}) {
  return {
    timestamp: timestamp || "",

    leadName: (lead.name || "").trim(),
    leadEmail: (lead.email || "").trim(),
    leadPhone: (lead.phone || "").trim(),

    // Context carried from the originating opportunity (not List columns).
    nextMoveType: opportunity.nextMoveType || "",
    targetArea: opportunity.targetArea || "",

    partner: PARTNER_TYPES.includes(partner) ? partner : "Other",
    referralType: REFERRAL_TYPES.includes(referralType) ? referralType : "",
    status: STATUS_VALUES.includes(status) ? status : "New",

    revenue: toNumber(revenue),
    referralFee: toNumber(referralFee),

    notes: (notes || "").trim(),
    source,
  };
}

/**
 * Map a flat referral record to the exact "Smoovely Referrals" List columns.
 * Keeps the List schema decoupled from the internal record shape.
 */
export function toReferralListItem(record = {}) {
  return {
    Timestamp: record.timestamp || "",
    "Lead Name": record.leadName || "",
    "Lead Email": record.leadEmail || "",
    "Lead Phone": record.leadPhone || "",
    Partner: record.partner || "",
    "Referral Type": record.referralType || "",
    Status: record.status || "",
    Revenue: toNumber(record.revenue),
    "Referral Fee": toNumber(record.referralFee),
    Notes: record.notes || "",
  };
}

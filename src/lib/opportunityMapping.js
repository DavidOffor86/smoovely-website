/* ---------------------------------------------------------------------------
 * Opportunity → Referral mapping helpers (Phase D) — pure, no side effects.
 *
 * Turns a Phase C "What's Next" opportunity into the set of partner referrals
 * it should generate. MAPPING FUNCTIONS ONLY — nothing here creates records,
 * calls a network, or triggers automation. These are the deterministic rules a
 * future Power Automate flow (or a server route) will call to fan an
 * opportunity out into "Smoovely Referrals" rows.
 * ------------------------------------------------------------------------- */

// Partner set implied by the customer's stated intent.
const MOVE_TYPE_PARTNERS = {
  "Looking to buy": ["Estate Agent", "Mortgage Broker", "Solicitor"],
  "Looking to rent": ["Letting Agent"],
  "Student accommodation": ["Letting Agent"],
  "Property investor": ["Estate Agent", "Mortgage Broker", "Solicitor"],
  // Relocation only implies a partner when storage is required (handled below).
  "Relocating for work": [],
  "I'm settled for now": [],
  "Not sure yet": [],
};

// Additional-support selection → { partner, referralType }. "Nothing Else"
// intentionally maps to nothing.
const SUPPORT_MAP = {
  "Estate Agent Support": { partner: "Estate Agent", referralType: "Buyer Lead" },
  "Mortgage Advice": { partner: "Mortgage Broker", referralType: "Mortgage Lead" },
  Solicitor: { partner: "Solicitor", referralType: "Solicitor Lead" },
  "Property Search": { partner: "Estate Agent", referralType: "Buyer Lead" },
  Storage: { partner: "Storage Provider", referralType: "Storage Lead" },
  "Packing Services": { partner: "Packing Services", referralType: "Packing Lead" },
  "House Clearance": { partner: "House Clearance", referralType: "House Clearance Lead" },
  "Utilities Setup": { partner: "Utilities Partner", referralType: "Utilities Lead" },
  "Nothing Else": null,
};

/**
 * Resolve the referral type for a partner in the context of the move type.
 * Estate/Letting agents depend on intent; everything else is fixed.
 */
export function partnerToReferralType(partner, nextMoveType) {
  switch (partner) {
    case "Estate Agent":
      return nextMoveType === "Property investor" ? "Investor Lead" : "Buyer Lead";
    case "Letting Agent":
      return nextMoveType === "Student accommodation" ? "Student Lead" : "Rental Lead";
    case "Mortgage Broker":
      return "Mortgage Lead";
    case "Solicitor":
      return "Solicitor Lead";
    case "Storage Provider":
      return "Storage Lead";
    case "Packing Services":
      return "Packing Lead";
    case "House Clearance":
      return "House Clearance Lead";
    case "Utilities Partner":
      return "Utilities Lead";
    default:
      return "";
  }
}

/** Partners implied by the move type (+ storage for relocation). */
export function mapMoveTypeToPartners(nextMoveType, { storageRequired } = {}) {
  const partners = [...(MOVE_TYPE_PARTNERS[nextMoveType] || [])];
  if (nextMoveType === "Relocating for work" && storageRequired === "Yes") {
    partners.push("Storage Provider");
  }
  return partners;
}

// Normalise additionalSupport, which may arrive as an array or a comma string.
function toSupportArray(additionalSupport) {
  if (Array.isArray(additionalSupport)) return additionalSupport;
  if (typeof additionalSupport === "string") {
    return additionalSupport
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/** Additional-support selections → [{ partner, referralType }]. */
export function mapSupportToReferralTypes(additionalSupport) {
  return toSupportArray(additionalSupport)
    .map((s) => SUPPORT_MAP[s])
    .filter(Boolean);
}

/**
 * Full opportunity → referral suggestions. Combines intent-driven partners and
 * additional-support selections, deduped by partner (first mapping wins), each
 * with a resolved referral type. Returns [{ partner, referralType }].
 *
 * Pure suggestion list — the caller decides whether/how to persist it.
 */
export function mapOpportunityToReferrals(opportunity = {}) {
  const { nextMoveType, storageRequired } = opportunity;
  const seen = new Map();

  // 1) Intent-driven partners.
  for (const partner of mapMoveTypeToPartners(nextMoveType, { storageRequired })) {
    if (!seen.has(partner)) {
      seen.set(partner, {
        partner,
        referralType: partnerToReferralType(partner, nextMoveType),
      });
    }
  }

  // 2) Additional-support selections (don't overwrite an intent-driven type).
  for (const { partner, referralType } of mapSupportToReferralTypes(
    opportunity.additionalSupport
  )) {
    if (!seen.has(partner)) {
      seen.set(partner, {
        partner,
        referralType: partnerToReferralType(partner, nextMoveType) || referralType,
      });
    }
  }

  return [...seen.values()];
}

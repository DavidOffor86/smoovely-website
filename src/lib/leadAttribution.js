/* ---------------------------------------------------------------------------
 * Lead attribution helpers (pure — no framework/network deps).
 *
 * Shared across ALL quote configurators so "How did you hear about Smoovely?"
 * behaves identically everywhere. Also supports future Estate Agent referral
 * URLs (/quote?ref=acorn-dartford) by parsing the ?ref= code into attribution
 * fields. Referral PARSING lives here; the mount-time hook that reads the URL
 * lives in the client LeadAttributionStep component.
 * ------------------------------------------------------------------------- */

/** Q1 options — order matches the spec. */
export const LEAD_SOURCES = [
  "Google Search",
  "Google Review",
  "Estate Agent",
  "Letting Agent",
  "Mortgage Broker",
  "Solicitor",
  "Word of Mouth",
  "Returning Customer",
  "Facebook",
  "Instagram",
  "TikTok",
  "Leaflet",
  "Vehicle Branding",
  "Community Group",
  "Other",
];

// Sources for which we ask the optional "Who referred you?" follow-up.
const REFERRER_SOURCES = new Set([
  "Estate Agent",
  "Letting Agent",
  "Mortgage Broker",
  "Solicitor",
  "Other",
]);

/** True when leadSource should surface the referrer-name question. */
export function shouldAskReferrer(leadSource) {
  return REFERRER_SOURCES.has(leadSource);
}

/** "robinson-jackson" / "acorn_dartford" → "Robinson Jackson" / "Acorn Dartford". */
export function prettifyRefCode(code) {
  return String(code || "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Parse a URL query string for a ?ref= referral code. Returns attribution
 * fields (default source = Estate Agent, per spec) or null when absent.
 */
export function parseRefParam(search) {
  let ref = null;
  try {
    ref = new URLSearchParams(search || "").get("ref");
  } catch {
    ref = null;
  }
  const code = (ref || "").trim();
  if (!code) return null;
  return {
    leadSource: "Estate Agent",
    referrerName: prettifyRefCode(code),
    leadSourceCode: code,
  };
}

/** Initial attribution fields — spread into each flow's form state. */
export const ATTRIBUTION_DEFAULTS = {
  leadSource: "",
  referrerName: "",
  leadSourceCode: "",
};

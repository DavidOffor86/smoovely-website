/* ---------------------------------------------------------------------------
 * "What's Next" opportunity record builders (Phase C) — pure, no framework or
 * network deps.
 *
 * Turns a submitted What's Next survey into:
 *   - a FLAT record for Power Automate / Microsoft Lists / Excel / future CRM
 *     (one key = one column)
 *   - a formatted plain-text notification email
 *
 * Qualification (priority + partner "opportunity tags") is ALWAYS re-derived
 * here from the raw answers so the stored value can never be tampered with
 * client-side — mirrors the server re-derivation in the quote and feedback
 * pipelines. Kept fully separate from those pipelines.
 * ------------------------------------------------------------------------- */

// Base partner opportunity by intent. Rent/Student feed lettings; Buy/Investor
// feed the purchase chain (agent + mortgage + conveyancing).
const MOVE_TYPE_TAGS = {
  "Looking to buy": ["Estate Agent", "Mortgage Broker", "Solicitor"],
  "Looking to rent": ["Letting Agent"],
  "Student accommodation": ["Letting Agent"],
  "Property investor": ["Estate Agent", "Mortgage Broker", "Solicitor"],
  "Relocating for work": [],
  "I'm settled for now": [],
  "Not sure yet": [],
};

// Additional-support selections → partner opportunity. "Nothing Else" maps to
// nothing (null) so it never creates a tag.
const SUPPORT_TAGS = {
  "Estate Agent Support": "Estate Agent",
  "Mortgage Advice": "Mortgage Broker",
  Solicitor: "Solicitor",
  "Property Search": "Property Search",
  Storage: "Storage",
  "Packing Services": "Packing Services",
  "House Clearance": "House Clearance",
  "Utilities Setup": "Utilities Setup",
  "Nothing Else": null,
};

/** Timeline → lead priority. Sooner = hotter. */
export function priorityFromTimeline(timeline) {
  if (timeline === "Immediately" || timeline === "Within 3 Months") return "Hot";
  if (timeline === "Within 6 Months") return "Warm";
  return "Cool"; // 6+ Months, Just Exploring, or unanswered
}

/** Flat record — every key maps 1:1 to an Excel / Power Automate column. */
export function buildWhatsNextRecord({ survey = {}, timestamp }) {
  const nextMoveType = (survey.nextMoveType || "").trim();

  const supportArr = Array.isArray(survey.additionalSupport)
    ? survey.additionalSupport.filter((s) => typeof s === "string" && s.trim())
    : [];

  const storageRequired =
    survey.storageRequired === "Yes" || survey.storageRequired === "No"
      ? survey.storageRequired
      : "";

  const timeline = survey.timeline || "";

  const partnerConsent =
    survey.partnerConsent === "Yes" || survey.partnerConsent === "No"
      ? survey.partnerConsent
      : "";

  // Derive partner opportunity tags: intent base + support selections + storage.
  const tags = new Set(MOVE_TYPE_TAGS[nextMoveType] || []);
  for (const s of supportArr) {
    const t = SUPPORT_TAGS[s];
    if (t) tags.add(t);
  }
  if (storageRequired === "Yes") tags.add("Storage");

  return {
    timestamp,
    type: "whats-next-opportunity",

    nextMoveType,
    targetArea: (survey.targetArea || "").trim(),
    timeline,
    propertySize: survey.propertySize || "",
    budgetRange: survey.budgetRange || "",
    householdType: survey.householdType || "",

    // Conditional extras — empty string when not applicable to the branch.
    investmentType: survey.investmentType || "",
    storageRequired,

    additionalSupport: supportArr.join(", "),
    partnerConsent,

    // Derived qualification (server-authoritative).
    priority: priorityFromTimeline(timeline),
    opportunityTags: [...tags].join(", "),

    source: "whats-next-page",
  };
}

/** Formatted plain-text notification email. */
export function buildWhatsNextEmailText(record) {
  const val = (v) => (v === "" || v == null ? "—" : v);
  const when = (() => {
    try {
      return new Date(record.timestamp).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      });
    } catch {
      return record.timestamp;
    }
  })();

  return [
    `New What's Next opportunity  ·  Priority: ${val(record.priority)}`,
    "",
    `Next Move Type:     ${val(record.nextMoveType)}`,
    `Target Area:        ${val(record.targetArea)}`,
    `Timeline:           ${val(record.timeline)}`,
    `Property Size:      ${val(record.propertySize)}`,
    `Budget Range:       ${val(record.budgetRange)}`,
    `Household Type:     ${val(record.householdType)}`,
    `Investment Type:    ${val(record.investmentType)}`,
    `Storage Required:   ${val(record.storageRequired)}`,
    `Additional Support: ${val(record.additionalSupport)}`,
    `Partner Consent:    ${val(record.partnerConsent)}`,
    "",
    `Opportunity Tags:   ${val(record.opportunityTags)}`,
    `Submission Date:    ${when}`,
  ].join("\n");
}

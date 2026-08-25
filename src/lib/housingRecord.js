/* ---------------------------------------------------------------------------
 * Housing & Property Services enquiry record builders (Phase — Housing).
 * Pure — no framework/network deps.
 *
 * Turns a submitted Housing proposal request into:
 *   - a FLAT record for Power Automate / the future "Housing Enquiries"
 *     Microsoft List / Excel / CRM (one key = one column)
 *   - a formatted plain-text notification email
 *
 * This is a PROPOSAL request line, not a priced quote — there is no pricing
 * anywhere here. Priority is derived server-side from the timescale so the
 * stored value can't be tampered with client-side (mirrors the quote/feedback
 * pipelines). Kept fully separate from those pipelines.
 * ------------------------------------------------------------------------- */

/** Step 1 — service required. */
export const HOUSING_SERVICES = [
  "Tenant Relocation",
  "Emergency Move",
  "Property Clearance",
  "Void Property Support",
  "Storage Coordination",
  "Packing Services",
  "Vulnerable Resident Assistance",
  "Graffiti Removal",
  "Property Logistics",
  "Furniture Removal",
  "Other",
];

/** Step 2 — organisation type. */
export const ORGANISATION_TYPES = [
  "Housing Association",
  "Local Authority",
  "Property Manager",
  "Estate Agent",
  "Letting Agent",
  "Developer",
  "Charity",
  "Other",
];

/** Step 4 — timescale. */
export const HOUSING_TIMESCALES = [
  "Emergency (Within 24 Hours)",
  "Within 7 Days",
  "Within 30 Days",
  "Flexible",
];

/** Step 5 — support requirements (multi-select). */
export const HOUSING_SUPPORT = [
  "Packing",
  "Storage",
  "Clearance",
  "Graffiti Removal",
  "Vulnerable Resident Support",
  "Furniture Handling",
];

/** Commercial qualification — opportunity type. */
export const OPPORTUNITY_TYPES = [
  "Single Job",
  "Ongoing Requirement",
  "Framework Opportunity",
  "Supplier Evaluation",
];

/** Commercial qualification — estimated annual volume. */
export const ANNUAL_VOLUMES = [
  "1-10 Jobs",
  "11-50 Jobs",
  "51-100 Jobs",
  "100+ Jobs",
  "Unsure",
];

const csvList = (v) =>
  Array.isArray(v)
    ? v.join(", ")
    : Object.keys(v || {})
        .filter((k) => v[k])
        .join(", ");

/** Timescale → operational priority. Sooner = higher. */
export function priorityFromTimescale(timescale) {
  if (timescale === "Emergency (Within 24 Hours)") return "Emergency";
  if (timescale === "Within 7 Days") return "High";
  if (timescale === "Within 30 Days") return "Medium";
  return "Low"; // Flexible or unanswered
}

/** Flat record — every key maps 1:1 to a List / Power Automate / Excel column. */
export function buildHousingRecord({ enquiry = {}, timestamp }) {
  const timescale = enquiry.timescale || "";
  return {
    timestamp,
    type: "housing-enquiry",

    organisation: (enquiry.organisation || "").trim(),
    organisationType: enquiry.organisationType || "",
    serviceRequired: enquiry.serviceRequired || "",

    // Commercial qualification (framework / recurring-revenue positioning).
    opportunityType: enquiry.opportunityType || "",
    annualVolume: enquiry.annualVolume || "",

    propertyAddress: (enquiry.address || "").trim(),
    postcode: (enquiry.postcode || "").trim(),
    propertyReference: (enquiry.propertyReference || "").trim(),

    timescale,
    priority: priorityFromTimescale(timescale),
    status: "New",

    supportRequirements: csvList(enquiry.support),
    projectDetails: (enquiry.projectDetails || "").trim(),

    contactName: (enquiry.name || "").trim(),
    email: (enquiry.email || "").trim(),
    phone: (enquiry.phone || "").trim(),

    leadSource: enquiry.leadSource || "",
    referrerName: (enquiry.referrerName || "").trim(),
    leadSourceCode: (enquiry.leadSourceCode || "").trim(),

    source: enquiry.source || "housing-configurator",
  };
}

/**
 * Map a flat record to the exact future "Housing Enquiries" List columns.
 * Keeps the List schema decoupled from the internal record shape.
 */
export function toHousingListItem(record = {}) {
  return {
    Organisation: record.organisation || "",
    OrganisationType: record.organisationType || "",
    ServiceRequired: record.serviceRequired || "",
    PropertyAddress: record.propertyAddress || "",
    Postcode: record.postcode || "",
    Priority: record.priority || "",
    Status: record.status || "New",
    LeadSource: record.leadSource || "",
    ReferrerName: record.referrerName || "",
  };
}

/** Formatted plain-text notification email. */
export function buildHousingEmailText(record) {
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
    `New Housing & Property Services enquiry  ·  Priority: ${val(record.priority)}`,
    "",
    `Organisation:         ${val(record.organisation)}`,
    `Organisation Type:    ${val(record.organisationType)}`,
    `Service Required:     ${val(record.serviceRequired)}`,
    `Opportunity Type:     ${val(record.opportunityType)}`,
    `Annual Volume:        ${val(record.annualVolume)}`,
    "",
    `Property Address:     ${val(record.propertyAddress)}`,
    `Postcode:             ${val(record.postcode)}`,
    `Property Reference:   ${val(record.propertyReference)}`,
    "",
    `Timescale:            ${val(record.timescale)}`,
    `Support Requirements: ${val(record.supportRequirements)}`,
    "",
    "Project Details:",
    val(record.projectDetails),
    "",
    `Contact:              ${val(record.contactName)} · ${val(record.email)} · ${val(record.phone)}`,
    "",
    `Lead Source:          ${val(record.leadSource)}`,
    `Referrer Name:        ${val(record.referrerName)}`,
    `Lead Source Code:     ${val(record.leadSourceCode)}`,
    "",
    `Submission Date:      ${when}`,
  ].join("\n");
}

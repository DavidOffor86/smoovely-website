/* ---------------------------------------------------------------------------
 * Relocation & Mobility enquiry record builders (Phase 1 — relocation).
 * Pure — no framework/network deps.
 *
 * Serves the new International Relocation and Sports Relocation services. Turns
 * a submitted relocation enquiry into a FLAT record for Power Automate / a
 * future "Relocation Enquiries" Microsoft List, plus a notification email.
 *
 * This is an ENQUIRY / proposal request — no pricing (international + sports
 * moves are quoted manually). Kept fully separate from the quote/feedback/
 * housing/operations pipelines so existing journeys are untouched.
 * ------------------------------------------------------------------------- */

/** Move Type — also the two new configurator service options. */
export const RELOCATION_MOVE_TYPES = [
  "International Relocation",
  "Sports Relocation",
];

/** Destination country. */
export const DESTINATION_COUNTRIES = [
  "India",
  "Nigeria",
  "Romania",
  "Portugal",
  "Spain",
  "France",
  "Germany",
  "UAE",
  "Other",
];

/** Relocation category. */
export const RELOCATION_CATEGORIES = [
  "Family Relocation",
  "Executive Relocation",
  "Sports Transfer",
  "Partial Shipment",
  "Full Household Move",
];

/** Additional services (multi-select). */
export const RELOCATION_SERVICES = [
  "Packing",
  "Storage",
  "Destination Delivery",
  "Unpacking",
  "Furniture Assembly",
  "Temporary Storage",
  "Property Setup Support",
];

const csvList = (v) =>
  Array.isArray(v)
    ? v.join(", ")
    : Object.keys(v || {})
        .filter((k) => v[k])
        .join(", ");

/** Flat record — every key maps 1:1 to a List / Power Automate / Excel column. */
export function buildRelocationRecord({ enquiry = {}, timestamp }) {
  return {
    timestamp,
    type: "relocation-enquiry",

    moveType: enquiry.moveType || "",
    destinationCountry: enquiry.destinationCountry || "",
    originPostcode: (enquiry.originPostcode || "").trim(),
    relocationCategory: enquiry.relocationCategory || "",
    additionalServices: csvList(enquiry.services),

    notes: (enquiry.notes || "").trim(),

    name: (enquiry.name || "").trim(),
    email: (enquiry.email || "").trim(),
    phone: (enquiry.phone || "").trim(),

    leadSource: enquiry.leadSource || "",
    referrerName: (enquiry.referrerName || "").trim(),
    leadSourceCode: (enquiry.leadSourceCode || "").trim(),

    source: enquiry.source || "relocation-configurator",
  };
}

/** Map a flat record to a future "Relocation Enquiries" List's columns. */
export function toRelocationListItem(record = {}) {
  return {
    MoveType: record.moveType || "",
    DestinationCountry: record.destinationCountry || "",
    OriginPostcode: record.originPostcode || "",
    RelocationCategory: record.relocationCategory || "",
    AdditionalServices: record.additionalServices || "",
    Notes: record.notes || "",
    Name: record.name || "",
    Email: record.email || "",
    Phone: record.phone || "",
    LeadSource: record.leadSource || "",
    ReferrerName: record.referrerName || "",
  };
}

/** Formatted plain-text notification email. */
export function buildRelocationEmailText(record) {
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
    `New relocation enquiry — ${val(record.moveType)}`,
    "",
    `Move Type:            ${val(record.moveType)}`,
    `Destination Country:  ${val(record.destinationCountry)}`,
    `Origin Postcode:      ${val(record.originPostcode)}`,
    `Relocation Category:  ${val(record.relocationCategory)}`,
    `Additional Services:  ${val(record.additionalServices)}`,
    "",
    "Notes:",
    val(record.notes),
    "",
    `Contact:              ${val(record.name)} · ${val(record.email)} · ${val(record.phone)}`,
    "",
    `Lead Source:          ${val(record.leadSource)}`,
    `Referrer Name:        ${val(record.referrerName)}`,
    `Lead Source Code:     ${val(record.leadSourceCode)}`,
    "",
    `Submission Date:      ${when}`,
  ].join("\n");
}

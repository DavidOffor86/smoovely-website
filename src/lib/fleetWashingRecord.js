/* ---------------------------------------------------------------------------
 * Fleet Washing Services record builders (Partner integration — EcoFleet Wash).
 * Pure — no framework/network deps.
 *
 * Fleet Washing is POWERED BY EcoFleet Wash. Smoovely acts as a marketing and
 * referral partner only. This is an ASSESSMENT request, not a quote: no pricing
 * is computed. The flat record is sent to both EcoFleet Wash and Smoovely.
 * Kept fully separate from quote/pricing pipelines.
 * ------------------------------------------------------------------------- */

/** Vehicle types */
export const VEHICLE_TYPES = [
  "Cars",
  "Small Vans",
  "Large Vans",
  "Luton Vans",
  "HGV Tractor Units",
  "Trailers",
  "Other",
];

/** Vehicle condition — multi-select. */
export const VEHICLE_CONDITIONS = [
  "Light Road Dirt",
  "Moderate Dirt",
  "Heavy Road Grime",
  "Muddy Vehicles",
  "Construction Vehicles",
  "Waste Vehicles",
  "Oil & Grease Contamination",
  "Other",
];

/** Exterior services — multi-select. */
export const EXTERIOR_SERVICES = [
  "Vehicle Body Wash",
  "Windows",
  "Mirrors",
  "Wheels",
  "Tyres",
  "Door Shuts",
];

/** Interior services — multi-select. */
export const INTERIOR_SERVICES = [
  "Vacuum",
  "Dashboard Clean",
  "Interior Wipe Down",
  "Cab Sanitisation",
  "Deep Interior Clean",
];

/** Cleaning frequency — single select. */
export const CLEANING_FREQUENCIES = [
  "Weekly",
  "Fortnightly",
  "Monthly",
  "Quarterly",
  "One-Off Clean",
];

/** Site access location — single select. */
export const SITE_ACCESS_TYPES = [
  "Company Depot",
  "Customer Sites",
  "Driver Homes",
  "Various Locations",
];

/** Site access requirements — multi-select. */
export const SITE_ACCESS_REQUIREMENTS = [
  "Restricted Access",
  "Site Induction Required",
  "PPE Required",
  "Environmental Restrictions",
];

const csvList = (v) =>
  Array.isArray(v)
    ? v.join(", ")
    : Object.keys(v || {})
        .filter((k) => v[k])
        .join(", ");

/** Flat record — every key maps 1:1 to a List / Power Automate / Excel column. */
export function buildFleetWashingRecord({ assessment = {}, timestamp }) {
  const fleetSize = {
    cars: assessment.fleetSize?.cars || 0,
    smallVans: assessment.fleetSize?.smallVans || 0,
    largeVans: assessment.fleetSize?.largeVans || 0,
    lutonVans: assessment.fleetSize?.lutonVans || 0,
    hgvUnits: assessment.fleetSize?.hgvUnits || 0,
    trailers: assessment.fleetSize?.trailers || 0,
    other: assessment.fleetSize?.other || 0,
  };

  const totalFleet =
    Object.values(fleetSize).reduce((a, b) => a + b, 0) || 0;

  return {
    timestamp,
    type: "fleet-washing-assessment",

    company: (assessment.company || "").trim(),
    contactName: (assessment.contactName || "").trim(),
    jobTitle: (assessment.jobTitle || "").trim(),
    email: (assessment.email || "").trim(),
    phone: (assessment.phone || "").trim(),
    siteAddress: (assessment.siteAddress || "").trim(),

    fleetSize: JSON.stringify(fleetSize),
    totalFleetSize: totalFleet,

    vehicleConditions: csvList(assessment.vehicleConditions),

    exteriorServices: csvList(assessment.exteriorServices),
    interiorServices: csvList(assessment.interiorServices),

    cleaningFrequency: assessment.cleaningFrequency || "",
    preferredDays: csvList(assessment.preferredDays),
    preferredTime: (assessment.preferredTime || "").trim(),

    siteAccessType: assessment.siteAccessType || "",
    siteAccessRequirements: csvList(assessment.siteAccessRequirements),

    leadSource: assessment.leadSource || "",
    referrerName: (assessment.referrerName || "").trim(),
    leadSourceCode: (assessment.leadSourceCode || "").trim(),

    source: "fleet-washing-configurator",
  };
}

/** Map to future "Fleet Washing Enquiries" List columns. */
export function toFleetWashingListItem(record = {}) {
  return {
    Company: record.company || "",
    ContactName: record.contactName || "",
    JobTitle: record.jobTitle || "",
    Email: record.email || "",
    Phone: record.phone || "",
    SiteAddress: record.siteAddress || "",
    TotalFleetSize: record.totalFleetSize || "",
    VehicleConditions: record.vehicleConditions || "",
    ExteriorServices: record.exteriorServices || "",
    InteriorServices: record.interiorServices || "",
    CleaningFrequency: record.cleaningFrequency || "",
    PreferredDays: record.preferredDays || "",
    PreferredTime: record.preferredTime || "",
    SiteAccessType: record.siteAccessType || "",
    SiteAccessRequirements: record.siteAccessRequirements || "",
    LeadSource: record.leadSource || "",
  };
}

/** Formatted plain-text notification email. */
export function buildFleetWashingEmailText(record) {
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
    "Fleet Washing Assessment — Powered by EcoFleet Wash",
    "",
    "BUSINESS INFORMATION",
    `Company:              ${val(record.company)}`,
    `Contact Name:        ${val(record.contactName)}`,
    `Job Title:           ${val(record.jobTitle)}`,
    `Email:               ${val(record.email)}`,
    `Phone:               ${val(record.phone)}`,
    `Site Address:        ${val(record.siteAddress)}`,
    "",
    "FLEET INFORMATION",
    `Total Fleet Size:    ${val(record.totalFleetSize)} vehicles`,
    `Fleet Breakdown:     ${val(record.fleetSize)}`,
    `Vehicle Conditions:  ${val(record.vehicleConditions)}`,
    "",
    "SERVICES REQUIRED",
    `Exterior Services:   ${val(record.exteriorServices)}`,
    `Interior Services:   ${val(record.interiorServices)}`,
    "",
    "CLEANING FREQUENCY & SITE REQUIREMENTS",
    `Frequency:           ${val(record.cleaningFrequency)}`,
    `Preferred Days:      ${val(record.preferredDays)}`,
    `Preferred Time:      ${val(record.preferredTime)}`,
    "",
    `Site Access Type:    ${val(record.siteAccessType)}`,
    `Access Requirements: ${val(record.siteAccessRequirements)}`,
    "",
    "LEAD ATTRIBUTION",
    `Lead Source:         ${val(record.leadSource)}`,
    `Referrer Name:       ${val(record.referrerName)}`,
    `Lead Source Code:    ${val(record.leadSourceCode)}`,
    "",
    "---",
    "This assessment has been submitted by Smoovely.",
    "EcoFleet Wash will contact the business directly with a tailored quotation.",
    `Submission Date:     ${when}`,
  ].join("\n");
}

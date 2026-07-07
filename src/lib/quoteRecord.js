/* ---------------------------------------------------------------------------
 * Quote record builders (pure — no framework/network deps, unit-testable).
 *
 * Turns a server-computed quote + submitted form into:
 *   - a FLAT record for Excel/Power Automate (one key = one column)
 *   - a nested leadSummary for CRM reporting
 *   - a formatted notification email
 * ------------------------------------------------------------------------- */

import { summariseInventory } from "./homeInventory.js";

const gbp = (n) => (n === "" || n == null ? "—" : `£${Number(n).toLocaleString()}`);
const csvList = (v) =>
  Array.isArray(v) ? v.join(", ") : Object.keys(v || {}).filter((k) => v[k]).join(", ");

/** Structured lead metadata for CRM reporting. */
export function buildLeadSummary(service, details = {}, quote = {}) {
  return {
    service,
    distanceMiles: quote.distanceMiles ?? null,
    vehicleRecommendation: quote.vehicleRecommendation ?? null,
    crewRecommendation: quote.crewRecommendation ?? null,
    propertyType: details.propertyType || "",
    customerBudget: details.customerBudget || "",
    moveDate: details.moveDate || "",
    complexityScore: quote.complexityScore ?? 0,
  };
}

/** Flat record — every key maps 1:1 to an Excel / Power Automate column. */
export function buildQuoteRecord({ service, contact = {}, details = {}, quote = {}, timestamp }) {
  const range =
    quote.low != null && quote.high != null
      ? `£${quote.low.toLocaleString()}–£${quote.high.toLocaleString()}`
      : "";
  return {
    timestamp,
    service,
    name: contact.name || "",
    email: contact.email || "",
    phone: contact.phone || "",

    estimate: quote.estimate ?? "",
    estimateLow: quote.low ?? "",
    estimateHigh: quote.high ?? "",
    estimateRange: range,
    currency: "GBP",

    serviceComponent: quote.serviceComponent ?? "",
    travelComponent: quote.travelComponent ?? "",
    packingComponent: quote.packingComponent ?? "",
    complexityComponent: quote.complexityComponent ?? "",
    complexityScore: quote.complexityScore ?? "",
    distanceMiles: quote.distanceMiles ?? "",
    vehicleRecommendation: quote.vehicleRecommendation ?? "",
    crewRecommendation: quote.crewRecommendation ?? "",
    pricingVersion: quote.pricingVersion ?? "",
    customQuoteRequired: quote.customQuoteRequired ?? false,

    propertyType: details.propertyType || "",
    moveDate: details.moveDate || "",
    moveFlexibility: details.moveFlexibility || "",
    customerBudget: details.customerBudget || "",
    highValue: details.highValue || "",
    fragileLevel: details.fragileLevel || "",
    packingRequirements: csvList(details.packing),
    specialHandling: csvList(details.specialHandling),
    pickupFloor: details.pickup?.floor || "",
    deliveryFloor: details.dropoff?.floor || "",

    inventorySummary: summariseInventory(details),
    source: details.source || "quote-configurator",
  };
}

/** Formatted plain-text notification email (matches the spec layout). */
export function buildQuoteEmailText(record) {
  const dist =
    record.distanceMiles === "" || record.distanceMiles == null
      ? "Local / included"
      : `${record.distanceMiles} miles`;

  const parts = [];
  if (record.customQuoteRequired) {
    parts.push("⚠ CUSTOM QUOTE REQUIRED — team to confirm a tailored price\n");
  }
  parts.push(`Service:\n${record.service}\n`);
  if (record.propertyType) parts.push(`Property Type:\n${record.propertyType}\n`);
  parts.push(`Distance:\n${dist}\n`);
  parts.push(`Vehicle:\n${record.vehicleRecommendation || "—"}\n`);
  parts.push(`Crew:\n${record.crewRecommendation || "—"}\n`);
  parts.push(
    `Breakdown:\n\n` +
      `Service Component:\n${gbp(record.serviceComponent)}\n\n` +
      `Travel Component:\n${gbp(record.travelComponent)}\n\n` +
      `Packing Component:\n${gbp(record.packingComponent)}\n\n` +
      `Complexity Component:\n${gbp(record.complexityComponent)}\n`
  );
  parts.push(`Estimated Quote:\n${record.estimateRange || gbp(record.estimate)}\n`);
  parts.push(`Contact:\n${record.name} · ${record.email} · ${record.phone}\n`);
  if (record.moveDate || record.moveFlexibility) {
    parts.push(`Move Date:\n${record.moveDate || "Flexible"} (${record.moveFlexibility || "Flexible"})\n`);
  }
  if (record.customerBudget) parts.push(`Budget:\n${record.customerBudget}\n`);
  if (record.pricingVersion) parts.push(`Pricing Version:\n${record.pricingVersion}\n`);
  if (record.inventorySummary) parts.push(`Inventory Summary:\n${record.inventorySummary}\n`);

  return parts.join("\n");
}

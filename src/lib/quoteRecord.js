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

// Format special items array to readable CSV string
const formatSpecialItems = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return "";
  return items
    .map((item) => {
      let desc = item.description || "Unknown";
      if (item.quantity && item.quantity > 1) desc += ` (qty ${item.quantity})`;
      const flags = [];
      if (item.isHeavy === "Yes") flags.push("heavy");
      if (item.requiresDismantling === "Yes") flags.push("dismantling");
      if (item.requiresReassembly === "Yes") flags.push("reassembly");
      if (flags.length) desc += ` [${flags.join(", ")}]`;
      return desc;
    })
    .join(" · ");
};

// Format dismantling items object to readable CSV string
const formatDismantlingItems = (items = {}) => {
  if (!items || Object.keys(items).length === 0) return "";
  return Object.entries(items)
    .filter(([_, v]) => v && v.qty > 0)
    .map(([key, v]) => {
      const qty = v.qty || v.quantity || 0;
      const reassembly = v.reassemblyRequired === "Yes" ? ", reassembly: Yes" : "";
      return `${key} (qty ${qty}${reassembly})`;
    })
    .join(" · ");
};

// Format photo array to URLs string
const formatPhotoUrls = (photos = []) => {
  if (!Array.isArray(photos) || photos.length === 0) return "";
  return photos.map((p) => p.url).join(" ");
};

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
export function buildQuoteRecord({ service, contact = {}, details = {}, quote = {}, timestamp, quoteVersion }) {
  const range =
    quote.low != null && quote.high != null
      ? `£${quote.low.toLocaleString()}–£${quote.high.toLocaleString()}`
      : "";
  return {
    timestamp,
    service,
    quoteVersion: quoteVersion ?? details.quoteVersion ?? 1,
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

    // Location postcodes — already captured by the configurators and sent in
    // `details`; surfaced here so they appear in the flat record, Power Automate
    // columns and the notification email. No new form fields are introduced.
    pickupPostcode: details.pickupPostcode || "",
    destPostcode: details.destPostcode || "",
    deliveryPostcode: details.deliveryPostcode || "",
    collectionPostcode: details.postcode || "",
    returnPostcode: details.returnPostcode || "",

    inventorySummary: summariseInventory(details),

    // Special/Oversized items (both Home Removals and Office Moves)
    specialItems: formatSpecialItems(details.specialItems),
    specialItemsCount: Array.isArray(details.specialItems) ? details.specialItems.length : 0,
    specialItemsJson: Array.isArray(details.specialItems)
      ? JSON.stringify(details.specialItems)
      : "",

    // Dismantling & Reassembly (both services)
    dismantlingItems: formatDismantlingItems(details.dismantling),
    dismantlingCount: details.dismantling
      ? Object.values(details.dismantling)
          .filter((v) => v && v.qty > 0)
          .reduce((sum, v) => sum + (v.qty || v.quantity || 0), 0)
      : 0,

    // Furniture & Technology inventory (Office Moves only)
    furnitureInventory: formatSpecialItems(
      Object.entries(details.furnitureInventory || {})
        .map(([key, qty]) => ({ description: key, quantity: qty }))
    ),
    technologyInventory: formatSpecialItems(
      Object.entries(details.technologyInventory || {})
        .map(([key, qty]) => ({ description: key, quantity: qty }))
    ),

    // Photos (both services)
    propertyPhotosCount:
      Array.isArray(details.propertyPhotos) ? details.propertyPhotos.length : 0,
    propertyPhotoUrls: formatPhotoUrls(details.propertyPhotos),
    officePhotosCount:
      Array.isArray(details.officePhotos) ? details.officePhotos.length : 0,
    officePhotoUrls: formatPhotoUrls(details.officePhotos),

    // Proposal notes (both services)
    proposalNotes: (details.proposalNotes || "").trim(),

    // Lead attribution (applies to every configurator). Captured after contact
    // details, before the review summary. leadSourceCode carries any ?ref= code.
    leadSource: details.leadSource || "",
    referrerName: (details.referrerName || "").trim(),
    leadSourceCode: (details.leadSourceCode || "").trim(),

    source: details.source || "quote-configurator",
  };
}

/** Formatted operational proposal briefing email. */
export function buildQuoteEmailText(record) {
  const section = (title) => `\n${"=".repeat(60)}\n${title}\n${"=".repeat(60)}\n`;
  const field = (label, value) =>
    `${label}: ${value || "None"}\n`;

  const dist =
    record.distanceMiles === "" || record.distanceMiles == null
      ? "Local / included"
      : `${record.distanceMiles} miles`;

  let email = `OPERATIONAL PROPOSAL BRIEFING\n`;
  email += `Service: ${record.service}\n`;
  email += `Quote Version: ${record.quoteVersion || 1}\n`;
  if (record.customQuoteRequired) {
    email += `⚠ CUSTOM QUOTE REQUIRED — team to confirm tailored price\n`;
  }
  email += "\n";

  // 1. Quote Overview
  email += section("1. QUOTE OVERVIEW");
  email += field("Estimated Quote", record.estimateRange || gbp(record.estimate));
  email += field("Quote Reference", record.timestamp);
  email += field("Pricing Version", record.pricingVersion || "Standard");

  // 2. Customer Information
  email += section("2. CUSTOMER INFORMATION");
  email += field("Contact Name", record.name);
  email += field("Email Address", record.email);
  email += field("Phone Number", record.phone);
  if (record.service === "Office Moves") {
    email += field("Business Name", "");
  }

  // 3. Journey Information
  email += section("3. JOURNEY INFORMATION");
  if (record.propertyType) {
    email += field("Property Type", record.propertyType);
  }
  email += field("Pickup Postcode", record.pickupPostcode || record.collectionPostcode || "");
  email += field(
    "Destination Postcode",
    record.destPostcode || record.deliveryPostcode || ""
  );
  email += field("Distance", dist);
  email += field("Move Date", record.moveDate || "Flexible");
  email += field("Move Flexibility", record.moveFlexibility || "Flexible");
  if (record.pickupFloor || record.deliveryFloor) {
    email += field(
      "Pickup Access",
      record.pickupFloor ? `Floor: ${record.pickupFloor}` : ""
    );
    email += field(
      "Delivery Access",
      record.deliveryFloor ? `Floor: ${record.deliveryFloor}` : ""
    );
  }

  // 4. Furniture Inventory (Office Moves only)
  if (record.furnitureInventory) {
    email += section("4. FURNITURE INVENTORY");
    email += `${record.furnitureInventory || "None"}\n`;
  }

  // 5. Technology Inventory (Office Moves only)
  if (record.technologyInventory) {
    email += section("5. TECHNOLOGY INVENTORY");
    email += `${record.technologyInventory || "None"}\n`;
  }

  // 6. Special Items
  email += section("6. SPECIAL/OVERSIZED ITEMS");
  if (record.specialItems) {
    email += `${record.specialItems}\n`;
  } else {
    email += "None\n";
  }

  // 7. Dismantling & Reassembly
  email += section("7. DISMANTLING & REASSEMBLY");
  if (record.dismantlingItems) {
    email += `${record.dismantlingItems}\n`;
  } else {
    email += "None\n";
  }

  // 8. Survey Photos
  email += section("8. SURVEY PHOTOS");
  if (record.propertyPhotosCount) {
    email += field("Property Photos Uploaded", `${record.propertyPhotosCount}/10`);
    if (record.propertyPhotoUrls) {
      const photos = record.propertyPhotoUrls.split(" ");
      photos.forEach((photo, idx) => {
        if (photo) email += `  Photo ${idx + 1}: ${photo}\n`;
      });
    }
  } else if (record.officePhotosCount) {
    email += field("Office Photos Uploaded", `${record.officePhotosCount}/10`);
    if (record.officePhotoUrls) {
      const photos = record.officePhotoUrls.split(" ");
      photos.forEach((photo, idx) => {
        if (photo) email += `  Photo ${idx + 1}: ${photo}\n`;
      });
    }
  } else {
    email += "None\n";
  }

  // 9. Proposal Notes
  email += section("9. PROPOSAL NOTES");
  email += `${record.proposalNotes || "None"}\n`;

  // 10. Pricing Summary
  email += section("10. PRICING SUMMARY");
  email += field("Service Component", gbp(record.serviceComponent));
  email += field("Travel Component", gbp(record.travelComponent));
  if (record.packingComponent) {
    email += field("Packing Component", gbp(record.packingComponent));
  }
  if (record.complexityComponent) {
    email += field("Complexity Component", gbp(record.complexityComponent));
  }
  email += field("Vehicle Recommendation", record.vehicleRecommendation || "—");
  email += field("Crew Recommendation", record.crewRecommendation || "—");
  email += field("Estimated Quote", record.estimateRange || gbp(record.estimate));
  email += field("Customer Budget", record.customerBudget || "Not specified");

  // Additional metadata
  email += section("REFERENCE INFORMATION");
  email += field("Lead Source", record.leadSource || "Direct");
  if (record.referrerName) {
    email += field("Referrer Name", record.referrerName);
  }
  if (record.leadSourceCode) {
    email += field("Lead Source Code", record.leadSourceCode);
  }
  email += field("Submission Time", record.timestamp);

  email += "\n" + "=".repeat(60) + "\n";
  email += "This proposal briefing was auto-generated from the quote configurator.\n";
  email += "Review and confirm all details before proceeding with the survey.\n";

  return email;
}

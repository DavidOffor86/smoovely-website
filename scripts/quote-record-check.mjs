/* ---------------------------------------------------------------------------
 * Phase 3 — quote record / summary / email / lead builders.
 *   node scripts/quote-record-check.mjs
 * ------------------------------------------------------------------------- */
import { priceQuote } from "../src/lib/pricing.server.js";
import { summariseInventory } from "../src/lib/homeInventory.js";
import { buildQuoteRecord, buildLeadSummary, buildQuoteEmailText } from "../src/lib/quoteRecord.js";

let failures = 0;
const ok = (label, cond) => {
  if (!cond) failures++;
  console.log(`${cond ? "✅" : "❌"} ${label}`);
};

const details = {
  propertyType: "2 Bedroom Property",
  rooms: {
    bedroom: { bed: 2, wardrobe: 1 },
    livingRoom: { sofa3: 1, tv: 1 },
    kitchen: { fridgeFreezer: 1, washingMachine: 1 },
  },
  boxes: 20,
  bags: 6,
  suitcases: 3,
  highValue: "Low",
  fragileLevel: "Some Fragile",
  packing: { Boxes: true, "Bubble Wrap": true },
  specialHandling: { Piano: true, Other: true },
  specialHandlingOther: "Pool table",
  pickup: { parking: "Paid", floor: "2nd" },
  dropoff: { parking: "Free", floor: "Ground" },
  moveDate: "2026-08-01",
  moveFlexibility: "+/- 3 Days",
  customerBudget: "£1000-£2000",
};

// No postcodes → travel 0, no network needed.
const quote = await priceQuote("Home Removals", details);
const record = buildQuoteRecord({
  service: "Home Removals",
  contact: { name: "Jane Doe", email: "jane@example.com", phone: "07000000000" },
  details,
  quote,
  timestamp: "2026-08-01T10:00:00.000Z",
});
const lead = buildLeadSummary("Home Removals", details, quote);

console.log("\n--- INVENTORY SUMMARY ---\n" + summariseInventory(details));
console.log("\n--- EMAIL ---\n" + buildQuoteEmailText(record));
console.log("\n--- LEAD SUMMARY ---\n" + JSON.stringify(lead, null, 2));
console.log("\n--- RECORD KEYS ---\n" + Object.keys(record).join(", ") + "\n");

// Assertions
ok("inventory has Bedroom block", summariseInventory(details).includes("Bedroom:"));
ok("inventory pluralises '2 Beds'", summariseInventory(details).includes("2 Beds"));
ok("inventory lists Boxes: 20", summariseInventory(details).includes("Boxes: 20"));
ok("inventory lists special handling", summariseInventory(details).includes("Piano"));
ok("record.propertyType persisted", record.propertyType === "2 Bedroom Property");
ok("email shows Property Type", buildQuoteEmailText(record).includes("Property Type:"));
ok("record.pricingVersion set", record.pricingVersion === "2.0.0-server");
ok("record.packingRequirements string", record.packingRequirements === "Boxes, Bubble Wrap");
ok("record.specialHandling string", record.specialHandling === "Piano, Other");
ok("record.pickupFloor", record.pickupFloor === "2nd");
ok("record.deliveryFloor", record.deliveryFloor === "Ground");
ok("record.vehicle tail lift (Piano)", record.vehicleRecommendation === "Luton Tail Lift");
ok("record.customQuoteRequired boolean", typeof record.customQuoteRequired === "boolean");
ok("record.estimateRange formatted", /£[\d,]+–£[\d,]+/.test(record.estimateRange));
ok("email shows Breakdown", buildQuoteEmailText(record).includes("Breakdown:"));
ok("email shows Vehicle", buildQuoteEmailText(record).includes("Vehicle:"));
ok("lead has complexityScore", typeof lead.complexityScore === "number");

// Other services still produce a clean record (no Home-only fields).
const office = await priceQuote("Office Moves", { officeSize: "Medium Office", desks: 10 });
const officeRec = buildQuoteRecord({
  service: "Office Moves",
  contact: { name: "Acme", email: "ops@acme.com", phone: "" },
  details: { officeSize: "Medium Office", desks: 10 },
  quote: office,
  timestamp: "2026-08-01T10:00:00.000Z",
});
ok("office record has pricingVersion", officeRec.pricingVersion === "2.0.0-server");
ok("office vehicle empty (n/a)", officeRec.vehicleRecommendation === "");
ok("office inventorySummary empty", officeRec.inventorySummary === "");

console.log(failures === 0 ? "\nQUOTE RECORD OK." : `\nQUOTE RECORD FAILED (${failures}).`);
process.exit(failures === 0 ? 0 : 1);

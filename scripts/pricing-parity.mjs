/* ---------------------------------------------------------------------------
 * Pricing migration parity harness.
 *
 * Compares the server engine's serviceComponent() against reference copies of
 * the ORIGINAL Version 1 flow formulas (transcribed verbatim below) across
 * thousands of randomised inputs. If this is green, the server port preserves
 * existing quote outputs — the gate before switching any flow over.
 *
 *   node scripts/pricing-parity.mjs
 * ------------------------------------------------------------------------- */
import { serviceComponent, travelComponent, CONFIG } from "../src/lib/pricing.server.js";

// Home Removals now uses the v2 room model live; pin to the legacy model here
// so this harness keeps guarding that the Version 1 port is intact (rollback).
CONFIG.homeModel = "legacy";

/* ---- Reference formulas (copied from the flow components, pre-migration) ---- */

function refHome(f) {
  let price = 180;
  const propertyAdd = { "1 Bedroom Flat": 0, "2 Bedroom Property": 120, "3 Bedroom Property": 240, "4+ Bedroom Property": 400 };
  price += propertyAdd[f.property] || 0;
  const loadOptions = [{ id: "Small Load", value: 0 }, { id: "Medium Load", value: 70 }, { id: "Large Load", value: 140 }, { id: "Full Load", value: 230 }];
  price += loadOptions.find((l) => l.id === f.load)?.value || 0;
  price += Object.values(f.items || {}).filter(Boolean).length * 18;
  price += Number(f.boxes || 0) * 3;
  if (f.fragile === "Yes") price += 40;
  [f.pickup, f.dropoff].forEach((a) => {
    a = a || {};
    if (a.parking === "Paid") price += 20;
    if (a.parking === "No Parking") price += 45;
    if (a.stairs === "Yes") price += a.lift === "Yes" ? 20 : 90;
  });
  const extras = [{ key: "packing", price: 150 }, { key: "dismantling", price: 90 }, { key: "extraCare", price: 60 }];
  extras.forEach((e) => f[e.key] && (price += e.price));
  return price;
}

function refOffice(f) {
  let price = 280;
  const officeSizes = [{ id: "Small Office", add: 0 }, { id: "Medium Office", add: 180 }, { id: "Large Office", add: 400 }, { id: "Multi-Site / Phased Move", add: 650 }];
  price += officeSizes.find((o) => o.id === f.officeSize)?.add || 0;
  price += Number(f.desks || 0) * 10;
  price += Number(f.boxes || 0) * 2.5;
  price += Object.values(f.inventory || {}).filter(Boolean).length * 25;
  [f.pickup, f.dropoff].forEach((a) => {
    a = a || {};
    if (a.parking === "Paid") price += 20;
    if (a.parking === "No Parking") price += 45;
    if (a.stairs === "Yes") price += a.lift === "Yes" ? 25 : 120;
  });
  if (f.movingIT === "Yes") price += 120;
  if (f.servers === "Yes") price += 150;
  if (f.packing === "Yes") price += 200;
  if (f.dismantling === "Yes") price += 120;
  if (f.outOfHours === "Yes") price += f.oohWindow === "Weekend" ? 220 : 110;
  if (f.phased === "Yes") price += Number(f.phases || 2) * 60;
  if (f.multiFloor === "Yes") price += Number(f.floors || 3) * 40;
  if (f.phasedMove === "Yes") price += Number(f.phaseCount || 2) * 60 + Number(f.phaseDays || 0) * 80;
  if (f.multiSite === "Yes") price += Number(f.siteCount || 2) * 120;
  if (f.projectMgmt === "Yes") price += 350;
  if (f.onSiteCoord === "Yes") price += 150;
  if (f.tightTimeline === "Yes") price += 120;
  if (f.sensitiveAreas === "Yes") price += 90;
  price += Object.values(f.factors || {}).filter(Boolean).length * 35;
  return Math.round(price);
}

function refB2B(f) {
  let price = 120;
  const vehicleSizes = ["Small Van", "Medium Van", "Luton Van", "7.5T Truck"];
  price += vehicleSizes.indexOf(f.vehicleSize) * 55;
  if (f.loadKind === "Palletised") {
    price += Number(f.pallets || 0) * 22;
    if (f.stackable === "No") price += Number(f.pallets || 0) * 10;
  }
  if (f.loadKind === "Loose") price += { Small: 25, Medium: 55, Large: 95 }[f.looseSize] || 0;
  if (f.vehicleDistance === "Medium") price += 30;
  if (f.vehicleDistance === "Long") price += 75;
  if (f.parking === "Paid") price += 15;
  if (f.parking === "Restricted") price += 35;
  if (f.siteType === "Commercial" && f.loadingBay === "No") price += 25;
  if (f.siteType === "Residential" && f.stairs === "Yes") price += f.lift === "Yes" ? 20 : 60;
  price += { Standard: 0, Premium: 45, "White-glove": 110 }[f.serviceLevel] || 0;
  price += { Scheduled: 0, "Same-day": 90, "Dedicated express": 180 }[f.urgency] || 0;
  if (f.goods?.highValue) price += 60;
  if (f.goods?.fragile) price += 30;
  price += Object.values(f.factors || {}).filter(Boolean).length * 30;
  return price;
}

function refClear(f) {
  let price = 90;
  const propertySizes = ["Single room", "1 bed property", "2 bed property", "3 bed property", "4+ property", "Full site clearance"];
  const loadSizes = ["¼ load", "½ load", "1 full van", "2+ loads", "Multiple truck loads"];
  price += (propertySizes.indexOf(f.propertySize) + 1) * 45;
  price += (loadSizes.indexOf(f.loadSize) + 1) * 40;
  price += Object.values(f.content || {}).filter(Boolean).length * 14;
  price += Object.values(f.special || {}).filter(Boolean).length * 30;
  price += Object.values(f.siteWaste || {}).filter(Boolean).length * 25;
  if (f.parking === "Paid") price += 15;
  if (f.parking === "No Parking") price += 35;
  if (f.distance === "Medium") price += 20;
  if (f.distance === "Long") price += 45;
  if (f.stairs === "Yes") price += f.lift === "Yes" ? 20 : 70;
  const access = f.access || {};
  if (access.narrow) price += 30;
  if (access.restricted) price += 40;
  if (access.permit) price += 60;
  price += { "Clean / organised": 0, "General clutter": 25, "Heavy clutter": 60, "Waste piled": 85, "Overgrown / neglected": 70 }[f.condition] || 0;
  if (f.skip === "Yes") price += 140;
  price += Object.values(f.services || {}).filter(Boolean).length * 35;
  price += Object.values(f.complexity || {}).filter(Boolean).length * 45;
  price += { Standard: 0, "Next day": 60, "Same day": 130 }[f.urgency] || 0;
  return price;
}

function refStorage(f) {
  let price = 70;
  const storageSizes = [{ id: "Small Storage" }, { id: "Medium Storage" }, { id: "Large Storage" }, { id: "XL Storage" }];
  const vanLoads = ["¼ Van", "½ Van", "1 Luton Van", "2+ Loads"];
  price += (storageSizes.findIndex((s) => s.id === f.size) + 1) * 45;
  price += (vanLoads.indexOf(f.vanLoad) + 1) * 25;
  price += { "< 1 month": 0, "1–3 months": 70, "3–6 months": 150, "6+ months": 260 }[f.duration] || 0;
  if (Object.values(f.packing || {}).some(Boolean)) price += 80;
  price += Object.values(f.special || {}).filter(Boolean).length * 30;
  if (f.dismantling === "Yes") price += 60;
  if (f.reassembly === "Yes") price += 60;
  const showAccess = ["Collection + Storage", "Storage as part of Move", "Storage as part of Clearance"].includes(f.serviceType);
  if (showAccess) {
    price += 90;
    if (f.parking === "Paid") price += 15;
    if (f.parking === "No Parking") price += 35;
    if (f.distance === "Medium") price += 20;
    if (f.distance === "Long") price += 45;
    if (f.stairs === "Yes") price += 25;
    if (f.lift === "No" && f.floor && !/ground/i.test(f.floor)) price += 40;
  }
  if (f.climate === "Yes") price += 50;
  if (f.storagePlace === "Container") price += 30;
  if (f.pallet === "Yes") price += 45;
  if (f.accessNeeded === "Yes") price += { Rare: 15, Occasional: 30, Frequent: 60 }[f.accessFreq] || 20;
  if (f.returnDelivery === "Yes") price += 90;
  price += Object.values(f.complexity || {}).filter(Boolean).length * 50;
  return price;
}

/* ---- Randomised input generators ---- */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const yn = () => pick(["Yes", "No"]);
const qty = () => Math.floor(Math.random() * 30);
const flags = (keys) => Object.fromEntries(keys.map((k) => [k, Math.random() < 0.5]));
const access = () => ({ parking: pick(["Free", "Paid", "No Parking", ""]), stairs: yn(), lift: yn() });

function genHome() {
  return {
    property: pick(["1 Bedroom Flat", "2 Bedroom Property", "3 Bedroom Property", "4+ Bedroom Property", ""]),
    load: pick(["Small Load", "Medium Load", "Large Load", "Full Load", ""]),
    items: flags(["sofa", "fridge", "freezer", "washing", "beds", "wardrobes", "dining"]),
    boxes: qty(),
    fragile: yn(),
    pickup: access(),
    dropoff: access(),
    packing: Math.random() < 0.5,
    dismantling: Math.random() < 0.5,
    extraCare: Math.random() < 0.5,
  };
}
function genOffice() {
  return {
    officeSize: pick(["Small Office", "Medium Office", "Large Office", "Multi-Site / Phased Move", ""]),
    desks: qty(), boxes: qty(),
    inventory: flags(["desks", "chairs", "filing", "it", "servers", "printers"]),
    pickup: { parking: pick(["Free", "Paid", "No Parking"]), lift: yn(), stairs: yn() },
    dropoff: { parking: pick(["Free", "Paid", "No Parking"]), lift: yn(), stairs: yn() },
    movingIT: yn(), servers: yn(), packing: yn(), dismantling: yn(),
    outOfHours: yn(), oohWindow: pick(["Evenings", "Weekend"]),
    phased: yn(), phases: qty(),
    multiFloor: yn(), floors: qty(), phasedMove: yn(), phaseCount: qty(), phaseDays: qty(),
    multiSite: yn(), siteCount: qty(), projectMgmt: yn(), onSiteCoord: yn(),
    tightTimeline: yn(), sensitiveAreas: yn(),
    factors: flags(["longWalk", "restrictedLoading", "buildingMgmt", "liftBooking", "ooh", "heavyIT", "meetingRooms", "partition"]),
  };
}
function genB2B() {
  return {
    vehicleSize: pick(["Small Van", "Medium Van", "Luton Van", "7.5T Truck", ""]),
    loadKind: pick(["Palletised", "Loose"]), pallets: qty(), stackable: yn(),
    looseSize: pick(["Small", "Medium", "Large"]),
    vehicleDistance: pick(["Short", "Medium", "Long"]),
    parking: pick(["Free", "Paid", "Restricted"]),
    siteType: pick(["Commercial", "Residential", "Construction Site"]),
    loadingBay: yn(), stairs: yn(), lift: yn(),
    serviceLevel: pick(["Standard", "Premium", "White-glove"]),
    urgency: pick(["Scheduled", "Same-day", "Dedicated express"]),
    goods: flags(["standard", "fragile", "highValue", "medical", "hazardous"]),
    factors: flags(["multiStops", "returnJourney", "waiting", "restrictedWindows", "liftBooking", "nightDelivery", "congestion"]),
  };
}
function genClear() {
  return {
    propertySize: pick(["Single room", "1 bed property", "2 bed property", "3 bed property", "4+ property", "Full site clearance", ""]),
    loadSize: pick(["¼ load", "½ load", "1 full van", "2+ loads", "Multiple truck loads", ""]),
    content: flags(["household", "furniture", "whiteGoods", "garden", "construction", "office", "mixed"]),
    special: flags(["heavy", "fridges", "mattresses", "electrical", "hazardous"]),
    siteWaste: flags(["rubble", "soil", "wood", "metal", "mixedSite"]),
    parking: pick(["Free", "Paid", "No Parking"]),
    distance: pick(["Short", "Medium", "Long"]),
    stairs: yn(), lift: yn(),
    access: flags(["narrow", "restricted", "permit"]),
    condition: pick(["Clean / organised", "General clutter", "Heavy clutter", "Waste piled", "Overgrown / neglected", ""]),
    skip: yn(),
    services: flags(["dismantling", "sorting", "deepClean", "gardenCutting", "sitePrep"]),
    complexity: flags(["multiArea", "multiProperty", "projectManaged", "supervision", "restrictedHours"]),
    urgency: pick(["Standard", "Next day", "Same day"]),
  };
}
function genStorage() {
  return {
    size: pick(["Small Storage", "Medium Storage", "Large Storage", "XL Storage", ""]),
    vanLoad: pick(["¼ Van", "½ Van", "1 Luton Van", "2+ Loads", ""]),
    duration: pick(["< 1 month", "1–3 months", "3–6 months", "6+ months", ""]),
    packing: flags(["packing", "wrapping", "fragilePacking", "materials"]),
    special: flags(["fragile", "highValue", "antiques", "electronics"]),
    dismantling: yn(), reassembly: yn(),
    serviceType: pick(["Storage Only", "Collection + Storage", "Storage as part of Move", "Storage as part of Clearance", ""]),
    parking: pick(["Free", "Paid", "No Parking"]),
    distance: pick(["Short", "Medium", "Long"]),
    floor: pick(["Ground", "1st", "2nd", "3rd"]), lift: yn(), stairs: yn(),
    climate: yn(), storagePlace: pick(["Indoor", "Container"]), pallet: yn(),
    accessNeeded: yn(), accessFreq: pick(["Rare", "Occasional", "Frequent"]),
    returnDelivery: yn(),
    complexity: flags(["multiLocation", "businessContract", "projectManaged"]),
  };
}

/* ---- Runner ---- */

const suites = [
  ["Home Removals", genHome, refHome],
  ["Office Moves", genOffice, refOffice],
  ["B2B Delivery & Logistics", genB2B, refB2B],
  ["Clearance & Disposal", genClear, refClear],
  ["Storage Solutions", genStorage, refStorage],
];

const N = 5000;
let failures = 0;

for (const [service, gen, ref] of suites) {
  let mismatch = null;
  for (let i = 0; i < N; i++) {
    const f = gen();
    const expected = ref(f);
    const actual = serviceComponent(service, f);
    if (expected !== actual) {
      mismatch = { f, expected, actual };
      break;
    }
  }
  if (mismatch) {
    failures++;
    console.log(`❌ ${service}: expected ${mismatch.expected}, got ${mismatch.actual}`);
    console.log("   input:", JSON.stringify(mismatch.f));
  } else {
    console.log(`✅ ${service}: ${N} random cases match`);
  }
}

// Travel band spot-checks (pure) — mirrors the Version 1 expectations.
const travelCases = [
  [10, 2.75, 0],
  [40, 2.75, Math.round(25 * 2.75)],
  [200, 2.75, Math.round(35 * 2.75 + 100 * 2.75 * 0.9 + 50 * 2.75 * 0.8)],
  [350, 2.75, Math.round(35 * 2.75 + 100 * 2.75 * 0.9 + 150 * 2.75 * 0.8 + 50 * 2.75 * 0.8) + 150],
];
for (const [miles, rate, expected] of travelCases) {
  const actual = travelComponent(miles, rate);
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "✅" : "❌"} travel ${miles}mi @£${rate} => £${actual} (expected £${expected})`);
}

console.log(failures === 0 ? "\nPARITY OK — safe to migrate flows." : `\nPARITY FAILED (${failures}).`);
process.exit(failures === 0 ? 0 : 1);

/* ---------------------------------------------------------------------------
 * SERVER-AUTHORITATIVE pricing engine (Phase 1 — migration).
 *
 * This module must NEVER be imported by a "use client" component. All business
 * constants and pricing logic live here so they are never shipped to the
 * browser. The only client-safe pricing helpers (priceRange/formatRange —
 * presentation maths, not business rules) remain in ./pricing.
 *
 * Phase 1 goal: byte-for-byte preservation of the Version 1 quote outputs, now
 * computed server-side. Each service's logic is a faithful port of the flow's
 * former client-side calculatePrice(). Packing/complexity/vehicle/crew line
 * items are introduced in Phase 2 (Home Removals enhancement) and reported as
 * 0 / null here so existing numbers are unchanged.
 * ------------------------------------------------------------------------- */

import { priceRange } from "./pricing.js";

/* =========================================================================
 * CONFIGURATION — the single source of truth for every pricing constant.
 * No business number should live anywhere else.
 * ========================================================================= */
export const CONFIG = {
  version: "2.0.0-server",

  // Distance / travel
  roadFactor: 1.3, // straight-line → real driving correction
  freeRadiusMiles: 15, // 0–15 mi folded into the service base
  overnightCharge: 150, // flat add for 300+ mi
  distanceBands: [
    { upTo: 50, mult: 1.0 }, // 16–50
    { upTo: 150, mult: 0.9 }, // 51–150
    { upTo: 300, mult: 0.8 }, // 151–300
    { upTo: Infinity, mult: 0.8 }, // 300+ (plus overnight)
  ],
  travelRates: {
    "Home Removals": 2.75,
    "Office Moves": 3.8,
    "B2B Delivery & Logistics": 1.8,
    "Clearance & Disposal": 2.9,
    "Storage Solutions": 2.2,
  },
  defaultTravelRate: 2.5,

  // Which form fields hold the pickup / destination postcode per service.
  // Single-postcode services (Clearance, Storage) have no dest → travel = 0.
  postcodeFields: {
    "Home Removals": { pickup: "pickupPostcode", dest: "destPostcode" },
    "Office Moves": { pickup: "pickupPostcode", dest: "destPostcode" },
    "B2B Delivery & Logistics": { pickup: "pickupPostcode", dest: "deliveryPostcode" },
    "Clearance & Disposal": { pickup: "postcode", dest: null },
    "Storage Solutions": { pickup: "postcode", dest: null },
  },

  // Operating-cost assumptions (reserved for margin analysis / future explicit
  // margin application; NOT applied as a multiplier in Phase 1 so outputs are
  // preserved — margin is already baked into the base/add-on figures below).
  operatingCost: { fuelPerMile: 0.2, wearPerMile: 0.15 },
  crew: { hourlyRate: 18, avgSpeed: 40 },
  margins: {
    "Home Removals": 0.35,
    "Office Moves": 0.4,
    "B2B Delivery & Logistics": 0.3,
    "Clearance & Disposal": 0.4,
    "Storage Solutions": 0.45,
  },

  // Minimum job price (margin-safe floor). Equal to each service base, so the
  // floor never alters a normal quote — it only guards pathological inputs.
  minimums: {
    "Home Removals": 180,
    "Office Moves": 280,
    "B2B Delivery & Logistics": 120,
    "Clearance & Disposal": 90,
    "Storage Solutions": 70,
  },

  // "Custom Quote Required" threshold (Protection). Flag surfaced now; UI in a
  // later phase. Submission remains allowed regardless.
  customQuoteThreshold: 3000,

  // ---- Per-service pricing tables (ported verbatim from the flows) ----
  service: {
    "Home Removals": {
      base: 180,
      propertyAdd: {
        "1 Bedroom Flat": 0,
        "2 Bedroom Property": 120,
        "3 Bedroom Property": 240,
        "4+ Bedroom Property": 400,
      },
      loadValue: {
        "Small Load": 0,
        "Medium Load": 70,
        "Large Load": 140,
        "Full Load": 230,
      },
      itemUnit: 18,
      boxUnit: 3,
      fragile: 40,
      parkingPaid: 20,
      parkingNone: 45,
      stairsWithLift: 20,
      stairsNoLift: 90,
      extras: { packing: 150, dismantling: 90, extraCare: 60 },
    },
    "Office Moves": {
      base: 280,
      officeAdd: {
        "Small Office": 0,
        "Medium Office": 180,
        "Large Office": 400,
        "Multi-Site / Phased Move": 650,
      },
      deskUnit: 10,
      boxUnit: 2.5,
      inventoryUnit: 25,
      parkingPaid: 20,
      parkingNone: 45,
      stairsWithLift: 25,
      stairsNoLift: 120,
      movingIT: 120,
      servers: 150,
      packing: 200,
      dismantling: 120,
      oohWeekend: 220,
      oohOther: 110,
      phaseUnit: 60,
      floorUnit: 40,
      phasedCountUnit: 60,
      phasedDayUnit: 80,
      siteUnit: 120,
      projectMgmt: 350,
      onSiteCoord: 150,
      tightTimeline: 120,
      sensitiveAreas: 90,
      factorUnit: 35,
    },
    "B2B Delivery & Logistics": {
      base: 120,
      vehicleSizes: ["Small Van", "Medium Van", "Luton Van", "7.5T Truck"],
      vehicleStep: 55,
      palletUnit: 22,
      nonStackableUnit: 10,
      looseSize: { Small: 25, Medium: 55, Large: 95 },
      distanceMedium: 30,
      distanceLong: 75,
      parkingPaid: 15,
      parkingRestricted: 35,
      commercialNoBay: 25,
      resStairsWithLift: 20,
      resStairsNoLift: 60,
      serviceLevel: { Standard: 0, Premium: 45, "White-glove": 110 },
      urgency: { Scheduled: 0, "Same-day": 90, "Dedicated express": 180 },
      highValue: 60,
      fragile: 30,
      factorUnit: 30,
    },
    "Clearance & Disposal": {
      base: 90,
      propertySizes: [
        "Single room",
        "1 bed property",
        "2 bed property",
        "3 bed property",
        "4+ property",
        "Full site clearance",
      ],
      propertyStep: 45,
      loadSizes: ["¼ load", "½ load", "1 full van", "2+ loads", "Multiple truck loads"],
      loadStep: 40,
      contentUnit: 14,
      specialUnit: 30,
      siteWasteUnit: 25,
      parkingPaid: 15,
      parkingNone: 35,
      distanceMedium: 20,
      distanceLong: 45,
      stairsWithLift: 20,
      stairsNoLift: 70,
      accessNarrow: 30,
      accessRestricted: 40,
      accessPermit: 60,
      condition: {
        "Clean / organised": 0,
        "General clutter": 25,
        "Heavy clutter": 60,
        "Waste piled": 85,
        "Overgrown / neglected": 70,
      },
      skip: 140,
      serviceUnit: 35,
      complexityUnit: 45,
      urgency: { Standard: 0, "Next day": 60, "Same day": 130 },
    },
    "Storage Solutions": {
      base: 70,
      storageSizes: ["Small Storage", "Medium Storage", "Large Storage", "XL Storage"],
      sizeStep: 45,
      vanLoads: ["¼ Van", "½ Van", "1 Luton Van", "2+ Loads"],
      vanStep: 25,
      duration: { "< 1 month": 0, "1–3 months": 70, "3–6 months": 150, "6+ months": 260 },
      packing: 80,
      specialUnit: 30,
      dismantling: 60,
      reassembly: 60,
      accessServiceTypes: [
        "Collection + Storage",
        "Storage as part of Move",
        "Storage as part of Clearance",
      ],
      collectionBase: 90,
      parkingPaid: 15,
      parkingNone: 35,
      distanceMedium: 20,
      distanceLong: 45,
      stairs: 25,
      upperFloorNoLift: 40,
      climate: 50,
      container: 30,
      pallet: 45,
      accessFreq: { Rare: 15, Occasional: 30, Frequent: 60 },
      accessFreqDefault: 20,
      returnDelivery: 90,
      complexityUnit: 50,
    },
  },

  // ---- Home Removals v2 — room-based model (Phase 2) ----
  // Switch to "legacy" to fall back to the ported Version 1 property/load
  // model (preserved for rollback / parity testing).
  homeModel: "v2",
  homeV2: {
    base: 180, // 2 movers + Luton, half-day floor (unchanged starting point)
    // Per-room item catalogue: volume (cu ft, drives vehicle rec) + price (£).
    rooms: {
      bedroom: { items: [
        { key: "bed", volume: 40, price: 25 },
        { key: "mattress", volume: 20, price: 12 },
        { key: "wardrobe", volume: 50, price: 35 },
        { key: "drawers", volume: 25, price: 18 },
        { key: "bedside", volume: 8, price: 8 },
        { key: "dressingTable", volume: 30, price: 22 },
      ] },
      livingRoom: { items: [
        { key: "sofa2", volume: 45, price: 30 },
        { key: "sofa3", volume: 60, price: 40 },
        { key: "armchair", volume: 20, price: 15 },
        { key: "coffeeTable", volume: 12, price: 10 },
        { key: "tvUnit", volume: 20, price: 15 },
        { key: "tv", volume: 10, price: 15 },
        { key: "bookcase", volume: 25, price: 18 },
      ] },
      diningRoom: { items: [
        { key: "diningTable", volume: 35, price: 25 },
        { key: "diningChairs", volume: 6, price: 6 },
        { key: "sideboard", volume: 35, price: 25 },
        { key: "displayCabinet", volume: 30, price: 22 },
      ] },
      kitchen: { items: [
        { key: "fridgeFreezer", volume: 50, price: 40 },
        { key: "washingMachine", volume: 30, price: 30 },
        { key: "dishwasher", volume: 25, price: 25 },
        { key: "cooker", volume: 25, price: 25 },
        { key: "microwave", volume: 5, price: 8 },
        { key: "kitchenTable", volume: 20, price: 15 },
      ] },
      bathroom: { items: [
        { key: "cabinet", volume: 10, price: 10 },
        { key: "laundryBasket", volume: 4, price: 4 },
        { key: "mirror", volume: 6, price: 8 },
      ] },
      garden: { items: [
        { key: "gardenTable", volume: 30, price: 20 },
        { key: "gardenChairs", volume: 6, price: 5 },
        { key: "bbq", volume: 20, price: 15 },
        { key: "lawnmower", volume: 15, price: 15 },
        { key: "pots", volume: 8, price: 6 },
      ] },
      garage: { items: [
        { key: "toolbox", volume: 10, price: 10 },
        { key: "bicycle", volume: 12, price: 12 },
        { key: "workbench", volume: 30, price: 20 },
        { key: "storageBoxes", volume: 15, price: 10 },
      ] },
      loft: { items: [
        { key: "boxedItems", volume: 15, price: 8 },
        { key: "suitcases", volume: 8, price: 6 },
        { key: "miscItems", volume: 10, price: 8 },
      ] },
      study: { items: [
        { key: "desk", volume: 30, price: 22 },
        { key: "officeChair", volume: 12, price: 10 },
        { key: "bookcase", volume: 25, price: 18 },
        { key: "filingCabinet", volume: 20, price: 15 },
        { key: "computer", volume: 8, price: 12 },
      ] },
    },
    extras: {
      box: { volume: 3, price: 3 },
      bag: { volume: 2, price: 2 },
      suitcase: { volume: 3, price: 2 },
    },
    applianceKeys: ["fridgeFreezer", "washingMachine", "dishwasher", "cooker"],
    parking: { Free: 0, Paid: 20, "No Parking": 45 },
    floors: {
      Ground: { price: 0, pts: 0 },
      "1st": { price: 25, pts: 1 },
      "2nd": { price: 50, pts: 2 },
      "3rd+": { price: 90, pts: 3 },
      "Lift Available": { price: 0, pts: 0 },
    },
    highValue: {
      None: { price: 0, pts: 0 },
      Low: { price: 25, pts: 1 },
      Medium: { price: 60, pts: 2 },
      High: { price: 120, pts: 3 },
      "Very High": { price: 220, pts: 4 },
    },
    fragile: {
      Standard: { price: 0, pts: 0 },
      "Some Fragile": { price: 30, pts: 1 },
      Delicate: { price: 70, pts: 2 },
      "Very Delicate": { price: 130, pts: 3 },
      "Specialist Handling": { price: 220, pts: 4 },
    },
    packing: {
      Boxes: 40,
      "Bubble Wrap": 25,
      "Shrink Wrap": 20,
      "Mattress Covers": 30,
      "Wardrobe Boxes": 35,
      "Full Packing Service": 200,
    },
    // Special-handling items: specialist care/equipment. price → complexity,
    // pts → complexity score, volume → vehicle sizing, tailLift/heavyCrew →
    // recommendation overrides.
    specialHandling: {
      Piano: { price: 180, pts: 4, volume: 60, tailLift: true, heavyCrew: true },
      Safe: { price: 150, pts: 4, volume: 25, tailLift: true, heavyCrew: true },
      "Large Artwork": { price: 70, pts: 2, volume: 15 },
      "Antique Furniture": { price: 80, pts: 3, volume: 30 },
      "Gym Equipment": { price: 90, pts: 3, volume: 40, tailLift: true },
      "American Fridge Freezer": { price: 70, pts: 2, volume: 70, tailLift: true },
      Other: { price: 40, pts: 1, volume: 10 },
    },
    vehicleThresholds: [
      { upTo: 150, name: "Small Van" },
      { upTo: 350, name: "Medium Van" },
      { upTo: 600, name: "Luton Van" },
      { upTo: 1000, name: "Luton Tail Lift" },
      { upTo: Infinity, name: "2 Luton Vans" },
    ],
    vehicleOrder: ["Small Van", "Medium Van", "Luton Van", "Luton Tail Lift", "2 Luton Vans"],
  },
};

/* =========================================================================
 * DISTANCE — Postcodes.io geocode + haversine, with caching + fallback.
 * ========================================================================= */

// Module-level caches. Persist within a warm server instance; safe to be empty
// on cold start (fallback re-fetches). Not a correctness dependency.
const geocodeCache = new Map(); // postcode(normalised) -> {lat,lon} | null
const pairCache = new Map(); // "A|B" -> miles | null

function normalisePostcode(pc) {
  return (pc || "").trim().toUpperCase().replace(/\s+/g, "");
}

function haversineMiles(a, b) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function geocode(postcode) {
  const key = normalisePostcode(postcode);
  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key);
  let result = null;
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(key)}`
    );
    if (res.ok) {
      const json = await res.json();
      const r = json?.result;
      if (r && r.latitude != null && r.longitude != null) {
        result = { lat: r.latitude, lon: r.longitude };
      }
    }
  } catch {
    result = null; // network failure → fallback to null (no fabricated charge)
  }
  geocodeCache.set(key, result);
  return result;
}

/**
 * Road miles between two postcodes, with postcode-pair caching.
 * Returns null if either postcode can't be resolved.
 */
export async function getDistanceMiles(pickup, dest) {
  const a = normalisePostcode(pickup);
  const b = normalisePostcode(dest);
  if (!a || !b) return null;
  const pairKey = `${a}|${b}`;
  if (pairCache.has(pairKey)) return pairCache.get(pairKey);

  const [pa, pb] = await Promise.all([geocode(pickup), geocode(dest)]);
  const miles = pa && pb ? Math.round(haversineMiles(pa, pb) * CONFIG.roadFactor) : null;
  pairCache.set(pairKey, miles);
  return miles;
}

/** Banded travel charge for a one-way distance. */
export function travelComponent(miles, rate = CONFIG.defaultTravelRate) {
  const m = Number(miles) || 0;
  if (m <= CONFIG.freeRadiusMiles) return 0;

  let cost = 0;
  let lower = CONFIG.freeRadiusMiles;
  for (const band of CONFIG.distanceBands) {
    if (m <= lower) break;
    const upper = Math.min(m, band.upTo);
    cost += (upper - lower) * rate * band.mult;
    lower = upper;
    if (m <= band.upTo) break;
  }
  if (m > 300) cost += CONFIG.overnightCharge;
  return Math.round(cost);
}

/* =========================================================================
 * SERVICE COMPONENTS — faithful ports of each flow's calculatePrice().
 * ========================================================================= */

const truthyCount = (obj) => Object.values(obj || {}).filter(Boolean).length;
const num = (v) => Number(v || 0);

function homeRemovals(d, c) {
  let p = c.base;
  p += c.propertyAdd[d.property] || 0;
  p += c.loadValue[d.load] || 0;
  p += truthyCount(d.items) * c.itemUnit;
  p += num(d.boxes) * c.boxUnit;
  if (d.fragile === "Yes") p += c.fragile;
  [d.pickup, d.dropoff].forEach((a = {}) => {
    if (a.parking === "Paid") p += c.parkingPaid;
    if (a.parking === "No Parking") p += c.parkingNone;
    if (a.stairs === "Yes") p += a.lift === "Yes" ? c.stairsWithLift : c.stairsNoLift;
  });
  Object.entries(c.extras).forEach(([key, price]) => {
    if (d[key]) p += price;
  });
  return p;
}

function officeMoves(d, c) {
  let p = c.base;
  p += c.officeAdd[d.officeSize] || 0;
  p += num(d.desks) * c.deskUnit;
  p += num(d.boxes) * c.boxUnit;
  p += truthyCount(d.inventory) * c.inventoryUnit;
  [d.pickup, d.dropoff].forEach((a = {}) => {
    if (a.parking === "Paid") p += c.parkingPaid;
    if (a.parking === "No Parking") p += c.parkingNone;
    if (a.stairs === "Yes") p += a.lift === "Yes" ? c.stairsWithLift : c.stairsNoLift;
  });
  if (d.movingIT === "Yes") p += c.movingIT;
  if (d.servers === "Yes") p += c.servers;
  if (d.packing === "Yes") p += c.packing;
  if (d.dismantling === "Yes") p += c.dismantling;
  if (d.outOfHours === "Yes") p += d.oohWindow === "Weekend" ? c.oohWeekend : c.oohOther;
  if (d.phased === "Yes") p += num(d.phases || 2) * c.phaseUnit;
  if (d.multiFloor === "Yes") p += num(d.floors || 3) * c.floorUnit;
  if (d.phasedMove === "Yes")
    p += num(d.phaseCount || 2) * c.phasedCountUnit + num(d.phaseDays) * c.phasedDayUnit;
  if (d.multiSite === "Yes") p += num(d.siteCount || 2) * c.siteUnit;
  if (d.projectMgmt === "Yes") p += c.projectMgmt;
  if (d.onSiteCoord === "Yes") p += c.onSiteCoord;
  if (d.tightTimeline === "Yes") p += c.tightTimeline;
  if (d.sensitiveAreas === "Yes") p += c.sensitiveAreas;
  p += truthyCount(d.factors) * c.factorUnit;
  return Math.round(p);
}

function b2bLogistics(d, c) {
  let p = c.base;
  p += c.vehicleSizes.indexOf(d.vehicleSize) * c.vehicleStep;
  if (d.loadKind === "Palletised") {
    p += num(d.pallets) * c.palletUnit;
    if (d.stackable === "No") p += num(d.pallets) * c.nonStackableUnit;
  }
  if (d.loadKind === "Loose") p += c.looseSize[d.looseSize] || 0;
  if (d.vehicleDistance === "Medium") p += c.distanceMedium;
  if (d.vehicleDistance === "Long") p += c.distanceLong;
  if (d.parking === "Paid") p += c.parkingPaid;
  if (d.parking === "Restricted") p += c.parkingRestricted;
  if (d.siteType === "Commercial" && d.loadingBay === "No") p += c.commercialNoBay;
  if (d.siteType === "Residential" && d.stairs === "Yes")
    p += d.lift === "Yes" ? c.resStairsWithLift : c.resStairsNoLift;
  p += c.serviceLevel[d.serviceLevel] || 0;
  p += c.urgency[d.urgency] || 0;
  if (d.goods?.highValue) p += c.highValue;
  if (d.goods?.fragile) p += c.fragile;
  p += truthyCount(d.factors) * c.factorUnit;
  return p;
}

function clearance(d, c) {
  let p = c.base;
  p += (c.propertySizes.indexOf(d.propertySize) + 1) * c.propertyStep;
  p += (c.loadSizes.indexOf(d.loadSize) + 1) * c.loadStep;
  p += truthyCount(d.content) * c.contentUnit;
  p += truthyCount(d.special) * c.specialUnit;
  p += truthyCount(d.siteWaste) * c.siteWasteUnit;
  if (d.parking === "Paid") p += c.parkingPaid;
  if (d.parking === "No Parking") p += c.parkingNone;
  if (d.distance === "Medium") p += c.distanceMedium;
  if (d.distance === "Long") p += c.distanceLong;
  if (d.stairs === "Yes") p += d.lift === "Yes" ? c.stairsWithLift : c.stairsNoLift;
  const access = d.access || {};
  if (access.narrow) p += c.accessNarrow;
  if (access.restricted) p += c.accessRestricted;
  if (access.permit) p += c.accessPermit;
  p += c.condition[d.condition] || 0;
  if (d.skip === "Yes") p += c.skip;
  p += truthyCount(d.services) * c.serviceUnit;
  p += truthyCount(d.complexity) * c.complexityUnit;
  p += c.urgency[d.urgency] || 0;
  return p;
}

function storage(d, c) {
  let p = c.base;
  p += (c.storageSizes.indexOf(d.size) + 1) * c.sizeStep;
  p += (c.vanLoads.indexOf(d.vanLoad) + 1) * c.vanStep;
  p += c.duration[d.duration] || 0;
  if (Object.values(d.packing || {}).some(Boolean)) p += c.packing;
  p += truthyCount(d.special) * c.specialUnit;
  if (d.dismantling === "Yes") p += c.dismantling;
  if (d.reassembly === "Yes") p += c.reassembly;
  const showAccess = c.accessServiceTypes.includes(d.serviceType);
  if (showAccess) {
    p += c.collectionBase;
    if (d.parking === "Paid") p += c.parkingPaid;
    if (d.parking === "No Parking") p += c.parkingNone;
    if (d.distance === "Medium") p += c.distanceMedium;
    if (d.distance === "Long") p += c.distanceLong;
    if (d.stairs === "Yes") p += c.stairs;
    if (d.lift === "No" && d.floor && !/ground/i.test(d.floor)) p += c.upperFloorNoLift;
  }
  if (d.climate === "Yes") p += c.climate;
  if (d.storagePlace === "Container") p += c.container;
  if (d.pallet === "Yes") p += c.pallet;
  if (d.accessNeeded === "Yes") p += c.accessFreq[d.accessFreq] || c.accessFreqDefault;
  if (d.returnDelivery === "Yes") p += c.returnDelivery;
  p += truthyCount(d.complexity) * c.complexityUnit;
  return p;
}

/**
 * Home Removals v2 — room-based model. Returns the full component breakdown
 * plus vehicle/crew recommendations. Pricing constants come from CONFIG.homeV2.
 */
export function homeRemovalsV2(d = {}) {
  const c = CONFIG.homeV2;
  const rooms = d.rooms || {};
  let itemsCost = 0;
  let volume = 0;
  let appliances = 0;
  let beds = 0;

  for (const [roomKey, roomDef] of Object.entries(c.rooms)) {
    const chosen = rooms[roomKey] || {};
    for (const item of roomDef.items) {
      const q = num(chosen[item.key]);
      if (q > 0) {
        itemsCost += item.price * q;
        volume += item.volume * q;
      }
      if (roomKey === "bedroom" && item.key === "bed") beds += q;
      if (roomKey === "kitchen" && c.applianceKeys.includes(item.key)) appliances += q;
    }
  }

  const boxes = num(d.boxes);
  const bags = num(d.bags);
  const suitcases = num(d.suitcases);
  itemsCost += boxes * c.extras.box.price + bags * c.extras.bag.price + suitcases * c.extras.suitcase.price;
  volume += boxes * c.extras.box.volume + bags * c.extras.bag.volume + suitcases * c.extras.suitcase.volume;

  // Special handling — accepts an array of keys or a {key:bool} map.
  const specialKeys = Array.isArray(d.specialHandling)
    ? d.specialHandling
    : Object.keys(d.specialHandling || {}).filter((k) => d.specialHandling[k]);
  let specialCost = 0;
  let specialPts = 0;
  let specialTailLift = false;
  let specialHeavyCrew = false;
  for (const k of specialKeys) {
    const s = c.specialHandling[k];
    if (!s) continue;
    specialCost += s.price;
    specialPts += s.pts;
    volume += s.volume || 0;
    if (s.tailLift) specialTailLift = true;
    if (s.heavyCrew) specialHeavyCrew = true;
  }

  const parking = (a) => c.parking[a?.parking] || 0;
  const service = c.base + itemsCost + parking(d.pickup) + parking(d.dropoff);

  // Packing — accepts an array of keys or a {key:bool} map.
  const packKeys = Array.isArray(d.packing)
    ? d.packing
    : Object.keys(d.packing || {}).filter((k) => d.packing[k]);
  const packing = packKeys.reduce((s, k) => s + (c.packing[k] || 0), 0);

  // Complexity (£ component + a 0–20ish sales score)
  const hv = c.highValue[d.highValue] || c.highValue.None;
  const fr = c.fragile[d.fragileLevel] || c.fragile.Standard;
  const pf = c.floors[d.pickup?.floor] || c.floors.Ground;
  const df = c.floors[d.dropoff?.floor] || c.floors.Ground;
  const complexityComponent = hv.price + fr.price + pf.price + df.price + specialCost;
  const volumeBand = volume > 1000 ? 3 : volume > 600 ? 2 : volume > 300 ? 1 : 0;
  const complexityScore =
    hv.pts * 2 + fr.pts * 2 + pf.pts + df.pts + volumeBand + specialPts + (beds >= 4 ? 2 : 0);

  // Vehicle — by volume, bumped for appliances / specialist / very-high value.
  let vehicle = c.vehicleThresholds.find((t) => volume <= t.upTo)?.name || "2 Luton Vans";
  const bump = (name) => {
    if (c.vehicleOrder.indexOf(name) > c.vehicleOrder.indexOf(vehicle)) vehicle = name;
  };
  if (appliances > 0) bump("Luton Van");
  if (d.fragileLevel === "Specialist Handling" || d.highValue === "Very High") bump("Luton Tail Lift");
  if (specialTailLift) bump("Luton Tail Lift");

  // Crew — by bedrooms, with volume overrides.
  let crew = beds >= 4 ? 3 : 2;
  if (volume > 1000) crew = Math.max(crew, 3);
  if (volume > 1600) crew = Math.max(crew, 4);
  if (specialHeavyCrew) crew = Math.max(crew, 3);

  return {
    serviceComponent: Math.round(service),
    packingComponent: Math.round(packing),
    complexityComponent: Math.round(complexityComponent),
    complexityScore,
    totalVolume: Math.round(volume),
    vehicleRecommendation: vehicle,
    crewRecommendation: `${crew} Crew`,
    bedrooms: beds,
  };
}

const SERVICE_FNS = {
  "Home Removals": homeRemovals,
  "Office Moves": officeMoves,
  "B2B Delivery & Logistics": b2bLogistics,
  "Clearance & Disposal": clearance,
  "Storage Solutions": storage,
};

export function serviceComponent(service, details = {}) {
  if (service === "Home Removals" && CONFIG.homeModel === "v2") {
    return homeRemovalsV2(details).serviceComponent;
  }
  const fn = SERVICE_FNS[service];
  const cfg = CONFIG.service[service];
  if (!fn || !cfg) return 0;
  return fn(details, cfg);
}

/* =========================================================================
 * ASSEMBLY — the full server-authoritative quote.
 * ========================================================================= */

/**
 * @returns {Promise<{
 *   estimate:number, low:number, high:number, distanceMiles:number|null,
 *   serviceComponent:number, travelComponent:number, packingComponent:number,
 *   complexityScore:number, vehicleRecommendation:string|null,
 *   crewRecommendation:string|null, customQuoteRequired:boolean,
 *   pricingVersion:string
 * }>}
 */
// Resolve the travel leg for a service (0 for single-postcode services).
async function resolveTravel(service, details) {
  const pc = CONFIG.postcodeFields[service];
  if (!pc?.dest) return { distanceMiles: null, travel: 0 };
  const distanceMiles = await getDistanceMiles(details[pc.pickup], details[pc.dest]);
  if (distanceMiles == null) return { distanceMiles: null, travel: 0 };
  const rate = CONFIG.travelRates[service] ?? CONFIG.defaultTravelRate;
  return { distanceMiles, travel: travelComponent(distanceMiles, rate) };
}

export async function priceQuote(service, details = {}) {
  const min = CONFIG.minimums[service] ?? 0;
  const { distanceMiles, travel } = await resolveTravel(service, details);

  // Home Removals v2 — room-based model with packing/complexity/vehicle/crew.
  if (service === "Home Removals" && CONFIG.homeModel === "v2") {
    const b = homeRemovalsV2(details);
    const estimate = Math.max(
      b.serviceComponent + travel + b.packingComponent + b.complexityComponent,
      min
    );
    const { low, high } = priceRange(estimate);
    return {
      estimate,
      low,
      high,
      distanceMiles,
      serviceComponent: b.serviceComponent,
      travelComponent: travel,
      packingComponent: b.packingComponent,
      complexityComponent: b.complexityComponent,
      complexityScore: b.complexityScore,
      totalVolume: b.totalVolume,
      vehicleRecommendation: b.vehicleRecommendation,
      crewRecommendation: b.crewRecommendation,
      customQuoteRequired: estimate > CONFIG.customQuoteThreshold,
      pricingVersion: CONFIG.version,
    };
  }

  // Other services — ported Version 1 logic (packing/complexity folded into
  // serviceComponent; reported as separate 0 line items for a uniform shape).
  const svc = serviceComponent(service, details);
  const estimate = Math.max(svc + travel, min);
  const { low, high } = priceRange(estimate);
  return {
    estimate,
    low,
    high,
    distanceMiles,
    serviceComponent: svc,
    travelComponent: travel,
    packingComponent: 0,
    complexityComponent: 0,
    complexityScore: 0,
    totalVolume: null,
    vehicleRecommendation: null,
    crewRecommendation: null,
    customQuoteRequired: estimate > CONFIG.customQuoteThreshold,
    pricingVersion: CONFIG.version,
  };
}

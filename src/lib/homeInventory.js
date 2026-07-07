/* ---------------------------------------------------------------------------
 * Shared Home Removals inventory metadata (labels only — no pricing).
 *
 * Single source of truth for room/item display labels, used by BOTH the client
 * configurator (UI) and the server (human-readable inventory summaries for the
 * lead email / Power Automate). Keys MUST match CONFIG.homeV2.rooms in
 * pricing.server.js. This module is framework-agnostic (no "use client").
 * ------------------------------------------------------------------------- */

export const ROOMS = {
  bedroom: {
    label: "Bedroom",
    items: [
      { key: "bed", label: "Bed" },
      { key: "mattress", label: "Mattress" },
      { key: "wardrobe", label: "Wardrobe" },
      { key: "drawers", label: "Chest of Drawers" },
      { key: "bedside", label: "Bedside Table" },
      { key: "dressingTable", label: "Dressing Table" },
    ],
  },
  livingRoom: {
    label: "Living Room",
    items: [
      { key: "sofa2", label: "2-Seat Sofa" },
      { key: "sofa3", label: "3-Seat Sofa" },
      { key: "armchair", label: "Armchair" },
      { key: "coffeeTable", label: "Coffee Table" },
      { key: "tvUnit", label: "TV Unit" },
      { key: "tv", label: "TV" },
      { key: "bookcase", label: "Bookcase" },
    ],
  },
  diningRoom: {
    label: "Dining Room",
    items: [
      { key: "diningTable", label: "Dining Table" },
      { key: "diningChairs", label: "Dining Chairs" },
      { key: "sideboard", label: "Sideboard" },
      { key: "displayCabinet", label: "Display Cabinet" },
    ],
  },
  kitchen: {
    label: "Kitchen",
    items: [
      { key: "fridgeFreezer", label: "Fridge / Freezer" },
      { key: "washingMachine", label: "Washing Machine" },
      { key: "dishwasher", label: "Dishwasher" },
      { key: "cooker", label: "Cooker" },
      { key: "microwave", label: "Microwave" },
      { key: "kitchenTable", label: "Kitchen Table" },
    ],
  },
  bathroom: {
    label: "Bathroom",
    items: [
      { key: "cabinet", label: "Cabinet" },
      { key: "laundryBasket", label: "Laundry Basket" },
      { key: "mirror", label: "Mirror" },
    ],
  },
  garden: {
    label: "Garden",
    items: [
      { key: "gardenTable", label: "Garden Table" },
      { key: "gardenChairs", label: "Garden Chairs" },
      { key: "bbq", label: "BBQ" },
      { key: "lawnmower", label: "Lawnmower" },
      { key: "pots", label: "Plant Pots" },
    ],
  },
  garage: {
    label: "Garage",
    items: [
      { key: "toolbox", label: "Toolbox" },
      { key: "bicycle", label: "Bicycle" },
      { key: "workbench", label: "Workbench" },
      { key: "storageBoxes", label: "Storage Boxes" },
    ],
  },
  loft: {
    label: "Loft",
    items: [
      { key: "boxedItems", label: "Boxed Items" },
      { key: "suitcases", label: "Suitcases" },
      { key: "miscItems", label: "Misc Items" },
    ],
  },
  study: {
    label: "Study",
    items: [
      { key: "desk", label: "Desk" },
      { key: "officeChair", label: "Office Chair" },
      { key: "bookcase", label: "Bookcase" },
      { key: "filingCabinet", label: "Filing Cabinet" },
      { key: "computer", label: "Computer" },
    ],
  },
};

export const ROOM_ORDER = Object.keys(ROOMS);

/** Naive English pluralisation good enough for inventory labels. */
export function pluralize(label, n) {
  if (n === 1) return label;
  if (/s$/i.test(label)) return label;
  return `${label}s`;
}

const selectedKeys = (v) =>
  Array.isArray(v) ? v : Object.keys(v || {}).filter((k) => v[k]);

/**
 * Human-readable inventory summary for a Home Removals move.
 * Example:
 *   Bedroom:
 *   - 2 Beds
 *   - 1 Wardrobe
 *
 *   Boxes: 20
 */
export function summariseInventory(details = {}) {
  const rooms = details.rooms || {};
  const blocks = [];

  for (const roomKey of ROOM_ORDER) {
    const chosen = rooms[roomKey];
    if (!chosen) continue;
    const itemLines = [];
    for (const item of ROOMS[roomKey].items) {
      const q = Number(chosen[item.key] || 0);
      if (q > 0) itemLines.push(`- ${q} ${pluralize(item.label, q)}`);
    }
    if (itemLines.length) blocks.push([`${ROOMS[roomKey].label}:`, ...itemLines].join("\n"));
  }

  const packed = [];
  const boxes = Number(details.boxes || 0);
  const bags = Number(details.bags || 0);
  const suitcases = Number(details.suitcases || 0);
  if (boxes) packed.push(`Boxes: ${boxes}`);
  if (bags) packed.push(`Bags: ${bags}`);
  if (suitcases) packed.push(`Suitcases: ${suitcases}`);
  if (packed.length) blocks.push(packed.join("\n"));

  const special = selectedKeys(details.specialHandling);
  if (special.length) {
    const extra = details.specialHandlingOther ? ` (${details.specialHandlingOther})` : "";
    blocks.push(`Special handling: ${special.join(", ")}${extra}`);
  }

  return blocks.join("\n\n").trim();
}

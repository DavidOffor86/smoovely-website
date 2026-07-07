/* ---------------------------------------------------------------------------
 * Home Removals v2 (room-based) deterministic checks.
 *
 *   node scripts/home-model-check.mjs
 *
 * Asserts the new model's component breakdown, vehicle and crew logic against
 * hand-computed expectations for representative moves.
 * ------------------------------------------------------------------------- */
import { homeRemovalsV2, priceQuote } from "../src/lib/pricing.server.js";

let failures = 0;
function eq(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "✅" : "❌"} ${label}: got ${JSON.stringify(actual)}${ok ? "" : ` (expected ${JSON.stringify(expected)})`}`);
}

/* Case A — empty move → base only. */
{
  const b = homeRemovalsV2({});
  eq("A service", b.serviceComponent, 180);
  eq("A packing", b.packingComponent, 0);
  eq("A complexity", b.complexityComponent, 0);
  eq("A vehicle", b.vehicleRecommendation, "Small Van");
  eq("A crew", b.crewRecommendation, "2 Crew");
}

/* Case B — 2 beds + wardrobe, 10 boxes, Medium value, Delicate, pack Boxes+Bubble,
 * pickup 2nd floor, dropoff Ground.
 *   service = 180 + (bed 25×2 + wardrobe 35) + boxes 3×10 = 180+85+30 = 295
 *   volume  = 40×2 + 50 + 3×10 = 160  → Medium Van
 *   packing = 40 + 25 = 65
 *   complexity = hv Medium 60 + fr Delicate 70 + pickup 2nd 50 + dropoff 0 = 180
 */
{
  const form = {
    rooms: { bedroom: { bed: 2, wardrobe: 1 } },
    boxes: 10,
    highValue: "Medium",
    fragileLevel: "Delicate",
    packing: { Boxes: true, "Bubble Wrap": true },
    pickup: { parking: "Free", floor: "2nd" },
    dropoff: { parking: "Free", floor: "Ground" },
  };
  const b = homeRemovalsV2(form);
  eq("B service", b.serviceComponent, 295);
  eq("B packing", b.packingComponent, 65);
  eq("B complexity", b.complexityComponent, 180);
  eq("B vehicle", b.vehicleRecommendation, "Medium Van");
  eq("B crew", b.crewRecommendation, "2 Crew");
  eq("B totalVolume", b.totalVolume, 160);
}

/* Case C — appliances bump vehicle to at least Luton Van at low volume. */
{
  const b = homeRemovalsV2({ rooms: { kitchen: { washingMachine: 1 } } });
  // volume 30 → Small Van, bumped to Luton Van by appliance
  eq("C vehicle (appliance bump)", b.vehicleRecommendation, "Luton Van");
}

/* Case D — Very High value bumps vehicle to Tail Lift; big volume → crew. */
{
  const form = {
    rooms: {
      bedroom: { bed: 4, wardrobe: 4, drawers: 4 },
      livingRoom: { sofa3: 2, armchair: 4, bookcase: 4 },
      diningRoom: { diningTable: 2, sideboard: 2 },
    },
    highValue: "Very High",
  };
  const b = homeRemovalsV2(form);
  // 4 beds → crew ≥ 3; large volume may push to 4
  const crewNum = Number(b.crewRecommendation.split(" ")[0]);
  eq("D crew ≥ 3", crewNum >= 3, true);
  eq("D vehicle ≥ Tail Lift", ["Luton Tail Lift", "2 Luton Vans"].includes(b.vehicleRecommendation), true);
}

/* Case E — full quote assembly (no postcodes → travel 0, floored at 180). */
{
  const q = await priceQuote("Home Removals", {});
  eq("E estimate floor", q.estimate, 180);
  eq("E travel", q.travelComponent, 0);
  eq("E pricingVersion present", typeof q.pricingVersion === "string", true);
}

/* Case F — custom-quote flag above £3000. */
{
  const big = {
    rooms: Object.fromEntries(
      ["bedroom", "livingRoom", "diningRoom", "kitchen", "study", "garage"].map((r) => [
        r,
        { bed: 9, wardrobe: 9, sofa3: 9, diningTable: 9, desk: 9, workbench: 9, fridgeFreezer: 9 },
      ])
    ),
    highValue: "Very High",
    fragileLevel: "Specialist Handling",
    packing: { "Full Packing Service": true },
  };
  const q = await priceQuote("Home Removals", big);
  eq("F customQuoteRequired", q.customQuoteRequired, q.estimate > 3000);
  console.log(`   (estimate £${q.estimate}, vehicle ${q.vehicleRecommendation}, crew ${q.crewRecommendation})`);
}

/* Case G — special handling: Piano + Safe → tail lift, ≥3 crew, complexity. */
{
  const base = homeRemovalsV2({ rooms: { bedroom: { bed: 1 } } });
  const withSpecial = homeRemovalsV2({
    rooms: { bedroom: { bed: 1 } },
    specialHandling: { Piano: true, Safe: true },
  });
  // Piano £180 + Safe £150 = £330 added to complexity
  eq("G complexity += special", withSpecial.complexityComponent, base.complexityComponent + 330);
  eq("G vehicle tail lift", withSpecial.vehicleRecommendation, "Luton Tail Lift");
  eq("G crew ≥ 3", Number(withSpecial.crewRecommendation.split(" ")[0]) >= 3, true);
  eq("G score increased", withSpecial.complexityScore > base.complexityScore, true);
}

console.log(failures === 0 ? "\nHOME v2 OK." : `\nHOME v2 FAILED (${failures}).`);
process.exit(failures === 0 ? 0 : 1);

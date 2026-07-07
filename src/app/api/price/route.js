import { NextResponse } from "next/server";
import { priceQuote } from "../../../lib/pricing.server";

/* ---------------------------------------------------------------------------
 * Server-authoritative pricing endpoint.
 *
 *   POST /api/price  { service, details }
 *     → { ok, estimate, low, high, distanceMiles, serviceComponent,
 *         travelComponent, packingComponent, complexityScore,
 *         vehicleRecommendation, crewRecommendation, customQuoteRequired,
 *         pricingVersion }
 *
 * All pricing constants + logic live in pricing.server.js and never reach the
 * browser. The configurator calls this for its live estimate; /api/quote
 * re-prices on submit so the stored figure can't be tampered with.
 * ------------------------------------------------------------------------- */
export async function POST(req) {
  try {
    const body = await req.json();
    const service = body?.service;
    const details = body?.details || {};
    if (!service) {
      return NextResponse.json({ ok: false, error: "Missing service." }, { status: 400 });
    }
    const quote = await priceQuote(service, details);
    return NextResponse.json({ ok: true, ...quote });
  } catch (err) {
    console.error("[/api/price] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

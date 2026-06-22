/* ---------------------------------------------------------------------------
 * Shared pricing utilities for the QuickMove configurator.
 *
 * Each flow keeps its own calculatePrice() (modular, service-specific), but
 * presentation is standardised here so every quote:
 *   - keeps a single POINT estimate (the number sent in the booking payload)
 *   - shows the customer an honest RANGE around it
 *
 * Spec requirement: "Avoid misleading fixed quotes — show price range where
 * necessary, e.g. £650–£800." A configurator can't see access photos, exact
 * mileage or on-site reality, so the band communicates that the final figure
 * is confirmed on survey.
 * ------------------------------------------------------------------------- */

// Round to the nearest £10 so quotes read cleanly (£648 → £650).
const round10 = (n) => Math.round(n / 10) * 10;

/**
 * Build a low–high band around a point estimate.
 * @param {number} point  the calculated point estimate
 * @param {number} spread fractional half-width of the band (default ±12%)
 */
export function priceRange(point, spread = 0.12) {
  const p = Math.max(0, Number(point) || 0);
  return { low: round10(p * (1 - spread)), high: round10(p * (1 + spread)) };
}

/** Pre-formatted "£650–£800" string for the UI. */
export function formatRange(point, spread) {
  const { low, high } = priceRange(point, spread);
  return `£${low.toLocaleString()}–£${high.toLocaleString()}`;
}

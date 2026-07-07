"use client";

import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------------
 * Server-authoritative quote hook. Posts the current form to /api/price
 * (debounced) and returns the full breakdown. Replaces the Version 1
 * client-side useTravelQuote — no pricing constants live in the browser.
 *
 * Returns:
 *   { estimate, low, high, distanceMiles, serviceComponent, travelComponent,
 *     packingComponent, complexityScore, vehicleRecommendation,
 *     crewRecommendation, customQuoteRequired, pricingVersion, loading, error }
 * ------------------------------------------------------------------------- */

const EMPTY = {
  estimate: 0,
  low: 0,
  high: 0,
  distanceMiles: null,
  serviceComponent: 0,
  travelComponent: 0,
  packingComponent: 0,
  complexityComponent: 0,
  complexityScore: 0,
  totalVolume: null,
  vehicleRecommendation: null,
  crewRecommendation: null,
  customQuoteRequired: false,
  pricingVersion: null,
};

export function useServerQuote(service, details) {
  const [state, setState] = useState({ ...EMPTY, loading: false, error: null });

  // Serialise inputs so the effect re-runs on any relevant change.
  const key = JSON.stringify({ service, details });

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch("/api/price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service, details }),
        });
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !json.ok) throw new Error("price failed");
        const { ok, ...quote } = json;
        setState({ ...EMPTY, ...quote, loading: false, error: null });
      } catch {
        // On failure keep the last good figures but flag the error.
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: "failed" }));
      }
    }, 500); // debounce input changes

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

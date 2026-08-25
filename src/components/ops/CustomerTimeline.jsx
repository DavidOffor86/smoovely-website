import { JOURNEY_STAGES } from "../../lib/operationsRecord";

/* ---------------------------------------------------------------------------
 * Reusable customer journey timeline (Phase E, Feature 11).
 *
 * Renders the end-to-end journey (Quote → … → What's Next) as a vertical
 * timeline. `activeIndex` marks the current stage; earlier stages render as
 * complete, later stages as pending. Presentational only — no data deps.
 * ------------------------------------------------------------------------- */

export default function CustomerTimeline({ stages = JOURNEY_STAGES, activeIndex = 0 }) {
  return (
    <ol className="relative ml-3 border-l-2 border-slate-200">
      {stages.map((stage, i) => {
        const complete = i < activeIndex;
        const current = i === activeIndex;
        return (
          <li key={stage} className="mb-6 ml-6 last:mb-0">
            <span
              className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white ${
                complete
                  ? "bg-green text-white"
                  : current
                    ? "bg-green/20 text-green ring-green/10"
                    : "bg-slate-200 text-slate-400"
              }`}
              aria-hidden="true"
            >
              {complete ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="h-2 w-2 rounded-full bg-current" />
              )}
            </span>
            <p
              className={`text-sm font-semibold ${
                current ? "text-green" : complete ? "text-navy" : "text-slate-400"
              }`}
            >
              {stage}
            </p>
            <p className="text-xs text-slate-400">
              {complete ? "Complete" : current ? "In progress" : "Pending"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

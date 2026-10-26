"use client";

/* ---------------------------------------------------------------------------
 * Shared Review Summary shell — standardises the review-before-submit screen
 * across ALL quote configurators.
 *
 * Consumers pass a `sections` array using the consistent structure:
 *   SERVICE DETAILS · LOCATION DETAILS · CONTACT DETAILS · LEAD ATTRIBUTION ·
 *   ADDITIONAL INFORMATION · PRICING DETAILS
 *
 * Rows whose value is empty are never rendered, and a section with no
 * remaining rows is omitted entirely — this is what keeps empty postcode rows
 * off the screen. Action buttons (Back / Get My Quote) are passed as children
 * so each flow keeps control of its own submission behaviour.
 * ------------------------------------------------------------------------- */

function isEmpty(value) {
  return value == null || String(value).trim() === "";
}

export function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-0">
      <span className="shrink-0 font-medium text-gray-600">{label}</span>
      <span className="whitespace-pre-line text-right font-semibold text-gray-900">
        {value}
      </span>
    </div>
  );
}

export default function ReviewSummary({ sections = [], overview = null, children }) {
  return (
    <div>
      <h2 className="mb-1 text-center font-semibold text-gray-800">
        Review your details
      </h2>
      <p className="mb-4 text-center text-xs text-gray-500">
        Check everything below, then get your quote. You can go back to change
        any answer.
      </p>

      {overview && (
        <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-700">
            📋 Quote Overview (Printable)
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {overview.map((item) =>
              item.value ? (
                <div key={item.label} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section) => {
          const rows = (section.rows || []).filter((r) => r && !isEmpty(r.value));
          if (rows.length === 0) return null; // skip empty sections entirely
          return (
            <div key={section.title} className="rounded-lg bg-gray-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                {section.title}
              </p>
              <div className="text-sm text-gray-700">
                {rows.map((r) => (
                  <SummaryRow key={r.label} label={r.label} value={r.value} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

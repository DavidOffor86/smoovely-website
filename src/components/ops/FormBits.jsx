"use client";

/* ---------------------------------------------------------------------------
 * Small shared form primitives for the Operations pages (Phase E).
 * Keeps the acceptance / checklist / completion forms visually consistent.
 * ------------------------------------------------------------------------- */

export function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 p-3 ${props.className || ""}`}
    />
  );
}

export function YesNo({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-lg border p-2.5 text-sm font-medium transition ${
            value === opt
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function CheckRow({ checked, onChange, children }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition ${
        checked
          ? "border-blue-600 bg-blue-50 text-blue-900"
          : "border-gray-300 text-gray-700 hover:border-blue-400"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
          checked ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"
        }`}
      >
        {checked && "✓"}
      </span>
      <span>{children}</span>
    </button>
  );
}

export function SubmitButton({ disabled, sending, children }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {sending ? "Sending…" : children}
    </button>
  );
}

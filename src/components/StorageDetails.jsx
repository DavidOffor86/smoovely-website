const unitSizes = [
  { size: "Small", desc: "A few boxes and small items", capacity: "~10–25 sq ft" },
  { size: "Medium", desc: "Contents of 1–2 rooms", capacity: "~50–75 sq ft" },
  { size: "Large", desc: "A full home or office", capacity: "~100+ sq ft" },
];

const options = [
  {
    title: "Load types",
    items: ["Part load — share space, share cost", "Full load — a unit to yourself"],
  },
  {
    title: "Storage duration",
    items: ["Short-term — days or weeks", "Long-term — flexible monthly rolling"],
  },
  {
    title: "Locations",
    items: ["Central London facilities", "Regional hubs across the UK"],
  },
  {
    title: "Security features",
    items: ["24/7 CCTV monitoring", "Controlled, access-gated entry"],
  },
];

const Check = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 h-4 w-4 shrink-0 text-green"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function StorageDetails() {
  return (
    <section id="storage" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Detailed — Storage Solutions
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Secure, flexible storage on your terms
          </h2>
          <p className="mt-4 text-slate-600">
            Choose the right unit, load type and duration — protected around the
            clock.
          </p>
        </header>

        {/* Unit sizes */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {unitSizes.map((u) => (
            <div
              key={u.size}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:-translate-y-1 hover:border-green/40 hover:shadow-lg"
            >
              <p className="text-xl font-bold text-navy">{u.size}</p>
              <p className="mt-2 text-sm text-slate-600">{u.desc}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-green">
                {u.capacity}
              </p>
            </div>
          ))}
        </div>

        {/* Options grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((opt) => (
            <div
              key={opt.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-navy">
                {opt.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {opt.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-slate-600"
                  >
                    {Check}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

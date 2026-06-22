// Real clients shown in the "trusted by" marquee — name + the service they used.
// Swap to logo <img>s later by dropping files in /public/images/logos.
const clients = [
  { name: "Miss Rebecca O", service: "Home Removals & Storage" },
  { name: "Miss Jewel D", service: "Home Clearance" },
  { name: "OC Lounge", service: "Logistics · Cold Foods" },
  { name: "TheFurzdown", service: "Logistics · Drinks & Bar Beverages" },
  { name: "Costacks", service: "Logistics · Mr Frendl O" },
  { name: "Garri Bar", service: "Tenant Removals · Mr Edward S" },
  { name: "Mr Akbar P", service: "Home Removals" },
  { name: "Involt Capital Ltd", service: "Office Relocation" },
  { name: "SnapGeniX", service: "Office Move & Storage" },
];

export default function LogoCarousel() {
  // Duplicate the list so the marquee loops seamlessly at translateX(-50%).
  const row = [...clients, ...clients];

  return (
    <section className="border-y border-slate-200 bg-white py-12">
      <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
        Trusted by homes &amp; businesses across the UK
      </p>

      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-scroll items-center group-hover:[animation-play-state:paused]">
          {row.map((client, i) => (
            <div
              key={i}
              aria-hidden={i >= clients.length}
              className="group/item flex flex-col items-center whitespace-nowrap px-10 text-center"
            >
              <span className="text-xl font-bold tracking-tight text-slate-500 transition-colors group-hover/item:text-navy sm:text-2xl">
                {client.name}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                {client.service}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

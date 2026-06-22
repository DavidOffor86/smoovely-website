const components = [
  {
    title: "Luton Vans",
    desc: "Spacious, tail-lift Luton vans with protective blankets and straps.",
    image: "/images/Equipment and Service Components/Luton Vans.jpg",
    price: "Included",
  },
  {
    title: "PPE & Protective Equipment",
    desc: "Gloves, boots and hi-vis for safe, professional on-site handling.",
    image: "/images/Equipment and Service Components/PPE & Protective Equipment.png",
    price: "Included",
  },
  {
    title: "Dollies & Trolleys",
    desc: "Heavy-duty dollies, sack trucks and stair-climbers for bulky loads.",
    image: "/images/Equipment and Service Components/Dollies & Trolleys.png",
    price: "Included",
  },
  {
    title: "Packing Materials",
    desc: "Boxes, bubble wrap, tape and wardrobe cartons available on request.",
    image: "/images/Equipment and Service Components/Packing Materials.png",
    price: "From £15 / set",
  },
  {
    title: "Waste Disposal Bins",
    desc: "Licensed waste bins for clearances with certified, eco-friendly disposal.",
    image: "/images/Equipment and Service Components/Waste Disposal Bins.png",
    price: "From £60",
  },
  {
    title: "Clearance Tools",
    desc: "Dismantling tools and equipment for fast, safe property clearances.",
    image: "/images/Equipment and Service Components/Clearance Tools.png",
    price: "Included",
  },
];

const Check = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-white"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ServiceComponents() {
  return (
    <section id="whats-included" className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Equipment & service components
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            What&apos;s included
          </h2>
          <p className="mt-4 text-slate-600">
            Professional-grade equipment and fully-equipped crews on every job.
          </p>
        </header>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {components.map((item) => (
            <article
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-green/40 hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green">
                    {Check}
                  </span>
                  <h3 className="truncate text-base font-semibold text-navy">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-green">
                  {item.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

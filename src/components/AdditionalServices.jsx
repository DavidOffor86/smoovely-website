import QuoteButton from "./QuoteButton";

const items = [
  {
    title: "Logistics & parcel delivery",
    desc: "Reliable courier and pallet delivery with live scheduling and full tracking.",
    img: "/images/Logistics Unloading.jpeg",
  },
  {
    title: "Office & business services",
    desc: "Tailored relocation plans for offices, retail and commercial sites.",
    img: "/images/Main Office Move image.jpeg",
  },
  {
    title: "Same-day delivery",
    desc: "Urgent jobs handled fast — book in the morning, delivered by evening.",
    img: "/images/After - Home Removals .jpeg",
  },
  {
    title: "B2B services",
    desc: "Ongoing contracts and bulk logistics support for businesses of any size.",
    img: "/images/3-4 Bedroom Storage - 100sqft - image2.jpeg",
  },
];

export default function AdditionalServices() {
  return (
    <section id="logistics" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            More than removals
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Additional services
          </h2>
          <p className="mt-4 text-slate-600">
            A complete logistics partner for homes and businesses across the UK.
          </p>
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <QuoteButton variant="primary">Get a Quote</QuoteButton>
        </div>
      </div>
    </section>
  );
}

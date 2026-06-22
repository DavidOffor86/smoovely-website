import QuoteButton from "./QuoteButton";

export default function FinalCTA() {
  return (
    <section className="bg-white px-6 py-20 lg:py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-green blur-[120px]" />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to move?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Get a free, no-obligation quote in under 90 seconds. Transparent
            pricing, no hidden fees — just a smooth move.
          </p>
          <QuoteButton variant="primary" className="mt-8">
            Start Your Quote
          </QuoteButton>
        </div>
      </div>
    </section>
  );
}

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-10%] top-[-40%] h-[420px] w-[420px] rounded-full bg-green blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-16 text-center lg:py-20">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

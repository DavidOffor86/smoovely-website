import Link from "next/link";

const footerLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/industries", label: "Industries" },
  { href: "/resources", label: "Resources" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/quote", label: "Get Quote" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm text-center md:text-left">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 md:justify-start"
              aria-label="Smoovely QuickMove home"
            >
              <img
                src="/images/logo.png"
                alt="Smoovely QuickMove"
                className="h-11 w-auto"
              />
              <span className="text-lg font-bold text-white">
                Smoovely <span className="text-green">QuickMove</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Fast, reliable removals, logistics and storage across the UK.
              Transparent pricing, fully insured, every time.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs leading-relaxed text-slate-400">
          <p>
            Smoovely Logistics Ltd · Company No. 17221416 ·{" "}
            <a
              href="mailto:support@smoovelylogistics.com"
              className="transition hover:text-white"
            >
              support@smoovelylogistics.com
            </a>
          </p>
          <p className="mt-1">
            Registered office: 71–75 Shelton Street, Covent Garden, London
            WC2H 9JQ, United Kingdom
          </p>
          <p className="mt-3">
            © {new Date().getFullYear()} Smoovely QuickMove. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

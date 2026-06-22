"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/solutions",
    label: "Solutions",
    children: [
      { href: "/solutions", label: "Home Removals" },
      { href: "/solutions", label: "Office Moves" },
      { href: "/solutions", label: "B2B Logistics" },
      { href: "/solutions", label: "Storage Services" },
      { href: "/solutions", label: "Clearance" },
    ],
  },
  {
    href: "/industries",
    label: "Industries",
    children: [
      { href: "/industries#private-landlords", label: "Private Landlords" },
      { href: "/industries#local-councils", label: "Local Councils" },
      { href: "/industries#retail", label: "Retail" },
      { href: "/industries#construction", label: "Construction" },
      { href: "/industries#medical", label: "Medical" },
      { href: "/industries#corporate", label: "Corporate" },
    ],
  },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const Caret = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-3.5 w-3.5 ${className}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="Smoovely QuickMove home"
    >
      <img
        src="/images/Hero Smoovely Logo Main.jpg"
        alt="Smoovely QuickMove"
        className="h-14 w-auto mix-blend-multiply sm:h-16 lg:h-20"
      />
      <span className="text-lg font-bold tracking-tight text-navy sm:text-xl">
        Smoovely <span className="text-green">QuickMove</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({}); // mobile sub-menu expansion
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={`relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-navy ${
                    isActive(link.href) ? "text-navy" : "text-slate-600"
                  }`}
                >
                  {link.label}
                  <Caret className="text-slate-400 transition-transform duration-200 group-hover:rotate-180" />
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-green"
                    />
                  )}
                </Link>

                {/* Hover dropdown (pt-2 keeps the hover area gap-free → no flicker) */}
                <div className="invisible absolute left-0 top-full z-50 min-w-[210px] pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-navy"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-navy ${
                  isActive(link.href) ? "text-navy" : "text-slate-600"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-green"
                  />
                )}
              </Link>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-green px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition-colors hover:bg-green/90"
            >
              Get Quote
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="text-navy lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.href}>
                    <div className="flex items-center">
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-slate-50 hover:text-navy ${
                          isActive(link.href) ? "text-navy" : "text-slate-600"
                        }`}
                      >
                        {link.label}
                      </Link>
                      {/* Click-based expansion on mobile */}
                      <button
                        type="button"
                        aria-label={`Expand ${link.label}`}
                        onClick={() =>
                          setExpanded((e) => ({
                            ...e,
                            [link.label]: !e[link.label],
                          }))
                        }
                        className="rounded-md p-2 text-slate-500 hover:text-navy"
                      >
                        <Caret
                          className={`transition-transform duration-200 ${
                            expanded[link.label] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {expanded[link.label] && (
                      <div className="ml-3 border-l border-slate-200 pl-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-navy"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-slate-50 hover:text-navy ${
                      isActive(link.href) ? "text-navy" : "text-slate-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-lg bg-green px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-green/90"
              >
                Get Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

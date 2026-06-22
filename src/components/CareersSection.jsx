"use client";

import { useState } from "react";

const roles = [
  { title: "Drivers", desc: "Multi-drop, removals and same-day routes." },
  { title: "Movers / Operatives", desc: "Careful, professional on-site handling." },
  { title: "Office / Admin", desc: "Coordination, scheduling and support." },
  { title: "Logistics Coordinators", desc: "Route planning and fleet operations." },
];

const whyUs = [
  "Structured, well-run operations",
  "Real growth opportunities",
  "Reliable working environment",
  "Team-focused culture",
];

const Check = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 h-5 w-5 shrink-0 text-green"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CareersSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="careers" className="scroll-mt-20 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Join the team
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Careers at Smoovely
          </h2>
          <p className="mt-4 text-slate-600">
            We&apos;re a growth-focused company with opportunities across
            logistics, removals and operations — come build your career with us.
          </p>
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* Roles + why us */}
          <div>
            <h3 className="text-lg font-semibold text-navy">Open role types</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h4 className="text-base font-semibold text-navy">
                    {role.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {role.desc}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-8 text-lg font-semibold text-navy">
              Why work with us
            </h3>
            <ul className="mt-4 space-y-3">
              {whyUs.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  {Check}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Apply form */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-semibold text-navy">How to apply</h3>
            <p className="mt-1 text-sm text-slate-600">
              Fill out the form below or contact us — we&apos;ll be in touch.
            </p>

            {sent ? (
              <div className="mt-6 rounded-xl border border-green/30 bg-green/10 p-5 text-center">
                <p className="font-semibold text-navy">Thanks for applying!</p>
                <p className="mt-1 text-sm text-slate-600">
                  We&apos;ve received your details and will be in touch soon.
                </p>
              </div>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Name
                    </span>
                    <input
                      required
                      className="w-full rounded-lg border border-slate-300 p-3 text-sm"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      className="w-full rounded-lg border border-slate-300 p-3 text-sm"
                      placeholder="you@email.com"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Phone
                    </span>
                    <input
                      type="tel"
                      className="w-full rounded-lg border border-slate-300 p-3 text-sm"
                      placeholder="07…"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Role of interest
                    </span>
                    <select className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm">
                      {roles.map((r) => (
                        <option key={r.title}>{r.title}</option>
                      ))}
                      <option>Other</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Upload CV (optional)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy/90"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-green px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90"
                >
                  Submit application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import ReferralsTable from "../../components/ReferralsTable";
import { MOCK_REFERRALS } from "../../lib/referralMockData";

/* ---------------------------------------------------------------------------
 * Referral management — INTERNAL admin-style page (Phase D).
 *
 * Read-only overview of referral records. No authentication yet, not linked in
 * public navigation, and noindex so it stays out of search. Renders mock data
 * today; swap MOCK_REFERRALS for a live "Smoovely Referrals" source later
 * without touching the table component.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Referrals",
  description: "Internal referral management.",
  alternates: { canonical: "/referrals" },
  robots: { index: false, follow: false },
};

export default function ReferralsPage() {
  return (
    <section className="bg-slate-50 py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-green">
            Internal · Phase D
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Referral Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Qualified opportunities converted into trackable partner referrals.
            Read-only foundation for referral and revenue tracking.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <ReferralsTable referrals={MOCK_REFERRALS} />
        </div>
      </div>
    </section>
  );
}

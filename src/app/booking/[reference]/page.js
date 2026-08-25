import PageHeader from "../../../components/PageHeader";
import Reveal from "../../../components/Reveal";
import CustomerTimeline from "../../../components/ops/CustomerTimeline";
import { JOURNEY_STAGES } from "../../../lib/operationsRecord";

/* ---------------------------------------------------------------------------
 * Customer Hub (Phase E, Feature 6). Shows the customer journey status for a
 * booking reference as a visual timeline. Status is illustrative for now — the
 * live stage will be driven by Microsoft Lists / Power Automate later; an
 * optional ?stage=<n> query previews progress. noindex, unlinked.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Your Booking",
  description: "Track the status of your Smoovely booking.",
  robots: { index: false, follow: false },
};

export default async function BookingHubPage({ params, searchParams }) {
  const { reference } = await params;
  const sp = (await searchParams) || {};
  const ref = decodeURIComponent(reference || "");

  // Optional ?stage=<n> preview; default to "Acceptance" in progress.
  const parsed = Number.parseInt(sp.stage, 10);
  const activeIndex = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, 0), JOURNEY_STAGES.length - 1)
    : 1;

  return (
    <>
      <PageHeader
        eyebrow="Your Booking"
        title={`Booking ${ref}`}
        subtitle="Follow your move from quote to completion — every step in one place."
      />
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-lg font-bold text-navy">Your journey</h2>
              <CustomerTimeline activeIndex={activeIndex} />
              <p className="mt-8 rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
                Live status updates are delivered as your move progresses. If you
                have any questions about booking {ref}, please contact our team.
              </p>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}

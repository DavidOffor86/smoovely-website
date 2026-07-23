import PageHeader from "../../components/PageHeader";
import WhatsNextSurvey from "../../components/WhatsNextSurvey";
import Reveal from "../../components/Reveal";

/* ---------------------------------------------------------------------------
 * What's Next — opportunity capture survey (Phase C).
 *
 * The navigation target for the "Continue" button on the feedback success
 * screen. A short, mobile-first survey (under 60 seconds) that captures the
 * customer's next step and routes qualified opportunities via /api/whats-next.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "What's Next",
  description:
    "Tell us about your next move and we'll help with your next step — it takes under a minute.",
  alternates: { canonical: "/whats-next" },
};

export default function WhatsNextPage() {
  return (
    <>
      <PageHeader
        eyebrow="What's Next"
        title="How can we help with your next step?"
        subtitle="A few quick questions — under a minute — so we can point you in the right direction."
      />

      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <WhatsNextSurvey />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}

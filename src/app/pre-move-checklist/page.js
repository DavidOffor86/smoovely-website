import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import PreMoveChecklistForm from "../../components/ops/PreMoveChecklistForm";

/* ---------------------------------------------------------------------------
 * Pre-Move Checklist page (Phase E, Features 3–5). Customer-specific utility
 * page — noindex, not linked in navigation.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Pre-Move Checklist",
  description: "Complete your pre-move checklist and check your move readiness.",
  alternates: { canonical: "/pre-move-checklist" },
  robots: { index: false, follow: false },
};

export default function PreMoveChecklistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pre-Move Checklist"
        title="Are you move-ready?"
        subtitle="A few quick questions help us make your move day run smoothly."
      />
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <PreMoveChecklistForm />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}

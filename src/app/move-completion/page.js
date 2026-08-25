import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import MoveCompletionForm from "../../components/ops/MoveCompletionForm";

/* ---------------------------------------------------------------------------
 * Move Completion page (Phase E, Features 8–10). Customer-specific utility page
 * — noindex, not linked in navigation.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Confirm Your Move",
  description: "Confirm your move is complete, sign off, or report an issue.",
  alternates: { canonical: "/move-completion" },
  robots: { index: false, follow: false },
};

export default function MoveCompletionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Move Completion"
        title="Confirm your move"
        subtitle="Let us know everything arrived safely and sign to complete your move."
      />
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <MoveCompletionForm />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}

import PageHeader from "../../components/PageHeader";
import FeedbackForm from "../../components/FeedbackForm";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Share Your Feedback",
  description:
    "Tell us how your Smoovely move went. Your feedback takes under two minutes and helps us keep improving our service.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        eyebrow="Feedback"
        title="How did we do?"
        subtitle="Your move is complete — we'd love to hear how it went. It takes under two minutes."
      />

      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <FeedbackForm />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}

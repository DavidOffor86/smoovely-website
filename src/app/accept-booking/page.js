import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import BookingAcceptanceForm from "../../components/ops/BookingAcceptanceForm";

/* ---------------------------------------------------------------------------
 * Booking Acceptance page (Phase E, Features 1 & 2). Customer-specific utility
 * page reached from a move pack / email — noindex, not linked in navigation.
 * ------------------------------------------------------------------------- */

export const metadata = {
  title: "Accept Your Booking",
  description: "Formally accept your Smoovely quotation and terms.",
  alternates: { canonical: "/accept-booking" },
  robots: { index: false, follow: false },
};

export default function AcceptBookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Booking Acceptance"
        title="Accept your booking"
        subtitle="Confirm your quotation and terms, and add your signature to secure your move."
      />
      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <BookingAcceptanceForm />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}

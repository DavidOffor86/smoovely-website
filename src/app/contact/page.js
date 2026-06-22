import PageHeader from "../../components/PageHeader";
import ContactForm from "../../components/ContactForm";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Smoovely for quotes, enquiries, or support. Email support@smoovelylogistics.com or send us a message.",
  alternates: { canonical: "/contact" },
};

const MailIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0 text-green"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
);

const PinIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0 text-green"
  >
    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact Us"
        subtitle="Get in touch with Smoovely for quotes, enquiries, or support."
      />

      <Reveal>
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
            {/* Contact details */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-navy">
                Get in touch
              </h2>
              <p className="mt-3 text-slate-600">
                Have a question or ready to book? Send us a message and our team
                will get back to you as soon as possible.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-green/10">
                    {MailIcon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-navy">Email</h3>
                    <a
                      href="mailto:support@smoovelylogistics.com"
                      className="mt-1 block text-sm text-slate-600 transition hover:text-green"
                    >
                      support@smoovelylogistics.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-green/10">
                    {PinIcon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-navy">
                      Registered office
                    </h3>
                    <address className="mt-1 text-sm not-italic leading-relaxed text-slate-600">
                      Smoovely Logistics Ltd
                      <br />
                      71–75 Shelton Street
                      <br />
                      Covent Garden
                      <br />
                      London WC2H 9JQ
                      <br />
                      United Kingdom
                    </address>
                    <p className="mt-2 text-xs text-slate-400">
                      Company No. 17221416
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}

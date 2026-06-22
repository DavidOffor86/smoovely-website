import PageHeader from "../../components/PageHeader";
import CareersSection from "../../components/CareersSection";
import FinalCTA from "../../components/FinalCTA";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Careers",
  description:
    "Join Smoovely QuickMove. Opportunities across logistics, removals and operations — drivers, movers, admin and coordinators.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build your career at Smoovely"
        subtitle="A growth-focused company with opportunities across logistics, removals and operations."
      />
      <Reveal>
        <CareersSection />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}

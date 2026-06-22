import PageHeader from "../../components/PageHeader";
import CaseStudiesSection from "../../components/CaseStudiesSection";
import FinalCTA from "../../components/FinalCTA";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Case Studies",
  description:
    "Real moves, real results — see how we handle luxury home moves, office relocations and time-critical logistics.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case Studies"
        title="Real moves, real results"
        subtitle="A look at how we handle complex, high-stakes moves from start to finish."
      />
      <Reveal>
        <CaseStudiesSection />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}

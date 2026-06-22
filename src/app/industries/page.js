import PageHeader from "../../components/PageHeader";
import IndustrySection from "../../components/IndustrySection";
import IndustrySectors from "../../components/IndustrySectors";
import CouncilServices from "../../components/CouncilServices";
import FinalCTA from "../../components/FinalCTA";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Industries",
  description:
    "Specialist moving and logistics support for estate agents and high net worth clients across the UK.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Specialist support for demanding sectors"
        subtitle="Tailored moving and logistics services designed around the way your industry works."
      />
      <Reveal>
        <IndustrySection />
      </Reveal>
      <Reveal>
        <IndustrySectors />
      </Reveal>
      <Reveal>
        <CouncilServices />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}

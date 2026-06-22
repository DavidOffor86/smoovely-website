import PageHeader from "../../components/PageHeader";
import SolutionsSection from "../../components/SolutionsSection";
import ServiceExpectations from "../../components/ServiceExpectations";
import OfficeMoveFlow from "../../components/OfficeMoveFlow";
import ServiceComponents from "../../components/ServiceComponents";
import StorageDetails from "../../components/StorageDetails";
import AdditionalServices from "../../components/AdditionalServices";
import LogisticsHeroEnhancement from "../../components/LogisticsHeroEnhancement";
import LogisticsUseCases from "../../components/LogisticsUseCases";
import LastMileExperience from "../../components/LastMileExperience";
import LogisticsStats from "../../components/LogisticsStats";
import FinalCTA from "../../components/FinalCTA";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Solutions",
  description:
    "Home removals, office moves, logistics, storage and clearance — premium moving solutions across the UK.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Moving solutions for every need"
        subtitle="One trusted partner for removals, logistics, storage and clearance — priced instantly, handled by professionals."
      />
      <Reveal>
        <SolutionsSection
          eyebrow="Our Solutions"
          title="Choose your service"
          subtitle="Every solution comes with transparent, upfront pricing and fully insured, professional handling."
        />
      </Reveal>
      <Reveal>
        <ServiceExpectations />
      </Reveal>
      <Reveal>
        <OfficeMoveFlow />
      </Reveal>
      <Reveal>
        <ServiceComponents />
      </Reveal>
      <Reveal>
        <StorageDetails />
      </Reveal>
      <Reveal>
        <AdditionalServices />
      </Reveal>
      <Reveal>
        <LogisticsHeroEnhancement />
      </Reveal>
      <Reveal>
        <LogisticsUseCases />
      </Reveal>
      <Reveal>
        <LastMileExperience />
      </Reveal>
      <Reveal>
        <LogisticsStats />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}

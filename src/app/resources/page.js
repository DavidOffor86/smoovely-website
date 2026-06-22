import PageHeader from "../../components/PageHeader";
import ResourceSection from "../../components/ResourceSection";
import FinalCTA from "../../components/FinalCTA";
import Reveal from "../../components/Reveal";

export const metadata = {
  title: "Resources",
  description:
    "Guides and insights to help you plan a faster, smoother move — removals, logistics, storage and more.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Guides & insights"
        subtitle="Expert advice to help you plan a faster, smoother, stress-free move."
      />
      <Reveal>
        <ResourceSection />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}

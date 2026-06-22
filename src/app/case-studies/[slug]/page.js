import { notFound } from "next/navigation";
import CaseStudy from "../../../components/CaseStudy";
import { caseStudies, getCaseStudy } from "../../../data/caseStudies";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return {
    title: study
      ? `${study.title} — Case Study | Smoovely QuickMove`
      : "Case Study — Smoovely QuickMove",
    description: study?.summary,
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  return <CaseStudy study={study} />;
}

import Hero from "../components/Hero";
import LogoCarousel from "../components/LogoCarousel";
import QuoteEntrySection from "../components/QuoteEntrySection";
import SolutionsSection from "../components/SolutionsSection";
import AreasSection from "../components/AreasSection";
import TestimonialsSection from "../components/TestimonialsSection";
import Features from "../components/Features";
import IndustrySection from "../components/IndustrySection";
import CaseStudiesSection from "../components/CaseStudiesSection";
import ResourceSection from "../components/ResourceSection";
import FAQSection from "../components/FAQSection";
import FinalCTA from "../components/FinalCTA";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoCarousel />
      <Reveal>
        <QuoteEntrySection />
      </Reveal>
      <Reveal>
        <SolutionsSection />
      </Reveal>
      <Reveal>
        <AreasSection />
      </Reveal>
      <Reveal>
        <TestimonialsSection />
      </Reveal>
      <Reveal>
        <Features />
      </Reveal>
      <Reveal>
        <IndustrySection preview />
      </Reveal>
      <Reveal>
        <CaseStudiesSection preview />
      </Reveal>
      <Reveal>
        <ResourceSection preview />
      </Reveal>
      <Reveal>
        <FAQSection />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  );
}

import MultiServicePlatform from "../../MultiServicePlatform";

export const metadata = {
  title: "Get a Quote",
  description:
    "Build your instant moving, logistics or storage quote in under 90 seconds.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return <MultiServicePlatform />;
}

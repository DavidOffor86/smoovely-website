export const caseStudies = [
  {
    slug: "luxury-4-5-bedroom-home-move",
    title: "Luxury 4–5 Bedroom Home Move",
    client: "Private client · Surrey",
    image: "/images/Luxury Home image1.jpg",
    summary:
      "A full white-glove relocation of a high-value family home, completed in a single day with zero damage.",
    challenge:
      "A high-net-worth family needed to relocate a fully furnished five-bedroom home — including fine art, a grand piano and a wine collection — within a tight 48-hour window before completion on their new property.",
    solution:
      "We assigned a dedicated move manager and an eight-person specialist crew, with bespoke crating for fragile and high-value items, climate-safe transport and a sequenced loading plan to protect both properties.",
    outcome:
      "The entire move was completed in one day, fully insured, with every item logged and delivered intact. The clients were unpacked and settled the same evening.",
    before:
      "An overwhelming, high-pressure move with irreplaceable items and an immovable deadline.",
    after:
      "A calm, fully managed relocation finished ahead of schedule — with nothing left to chance.",
    highlights: [
      "8-person specialist crew + dedicated move manager",
      "Custom crating for art, piano and wine collection",
      "Full goods-in-transit insurance",
      "Completed in a single day, ahead of deadline",
    ],
  },
  {
    slug: "city-office-relocation",
    title: "City Office Relocation — 120 Staff",
    client: "Financial services firm · London",
    image: "/images/City image- Office Move.jpeg",
    summary:
      "A weekend office move for 120 employees with zero Monday-morning downtime.",
    challenge:
      "A growing financial firm needed to move 120 workstations, server equipment and confidential files across London without disrupting trading hours.",
    solution:
      "We planned a phased weekend move with colour-coded labelling, secure IT handling and a structured floor plan so every desk was ready to use on arrival.",
    outcome:
      "Staff walked into a fully operational office on Monday morning — no downtime, no lost equipment, no disruption to clients.",
    before:
      "A complex, high-risk move with sensitive data and a hard no-downtime requirement.",
    after:
      "A seamless weekend transition with every workstation live for Monday.",
    highlights: [
      "Phased weekend schedule",
      "Secure IT and confidential file handling",
      "Colour-coded desk-to-desk system",
      "Zero business downtime",
    ],
  },
  {
    slug: "same-day-multi-drop-logistics",
    title: "Same-Day Multi-Drop Logistics",
    client: "E-commerce retailer · Essex & Kent",
    image: "/images/Logistics Unloading.jpeg",
    summary:
      "Urgent same-day multi-drop delivery of time-sensitive stock across two counties.",
    challenge:
      "A retailer faced a supplier failure and needed 40 urgent deliveries completed across Essex and Kent the same day to avoid breaching customer SLAs.",
    solution:
      "We dispatched a coordinated fleet with optimised routing and live tracking, prioritising the tightest delivery windows first.",
    outcome:
      "All 40 drops were completed before close of business, protecting the retailer's customer relationships and SLAs.",
    before:
      "A supply-chain emergency threatening dozens of customer commitments.",
    after:
      "Every order delivered on time, same day, with full tracking visibility.",
    highlights: [
      "Coordinated same-day fleet",
      "Optimised multi-drop routing",
      "Live tracking across all drops",
      "40/40 deliveries on time",
    ],
  },
  {
    slug: "urgent-eviction-move-support",
    title: "Urgent Move — Landlord & Tenant Eviction Support",
    client: "Lettings agent · Greater London",
    image: "/images/BEFORE AND AFTER - LANDLORD EVICTION NOTICE.1.jpg",
    imageFit: "contain",
    summary:
      "A last-minute eviction handled with same-day packing, transport and storage — under intense time pressure.",
    challenge:
      "A tenant faced a court-ordered eviction with less than 24 hours' notice. A full flat needed packing, removing and storing immediately, with no time to plan and nowhere for the belongings to go.",
    solution:
      "We mobilised a crew the same morning, supplied all packing materials on arrival, and carefully boxed and inventoried every item. Belongings were transported straight to a secure storage unit booked on a flexible short-term contract.",
    outcome:
      "The property was cleared and handed back on time, the tenant's possessions were safely stored and fully insured, and the landlord regained the property without dispute or delay.",
    before:
      "A high-stress, no-notice eviction with no plan and a hard legal deadline.",
    after:
      "A calm, fully managed same-day relocation with belongings secured in storage.",
    highlights: [
      "Same-day crew mobilisation",
      "Packing materials supplied on arrival",
      "Flexible short-term secure storage",
      "Fully insured, completed on deadline",
    ],
  },
];

export function getCaseStudy(slug) {
  return caseStudies.find((study) => study.slug === slug);
}

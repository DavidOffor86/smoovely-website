/* ---------------------------------------------------------------------------
 * Resource / guide articles for the Resources section + /resources/[slug].
 *
 * Each entry carries both the card fields (slug, title, excerpt, image, tag,
 * readTime) AND the full article (intro + sections + takeaways) rendered by
 * <ResourceArticle>. Sections are { heading, paragraphs[], list?[] }.
 * ------------------------------------------------------------------------- */

export const resources = [
  {
    slug: "move-house-quickly-london",
    title: "How to Move House Quickly in London",
    excerpt:
      "Practical, proven steps to organise a fast, smooth house move anywhere in the capital.",
    image: "/images/1st Draft - Smoovely  Best Day to Move.jpg",
    tag: "Removals",
    readTime: "5 min read",
    intro:
      "Moving home in London comes with challenges you won't find anywhere else — controlled parking zones, narrow streets, flats with no lift, and tight completion deadlines. With the right plan, a London move can still be fast and stress-free. Here's how to get it done quickly without cutting corners.",
    sections: [
      {
        heading: "1. Lock in a date and work backwards",
        paragraphs: [
          "Speed starts with a plan. Fix your moving date as early as possible, then work backwards to schedule packing, cleaning, and handover. Mid-week and mid-month slots are usually cheaper and easier to book than month-end Fridays, when most tenancies and completions land.",
          "If your date is flexible, tell your removals company — they can often offer a better rate and an earlier slot for a quieter day.",
        ],
      },
      {
        heading: "2. Declutter before you pack",
        paragraphs: [
          "The single fastest way to speed up a move is to move less. Every box you don't pack is time and money saved on labour and van space.",
        ],
        list: [
          "Sort room by room into keep, donate, sell, and recycle",
          "Book a clearance or charity collection for bulky unwanted items",
          "Clear lofts, sheds and under-stair cupboards early — they hide the most",
        ],
      },
      {
        heading: "3. Get the van size and crew right first time",
        paragraphs: [
          "Underestimating volume is the most common cause of a slow move — a second trip can add hours. As a rough London guide: a 1-bed flat suits a medium van and 2 movers; a 2–3 bed home usually needs a Luton van and 2–3 movers; larger homes need multiple crew.",
          "An accurate quote up front means the right vehicle and team turn up on the day, so everything is loaded in one go.",
        ],
      },
      {
        heading: "4. Sort parking, permits and access in advance",
        paragraphs: [
          "This is where London moves are won or lost. If the removal van can't park close to the door, the crew spends longer carrying — and you pay for it.",
        ],
        list: [
          "Check if your street is a Controlled Parking Zone (CPZ) and arrange a suspended bay or dispensation with the council if needed",
          "Confirm ULEZ compliance for the route — most professional fleets already are",
          "Book the lift in advance for flats, and warn the crew about stairs, narrow doorways or long carries",
          "Note any one-way streets or width restrictions near both addresses",
        ],
      },
      {
        heading: "5. Pack smart and label by room",
        paragraphs: [
          "Use proper moving boxes rather than bags — they stack, protect your belongings and load faster. Label every box with its destination room and a one-line summary of contents so the crew can place it straight away and you're not hunting for essentials later.",
          "Pack a clearly marked 'first-night' box (chargers, toiletries, kettle, bedding) so you don't have to unpack everything on day one.",
        ],
      },
      {
        heading: "6. Let professionals handle the heavy lifting",
        paragraphs: [
          "A trained, fully insured crew with the right equipment — dollies, straps and protective blankets — will clear a property in a fraction of the time it takes to do it yourself, and your belongings stay protected throughout. For a genuinely quick move, this is the step that makes the biggest difference.",
        ],
      },
    ],
    takeaways: [
      "Book early and pick a mid-week, mid-month slot where possible",
      "Declutter first — less to move is faster and cheaper",
      "Get an accurate quote so the right van and crew arrive once",
      "Sort parking, permits and lift access before moving day",
      "Label boxes by room and pack a first-night essentials box",
    ],
  },
  {
    slug: "what-to-expect-professional-removals",
    title: "What to Expect from a Professional Removal Company",
    excerpt:
      "From quote to moving day — exactly what a professional, fully insured removals team delivers.",
    image: "/images/Guide to Successful delivery1.jpg",
    tag: "Guides",
    readTime: "4 min read",
    intro:
      "Hiring a removals company should take stress off your plate, not add to it. Knowing what a professional service actually includes helps you compare quotes properly and spot the difference between a reliable mover and a risky cheap quote. Here's what to expect at each stage.",
    sections: [
      {
        heading: "A clear quote and a proper survey",
        paragraphs: [
          "A reputable company gives you a transparent, itemised quote — not a vague figure. For larger moves they'll carry out a survey (in person or via video/photos) to assess volume, access and any special items.",
          "The quote should clearly state what's included: labour, vehicle, mileage, packing, and any access surcharges, so there are no surprises on the day.",
        ],
      },
      {
        heading: "Insurance and accreditation",
        paragraphs: [
          "This is the most important thing to check. A professional mover carries proper cover and can show it.",
        ],
        list: [
          "Goods-in-transit insurance — covers your belongings while being moved",
          "Public liability insurance — covers accidental damage to property",
          "Clear terms on claims, valuation and any high-value item cover",
        ],
      },
      {
        heading: "Packing and materials",
        paragraphs: [
          "Whether you pack yourself or use a full packing service, a good company supplies professional-grade materials — sturdy boxes, bubble wrap, tape and wardrobe cartons. Fragile and high-value items get extra protection, and full packing services are fully insured when the team packs for you.",
        ],
      },
      {
        heading: "Moving day: a prepared, uniformed crew",
        paragraphs: [
          "On the day, expect a punctual, professional crew who protect floors and doorways, wrap furniture, and load methodically. They'll handle the heavy lifting with the right equipment and keep you informed throughout.",
        ],
        list: [
          "Furniture wrapped and protected before it leaves the property",
          "Careful, planned loading to keep everything secure in transit",
          "An inventory or check of items for larger or insured moves",
        ],
      },
      {
        heading: "Delivery, placement and reassembly",
        paragraphs: [
          "At the destination, a professional team doesn't just dump boxes by the door — they place them in the right rooms and reassemble any furniture they dismantled. You should be settled in far faster than doing it alone.",
        ],
      },
      {
        heading: "Transparent pricing, no hidden fees",
        paragraphs: [
          "The final invoice should match the agreed quote, with any extras discussed and approved in advance. Clear communication from first contact to final delivery is the hallmark of a company worth booking.",
        ],
      },
    ],
    takeaways: [
      "Insist on goods-in-transit and public liability insurance",
      "Expect an itemised quote, not a vague all-in figure",
      "Professional packing uses proper materials and is fully insured",
      "A good crew protects, wraps, places and reassembles — not just lifts",
      "The final price should match the quote, with no surprise fees",
    ],
  },
  {
    slug: "same-day-vs-scheduled-logistics",
    title: "Same Day Delivery vs Scheduled Logistics",
    excerpt:
      "Which option fits your needs? We break down speed, cost and reliability for each.",
    image: "/images/Next Day Image - Smoovely.jpg",
    tag: "Logistics",
    readTime: "6 min read",
    intro:
      "Not every delivery is equal. Some need to be there within hours; others are part of a planned, repeatable schedule where cost and consistency matter more than raw speed. Choosing the right model saves money and avoids missed deadlines. Here's how same-day and scheduled logistics compare.",
    sections: [
      {
        heading: "What is same-day (dedicated) delivery?",
        paragraphs: [
          "Same-day or dedicated delivery means a vehicle is assigned to your consignment and goes directly from collection to destination — no depots, no sorting, no other drops. It's the fastest option and ideal when timing is critical.",
        ],
        list: [
          "Urgent or time-critical goods",
          "Medical, regulated or sensitive items",
          "High-value shipments that can't risk delay or handling",
        ],
      },
      {
        heading: "What is scheduled logistics?",
        paragraphs: [
          "Scheduled logistics covers planned deliveries — next-day, fixed-day, or recurring routes such as multi-drop and palletised distribution. Consignments are routed efficiently alongside others, which keeps the per-delivery cost down.",
          "It's the backbone of retail restocking, B2B distribution and any operation that ships regularly to known destinations.",
        ],
      },
      {
        heading: "Speed",
        paragraphs: [
          "Same-day wins on speed every time — delivery within hours, often with a tight window. Scheduled logistics trades immediacy for planning: next-day or a booked slot, which is more than fast enough for most regular shipments.",
        ],
      },
      {
        heading: "Cost",
        paragraphs: [
          "Dedicated same-day delivery costs more because you're paying for an entire vehicle and driver on demand. Scheduled and multi-drop logistics spread vehicle and route costs across several consignments, so the unit cost is significantly lower — the right choice when speed isn't the priority.",
        ],
      },
      {
        heading: "Reliability and tracking",
        paragraphs: [
          "Both can be highly reliable with the right provider. Same-day offers the most control — one driver, one job, direct contact and live updates. Scheduled services rely on good route planning and tracking to hit their windows consistently. Either way, accurate ETAs and proactive notifications are what separate a dependable service from a frustrating one.",
        ],
      },
      {
        heading: "Which should you choose?",
        paragraphs: [
          "Choose same-day when a delay has real consequences — deadlines, perishables, medical or high-value goods. Choose scheduled logistics for predictable, cost-efficient delivery of regular or bulk consignments. Many businesses use both: scheduled for the routine, same-day for the exceptions.",
        ],
      },
    ],
    takeaways: [
      "Same-day = a dedicated vehicle, fastest, best for critical goods",
      "Scheduled = planned/multi-drop routes, lower cost per delivery",
      "Pay a premium for speed only when timing genuinely matters",
      "Reliability comes from tracking and accurate ETAs, not just speed",
      "Most businesses blend both: routine scheduled, exceptions same-day",
    ],
  },
  {
    slug: "top-tips-office-relocations",
    title: "Top Tips for Office Relocations",
    excerpt:
      "Plan a seamless office relocation with zero downtime using our expert checklist.",
    image: "/images/Van outside building.jpeg",
    tag: "Business",
    readTime: "5 min read",
    intro:
      "An office move is a logistics project, not just a removal. Done well, your team is back up and running with minimal disruption; done badly, you lose days of productivity. These are the steps that keep a commercial relocation on schedule and downtime close to zero.",
    sections: [
      {
        heading: "1. Start planning early",
        paragraphs: [
          "Office moves need a longer runway than home moves. Begin planning weeks — ideally months — ahead, with a clear timeline covering lease dates, IT, furniture, and the moving window itself. Early planning gives you room to phase the move and avoid last-minute costs.",
        ],
      },
      {
        heading: "2. Appoint a move coordinator",
        paragraphs: [
          "Put one person (or a small team) in charge of the relocation, working with a dedicated move manager from your removals partner. A single point of contact keeps decisions fast and nothing falls through the cracks.",
        ],
      },
      {
        heading: "3. Audit and declutter before you pack",
        paragraphs: [
          "A move is the perfect time to clear redundant furniture, archive old files and retire end-of-life equipment. Less to move means a faster, cheaper relocation.",
        ],
        list: [
          "Inventory furniture, IT and equipment and flag what's no longer needed",
          "Securely dispose of or shred confidential documents",
          "Arrange clearance and responsible recycling of unwanted assets",
        ],
      },
      {
        heading: "4. Plan IT and server relocation carefully",
        paragraphs: [
          "Technology is the highest-risk part of any office move. Plan the managed disconnection, transport and reconnection of servers, network kit and workstations in advance, and back up critical data before anything is unplugged.",
          "Coordinate with your IT team or provider so systems are tested and live before staff return.",
        ],
      },
      {
        heading: "5. Move out of hours to protect productivity",
        paragraphs: [
          "Scheduling the move for evenings or a weekend means staff leave one office on Friday and arrive at a working one on Monday. Out-of-hours and phased moves are the key to keeping business downtime to a minimum.",
        ],
      },
      {
        heading: "6. Communicate and update your details",
        paragraphs: [
          "Keep staff informed with clear timelines and what's expected of them (e.g. packing their own desks). Externally, update your address everywhere it appears.",
        ],
        list: [
          "Website, Google Business Profile and social channels",
          "Invoices, email signatures and printed stationery",
          "Clients, suppliers, banks and service providers",
        ],
      },
    ],
    takeaways: [
      "Treat the move as a project with a timeline and a coordinator",
      "Declutter and securely dispose of redundant assets first",
      "Plan IT/server disconnection and reconnection in detail",
      "Move out of hours or in phases to avoid business downtime",
      "Update your address everywhere and keep staff informed",
    ],
  },
];

/** Look up a single guide by slug (used by /resources/[slug]). */
export function getResource(slug) {
  return resources.find((r) => r.slug === slug);
}

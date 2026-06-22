/* ---------------------------------------------------------------------------
 * Single source of truth for the homepage FAQ.
 *
 * Used in two places:
 *   1. <FAQSection> — renders the accordion UI.
 *   2. <FAQSection> — emits FAQPage JSON-LD structured data so Google can show
 *      these Q&As as rich results / "People also ask" entries.
 *
 * SEO note: each question is phrased as a real search query (long-tail), and
 * answers lead with the answer + a relevant keyword (removals, logistics,
 * storage, man and van, office move, UK) so they double as featured-snippet
 * candidates. Keep answers factual and concise (1–3 sentences).
 * ------------------------------------------------------------------------- */

export const faqs = [
  {
    q: "How much does a removal or moving service cost?",
    a: "The cost of a move depends on the size of your property, the distance, access at both ends and any extras like packing or storage. Most home removals start from a few hundred pounds — build a free, no-obligation quote in under 90 seconds to see a transparent, itemised price for your postcode.",
  },
  {
    q: "How quickly can you arrange a move?",
    a: "In most areas we can arrange a move within 24–48 hours, and same-day slots are often available when you book early in the day. Build a quote to see the soonest dates available for your postcode.",
  },
  {
    q: "Do you offer same-day delivery and last-minute moves?",
    a: "Yes. Same-day delivery, last-minute removals and urgent logistics are available across all major regions we cover, subject to crew availability at the time of booking. Booking early in the day gives you the best chance of a same-day slot.",
  },
  {
    q: "Which areas of the UK do you cover?",
    a: "We provide removals, logistics and storage across the UK, including London and the South East, the Midlands, the North and major cities nationwide. We also handle long-distance and inter-city moves — enter your pickup and delivery postcodes in the quote tool to confirm coverage and pricing.",
  },
  {
    q: "Are your removal and logistics services insured?",
    a: "Every job is fully insured as standard, covering goods in transit and public liability, so your belongings are protected from the moment we load to the moment we unload. Higher-value and specialist items can be covered with additional bespoke insurance on request.",
  },
  {
    q: "Do you provide packing services and materials?",
    a: "Yes. We offer full and part packing services with professional-grade boxes, wrapping, bubble wrap and protective materials, plus specialist packing for fragile and high-value items. You can add packing to your quote, or pack yourself and we'll handle the loading and transport.",
  },
  {
    q: "Can you move fragile, high-value or specialist items?",
    a: "Absolutely. We regularly move antiques, fine art, pianos, wine collections and other high-value or awkward items using custom crating, blanket wrapping and trained specialist crews. Let us know the details in your quote and we'll plan the safest handling and transport.",
  },
  {
    q: "Do you handle office relocations and commercial moves?",
    a: "Yes — we run dedicated office and commercial relocations with out-of-hours and weekend scheduling to minimise business downtime, plus IT, server and furniture handling. We assign a move coordinator for larger commercial projects to keep everything on schedule.",
  },
  {
    q: "Do you provide storage solutions?",
    a: "We offer flexible short- and long-term storage in secure, monitored facilities, with options to combine storage and removals into a single, transparent quote. Storage units range from a few boxes up to full multi-bedroom households or commercial stock.",
  },
  {
    q: "Do you offer a man and van service for small moves?",
    a: "Yes. For single items, small flats or light loads we offer a cost-effective man and van service, scaling up to multi-van crews for larger homes and offices. The quote tool automatically recommends the right van size and crew for your load.",
  },
  {
    q: "How far in advance should I book my move?",
    a: "For the widest choice of dates we recommend booking 1–2 weeks ahead, especially for month-end and weekend slots which fill quickly. That said, we keep capacity for short-notice and same-day jobs, so it's always worth checking availability for your date.",
  },
  {
    q: "Do you require a deposit, and how do I pay?",
    a: "A small deposit secures your booking and slot, with the balance due on or before completion of the move. We accept major payment methods and provide a clear, itemised quote upfront so there are no hidden fees or surprises on the day.",
  },
  {
    q: "What is your cancellation and rescheduling policy?",
    a: "Plans change — you can reschedule your move free of charge with reasonable notice, and cancellation terms are set out clearly in your booking confirmation. Contact our team as early as possible and we'll do our best to accommodate new dates.",
  },
  {
    q: "Do you offer house and site clearance services?",
    a: "Yes. We provide home, office and site clearance with responsible recycling and disposal, ideal for end-of-tenancy, probate, downsizing and renovation projects. Clearance can be booked on its own or combined with a removal or storage booking in one quote.",
  },
];

import { prices, type Price } from "@/content/prices";
import { site } from "@/content/site";

/** Text for each product's sales page. Prices come from prices.ts. */
export type Product = {
  eyebrow: string;
  title: string;
  intro: string;
  includesTitle: string;
  includes: string[];
  price: Price;
  priceLabel: string;
  priceNotes: string[];
  cta: { label: string; href: string; external?: boolean };
  ctaNote?: string;
};

// Buying is built in Phase 4. Until then, "Buy" buttons go to the login page.
const buyHref = "/login";

export const products = {
  webinar: {
    eyebrow: "Live webinar",
    title: "Webinar with Pragy",
    intro: "A live online session with me. Learn what to work on first for your body and your look, and ask me your questions live.",
    includesTitle: "What you get",
    includes: [
      "A live session with me",
      "The schedule and private meeting link in your dashboard, right after payment",
      "Questions answered live",
    ],
    price: prices.webinar,
    priceLabel: "Webinar seat",
    priceNotes: site.nextWebinar
      ? [`Next session: ${site.nextWebinar.date}, ${site.nextWebinar.time}.`]
      : ["The next date will be announced soon."],
    cta: { label: site.nextWebinar ? "Book my seat" : "Log in to get notified", href: buyHref },
  },

  pdfCourse: {
    eyebrow: "Self-paced course",
    title: "PDF Course",
    intro: "My entry-level looksmaxing guide, read inside a secure viewer on your phone or laptop.",
    includesTitle: "What you get",
    includes: [
      "My full PDF course",
      "Access right after payment, in your private dashboard",
      "30 days of access from the day you buy",
    ],
    price: prices.pdfCourse,
    priceLabel: "One-time payment",
    priceNotes: ["30 days of access.", "Read on this website only. Downloading is not available."],
    cta: { label: "Get the PDF course", href: buyHref },
  },

  videoCourse: {
    eyebrow: "Video course + community",
    title: "Video Course + Community",
    intro: "My full video course and my Skool community, plus member-only extras on this website.",
    includesTitle: "What you get",
    includes: [
      "My full video course",
      "Access to my Skool community",
      "A Community Member badge on this website, which unlocks extra material",
    ],
    price: prices.videoCourse,
    priceLabel: "Course + community",
    priceNotes: ["You join and pay on Skool."],
    cta: site.skoolUrl
      ? { label: "Join on Skool", href: site.skoolUrl, external: true }
      : { label: "Joining opens soon", href: "/#courses" },
  },

  teamCall: {
    eyebrow: "Still confused?",
    title: "Not sure where to start?",
    intro: "Talk to my team. They look at your goal and tell you exactly where you should begin.",
    includesTitle: "On the call",
    includes: [
      "My team points you to the right place: which course or plan fits you",
      "Not joining? Money back, refunded in full",
      "Joining? It counts: the call fee comes off the price",
    ],
    price: prices.teamCall,
    priceLabel: "Discovery call",
    priceNotes: ["100% refundable if you decide not to join.", "If you join, it comes off the price."],
    cta: { label: "Book my call", href: buyHref },
    ctaNote: "Pick your time slot, then pay.",
  },

  consultation: {
    eyebrow: "Talk to me directly",
    title: "1-on-1 call with me",
    intro: "Book a private 30-minute call with me and get direct advice for your situation.",
    includesTitle: "What you get",
    includes: [
      "A private call, just you and me",
      "Pick your time slot, then pay",
      "Advice for your body, routine and goal",
    ],
    price: prices.consultation,
    priceLabel: "1-on-1 call · 30 min",
    priceNotes: ["A one-time call. Every person books it once.", "This call is not refundable."],
    cta: { label: "Book my 1-on-1 call", href: buyHref },
    ctaNote: "Pick your time slot, then pay.",
  },
} satisfies Record<string, Product>;

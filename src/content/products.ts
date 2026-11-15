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
    intro: "A live online session with Pragy. Learn what to work on first for your body and your look, and ask your questions live.",
    includesTitle: "What you get",
    includes: [
      "A live session with Pragy",
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
    intro: "The entry-level looksmaxing guide by Pragy, read inside our secure viewer on your phone or laptop.",
    includesTitle: "What you get",
    includes: [
      "The full PDF course by Pragy",
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
    intro: "The full video course and Pragy’s Skool community, plus member-only extras on this website.",
    includesTitle: "What you get",
    includes: [
      "The full video course",
      "Access to the Skool community",
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
    eyebrow: "Not sure which plan?",
    title: "Talk to the team",
    intro: "A short call where Pragy’s team explains how the coaching works and which plan fits your goal.",
    includesTitle: "On the call",
    includes: [
      "You tell us your goal and where you are today",
      "We explain Premium, Elite and Diamond in plain words",
      "You leave knowing which plan suits you, with no pressure",
    ],
    price: prices.teamCall,
    priceLabel: "Call with the team",
    priceNotes: [
      "Fully adjusted in your plan if you join.",
      "If you decide not to join, you get a full refund of the call fee.",
    ],
    cta: { label: "Book the call", href: buyHref },
    ctaNote: "Pick your time slot, then pay.",
  },

  consultation: {
    eyebrow: "Just need advice?",
    title: "30 minutes with Pragy",
    intro: "One call with Pragy to explain exactly what you need to do to get good results. No plan to join, no commitment.",
    includesTitle: "On the call",
    includes: [
      "I look at where you are and what matters most for your body and your look",
      "I explain what you need to do, step by step, to get good results",
      "You ask me anything, and leave with a clear direction",
    ],
    price: prices.consultation,
    priceLabel: "1:1 consultation · 30 min",
    priceNotes: ["A one-time call. Every person books it once.", "This call is not refundable."],
    cta: { label: "Book the consultation", href: buyHref },
    ctaNote: "Pick your time slot, then pay.",
  },
} satisfies Record<string, Product>;

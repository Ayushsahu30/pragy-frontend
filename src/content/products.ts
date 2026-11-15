import { prices, type Price } from "@/content/prices";
import { site } from "@/content/site";

/** Text for each product's sales page. Prices come from prices.ts. */
export type Product = {
  /** Browser tab title. */
  metaTitle: string;
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
const team = `₹${prices.teamCall.amount}`;

export const products = {
  // Reached only from ad links; not linked from the landing page.
  webinar: {
    metaTitle: "Webinar with Pragy",
    eyebrow: "Live webinar",
    title: "Webinar with Pragy",
    intro: "A live online session with me. Learn what to work on first for your appearance, and ask me your questions live.",
    includesTitle: "What you get",
    includes: [
      "A live session with me",
      "The schedule and private meeting link in your dashboard, right after payment",
      "Questions answered live",
    ],
    price: prices.webinar,
    priceLabel: "Webinar seat",
    priceNotes: [
      site.nextWebinar
        ? `Next session: ${site.nextWebinar.date}, ${site.nextWebinar.time}.`
        : "The next date will be announced soon.",
      "Non-refundable, unless the webinar is cancelled.",
    ],
    cta: { label: site.nextWebinar ? "Book my seat" : "Log in to get notified", href: buyHref },
  },

  pdfCourse: {
    metaTitle: "PDF Course: The Starter Guide",
    eyebrow: "01 — The Starter Guide",
    title: "PDF Course",
    intro: "A practical introduction to my approach to maximizing your looks.",
    includesTitle: "What you get",
    includes: [
      "Structured educational guide",
      "Learn at your own pace",
      "Read inside your private course dashboard",
      "30-day access",
    ],
    price: prices.pdfCourse,
    priceLabel: "The Starter Guide",
    priceNotes: ["Course access is unlocked in your private dashboard after successful payment.", "Non-refundable."],
    cta: { label: "Get the Starter Guide", href: buyHref },
  },

  videoCourse: {
    metaTitle: "Video Course + Community",
    eyebrow: "02 — The Complete Experience",
    title: "Video Course + Community",
    intro: "Go beyond reading. Learn through detailed video lessons and become part of the community.",
    includesTitle: "What you get",
    includes: [
      "Full video course",
      "Structured educational modules",
      "Access to my Skool community",
      "Member-only resources and extras",
      "Learn at your own pace",
    ],
    price: prices.videoCourse,
    priceLabel: "The Complete Experience",
    priceNotes: ["Course access is unlocked in your private dashboard after successful payment.", "Non-refundable."],
    cta: site.skoolUrl
      ? { label: "Join the Community", href: site.skoolUrl, external: true }
      : { label: "Join the Community", href: buyHref },
  },

  teamCall: {
    metaTitle: "Discovery session",
    eyebrow: "Not sure where to start?",
    title: "Let’s figure that out first.",
    intro:
      "Not everyone needs the same approach. Book a discovery session with my team. We’ll understand your goals, assess where you currently stand and help you identify the right course or coaching option.",
    includesTitle: "In the session",
    includes: [
      "Discuss your appearance goals.",
      "Understand which areas need attention.",
      "Get a recommendation on where to start.",
    ],
    price: prices.teamCall,
    priceLabel: "Discovery session",
    priceNotes: [
      "100% refundable if you decide not to join.",
      `If you decide to join one of our programmes, your ${team} payment is adjusted against the programme price.`,
      "If you decide not to proceed, you receive a full refund. Ask for it on WhatsApp within 15 days of booking.",
    ],
    cta: { label: "Book Your Discovery Session", href: buyHref },
    ctaNote: "Pick your time slot, then pay.",
  },

  consultation: {
    metaTitle: "Private consultation with Pragy",
    eyebrow: "Direct access to Pragy",
    title: "Want my personal advice?",
    intro:
      "Sometimes you don’t need an entire coaching programme. You just need an experienced perspective on your current situation. Book a private 30-minute consultation with me.",
    includesTitle: "During the session, we can discuss",
    includes: [
      "Your current physique and appearance goals.",
      "Your skincare, grooming and lifestyle routine.",
      "Areas you want to improve.",
      "What I would prioritise in your situation.",
      "Your next steps.",
    ],
    price: prices.consultation,
    priceLabel: "30 minutes · Private 1-on-1 session",
    priceNotes: [
      "This session is non-refundable. If you’re unsure whether you need personal guidance, start with the refundable discovery session.",
    ],
    cta: { label: "Book a Private Session", href: buyHref },
    ctaNote: "Pick your time slot, then pay.",
  },
} satisfies Record<string, Product>;

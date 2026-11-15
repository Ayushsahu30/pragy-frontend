/**
 * Brand details used across the website.
 * Empty strings are details the client has not sent yet: sections that
 * need them hide the missing part, so nothing broken shows on the live site.
 */
export const site = {
  name: "Pragy",
  description:
    "One on one looksmaxing coaching with Pragy: fat loss, weight gain, gym training, diet, skincare, grooming and posture.",

  instagram: {
    handle: "itspragygurjar",
    url: "https://www.instagram.com/itspragygurjar/",
  },

  /** Numbers shown in the hero. Empty ones are hidden. */
  stats: {
    followers: "150K+",
    clientsCoached: "", // TODO(client): e.g. "500+"
    countries: "", // TODO(client): e.g. "12"
  },

  /** Team WhatsApp number, country code first, digits only, e.g. "919876543210". */
  whatsappNumber: "", // TODO(client)

  /** Details for the contact and legal pages. */
  supportEmail: "", // TODO(client)
  businessName: "", // TODO(client): registered business name
  businessAddress: "", // TODO(client)
  courtCity: "", // TODO(client): city for legal disputes

  /** Link to the Skool community, for the ₹3,000 video course. */
  skoolUrl: "", // TODO(client)

  /**
   * The next scheduled webinar. `null` hides the webinar date everywhere.
   * From Phase 4 this comes from the admin dashboard instead of this file.
   */
  nextWebinar: null as { date: string; time: string } | null,

  copyrightYear: 2026,
};

/** Main menu. Links start with "/" so they also work from other pages. */
export const navLinks = [
  { href: "/#trainer", label: "About Pragy" },
  { href: "/#results", label: "Results" },
  { href: "/#courses", label: "Courses" },
  { href: "/#one-on-one", label: "Consultation" },
  { href: "/#personal-training", label: "Personal training" },
  { href: "/#faq", label: "FAQ" },
];

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/contact", label: "Contact" },
];

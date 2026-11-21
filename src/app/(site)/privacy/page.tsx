import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";
import { orPlaceholder } from "@/lib/format";

export const metadata: Metadata = { title: "Privacy Policy" };

// DRAFT: to be reviewed by a lawyer before launch (India's DPDP Act 2023).
export default function PrivacyPage() {
  const business = orPlaceholder(site.businessName, "Business name");
  const email = orPlaceholder(site.supportEmail, "Support email");

  return (
    <LegalPage title="Privacy Policy" updated={site.legalUpdated}>
      <p>
        This policy explains what personal data {business} (“we”, “us”) collects through this website, why we collect
        it, and how you can control it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> your name, email address and phone number, and your Google account’s name
          and email if you sign in with Google.
        </li>
        <li>
          <strong>Personal training applications:</strong> your name, age, email, height and weight.
        </li>
        <li>
          <strong>Purchases and bookings:</strong> what you bought, when, and the time of any call you booked.
        </li>
        <li>
          <strong>Payments:</strong> payments are processed by Razorpay. We do not see or store your card number, UPI
          PIN or CVV.
        </li>
        <li>
          <strong>Usage data:</strong> pages visited, the device and browser used, and how you reached the website,
          through analytics and advertising tools.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To create your account and log you in</li>
        <li>To give you access to what you bought, and to stop accounts being shared</li>
        <li>To schedule calls and contact you about your coaching</li>
        <li>To send receipts, reminders and, if you agreed, marketing messages</li>
        <li>To understand which pages and ads work, and to improve the website</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        Only with the services that run this website: payment processing (Razorpay), call booking (Cal.com and Google
        Calendar), email delivery (Resend), sign-in (Google), hosting (Vercel and Railway), analytics and advertising
        (Google Analytics and Meta). We do not sell your data.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account data while your account is active. If you ask us to delete your account, we delete your
        personal data within 30 days, except payment and invoice records, which we keep for as long as Indian tax and
        accounting law requires.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your data, or withdraw consent to marketing messages, by writing to{" "}
        {email}.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies to keep you logged in and, with your consent, to measure visits and ads. You can block cookies in
        your browser, but logging in will not work without them.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: {email}. See also our <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}

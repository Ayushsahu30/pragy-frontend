import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";
import { orPlaceholder } from "@/lib/format";

export const metadata: Metadata = { title: "Terms & Conditions" };

// DRAFT: to be reviewed by a lawyer before launch.
export default function TermsPage() {
  const business = orPlaceholder(site.businessName, "Business name");
  const email = orPlaceholder(site.supportEmail, "Support email");
  const city = orPlaceholder(site.courtCity, "City");

  return (
    <LegalPage title="Terms & Conditions" updated={site.legalUpdated}>
      <p>
        These terms apply when you use this website or buy anything from {business}, an individual based in{" "}
        {site.businessAddress}. By creating an account or making a purchase, you agree to them.
      </p>

      <h2>What we offer</h2>
      <p>
        Looksmaxing education and coaching: courses, a webinar, calls and personal training. Everything is delivered
        online; nothing is shipped. Details and prices are shown on each product’s page, and how and when you get access
        is explained in our <Link href="/shipping-policy">Shipping &amp; Delivery Policy</Link>.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>An account is for one person. It can be active on one device at a time.</li>
        <li>Logging in on a new device logs out the previous one.</li>
        <li>You are responsible for the details you give us being correct.</li>
      </ul>

      <h2>Use of our content</h2>
      <p>
        Courses and materials are for your personal use only. You may not copy, record, share, resell or publish them.
        We may close an account that shares content, without a refund.
      </p>

      <h2>Payments</h2>
      <p>
        Prices are in Indian rupees, and the price shown is the full amount you pay. Payments are processed securely by
        Razorpay.
      </p>

      <h2>Refunds</h2>
      <p>
        Refunds follow our <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>Results and health</h2>
      <p>
        Results differ from person to person and are not guaranteed. Our guidance is not medical advice. Check with a
        doctor before changing your diet or exercise, especially if you have a health condition.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, our total liability for any claim is limited to the amount you paid for the
        product the claim is about.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Disputes are handled by the courts of {city}.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: {email}.</p>
    </LegalPage>
  );
}

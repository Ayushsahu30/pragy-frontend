import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { prices } from "@/content/prices";
import { site } from "@/content/site";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "How and when you get access to the courses, webinar, calls and coaching you buy. Everything is delivered online.",
};

// DRAFT: to be reviewed by a lawyer before launch.
export default function ShippingPolicyPage() {
  const whatsappUrl = `https://wa.me/${site.whatsappNumber}`;

  return (
    <LegalPage title="Shipping & Delivery Policy" updated={site.legalUpdated}>
      <p>
        Everything we sell is digital or online: courses, a webinar, video calls and coaching. <strong>Nothing is
        shipped</strong>, so there are no shipping charges and no physical delivery.
      </p>
      <p>
        After a successful payment you receive a confirmation email, and what you bought appears in{" "}
        <strong>My account</strong> on this website, under the email address you paid with.
      </p>

      <h2>When you get access</h2>
      <ul>
        <li>
          <strong>Webinar ({formatINR(prices.webinar.amount)}):</strong> your seat is confirmed right after payment.
          The date, time and joining link are shown in My account and sent by email. The webinar itself takes place
          online on the scheduled date.
        </li>
        <li>
          <strong>PDF course ({formatINR(prices.pdfCourse.amount)}):</strong> available right after payment, to read
          on this website for 30 days. It is not sent as a file.
        </li>
        <li>
          <strong>Video course and community ({formatINR(prices.videoCourse.amount)}):</strong> provided on our
          community platform (Skool). You get access there as soon as you join.
        </li>
        <li>
          <strong>Discovery session ({formatINR(prices.teamCall.amount)}) and private consultation (
          {formatINR(prices.consultation.amount)}):</strong> your booking is confirmed right after payment. The date,
          time and Google Meet link are sent by email and calendar invite, and shown in My account. The call takes place
          online at the booked time.
        </li>
        <li>
          <strong>Personal coaching plans:</strong> your plan starts after payment. My team contacts you on WhatsApp or
          email within 2 working days to begin.
        </li>
      </ul>

      <h2>If you do not receive access</h2>
      <p>
        Check your spam folder first, and make sure you are logged in with the same email address you paid with. If you
        still cannot see your purchase within 24 hours, message us on WhatsApp at{" "}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          +{site.whatsappNumber}
        </a>{" "}
        or email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> with your payment details, and we will
        sort it out.
      </p>

      <h2>Cancellations and refunds</h2>
      <p>
        See our <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>Who provides these services</h2>
      <p>
        {site.businessName}, {site.businessType}, {site.businessAddress}.
      </p>
    </LegalPage>
  );
}

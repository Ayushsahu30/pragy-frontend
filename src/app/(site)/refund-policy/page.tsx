import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { prices, ptPlans } from "@/content/prices";
import { site } from "@/content/site";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = { title: "Refund Policy" };

/** Number of days after booking in which the discovery session can be refunded. */
const refundWindowDays = 15;

export default function RefundPolicyPage() {
  const team = formatINR(prices.teamCall.amount);
  const whatsappUrl = `https://wa.me/${site.whatsappNumber}`;

  return (
    <LegalPage title="Refund Policy" updated="[Date]">
      <p>
        Only the {team} discovery session can be refunded. Every other purchase is final, except a webinar that we
        cancel.
      </p>

      <h2>{team} discovery session: refundable</h2>
      <ul>
        <li>If you decide not to join a programme, you get a full refund of the {team}.</li>
        <li>
          You must ask for the refund on WhatsApp within {refundWindowDays} days of booking the session. Requests after{" "}
          {refundWindowDays} days are not accepted.
        </li>
        <li>If you join a programme, the {team} is adjusted against the programme price instead of refunded.</li>
      </ul>

      <h2>Webinar: refunded only if cancelled</h2>
      <p>
        Webinar seats are not refundable. If we cancel a webinar, everyone who paid for it gets a full refund
        automatically.
      </p>

      <h2>Everything else: no refund</h2>
      <p>The following are not refundable once paid:</p>
      <ul>
        <li>The {formatINR(prices.consultation.amount)} private consultation with Pragy</li>
        <li>The {formatINR(prices.pdfCourse.amount)} PDF course</li>
        <li>The {formatINR(prices.videoCourse.amount)} video course and community</li>
        <li>Personal coaching plans ({ptPlans.map((plan) => plan.name).join(", ")})</li>
      </ul>

      <h2>How to ask for a refund</h2>
      <p>
        Message us on WhatsApp at{" "}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          +{site.whatsappNumber}
        </a>{" "}
        with the email address on your account and the date you booked the discovery session.
      </p>

      <h2>How refunds are paid</h2>
      <p>
        Approved refunds go back to the original payment method. Banks usually take 5 to 7 working days to show the
        money in your account.
      </p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { prices } from "@/content/prices";
import { site } from "@/content/site";
import { formatINR, orPlaceholder } from "@/lib/format";

export const metadata: Metadata = { title: "Refund Policy" };

// DRAFT: lines marked "[confirm]" need the client's decision before launch.
export default function RefundPolicyPage() {
  const email = orPlaceholder(site.supportEmail, "Support email");
  const team = formatINR(prices.teamCall.amount);

  return (
    <LegalPage title="Refund Policy" updated="[Date]">
      <p>This page explains when you can get your money back.</p>

      <h2>{team} call with the team</h2>
      <ul>
        <li>If you join a personal training plan, the {team} is fully adjusted in your plan price.</li>
        <li>If you decide not to join, you get a full refund of the call fee.</li>
      </ul>

      <h2>{formatINR(prices.consultation.amount)} consultation with Pragy</h2>
      <p>This call is not refundable once booked. [confirm: rules for rescheduling or missed calls]</p>

      <h2>PDF course and video course</h2>
      <p>[confirm] Digital courses are not refundable once access has been given.</p>

      <h2>Webinar</h2>
      <p>[confirm] If a webinar is cancelled by us, you get a full refund.</p>

      <h2>Personal training plans</h2>
      <p>[confirm: refund rules for Premium, Elite and Diamond plans]</p>

      <h2>How refunds are paid</h2>
      <p>
        Approved refunds go back to the original payment method. Banks usually take 5 to 7 working days to show the
        money in your account.
      </p>

      <h2>Ask for a refund</h2>
      <p>Write to {email} with the email address on your account and what you bought.</p>
    </LegalPage>
  );
}

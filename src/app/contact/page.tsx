import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";
import { orPlaceholder } from "@/lib/format";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalPage title="Contact" updated="[Date]">
      <p>We usually reply within one working day.</p>

      <h2>Email</h2>
      <p>{site.supportEmail ? <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> : "[Support email]"}</p>

      <h2>WhatsApp</h2>
      <p>
        {site.whatsappNumber ? (
          <a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
            +{site.whatsappNumber}
          </a>
        ) : (
          "[WhatsApp number]"
        )}
      </p>

      <h2>Instagram</h2>
      <p>
        <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
          @{site.instagram.handle}
        </a>
      </p>

      <h2>YouTube</h2>
      <p>
        <a href={site.youtube.url} target="_blank" rel="noopener noreferrer">
          @{site.youtube.handle}
        </a>
      </p>

      <h2>Business details</h2>
      <p>
        {orPlaceholder(site.businessName, "Business name")}
        <br />
        {orPlaceholder(site.businessAddress, "Business address")}
      </p>
    </LegalPage>
  );
}

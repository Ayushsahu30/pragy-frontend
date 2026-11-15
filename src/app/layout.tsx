import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { site } from "@/content/site";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

// Heading font
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body font
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Full site address, used to build absolute links for the link preview image.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pragy-frontend-zeta.vercel.app"),
  title: {
    default: `${site.name} | ${site.tagline.replace(/\.$/, "")}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-[17px] leading-[1.6] text-ink">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader user={user} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

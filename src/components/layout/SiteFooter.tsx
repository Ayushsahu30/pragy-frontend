import Link from "next/link";
import { InstagramIcon, ShieldIcon, YouTubeIcon } from "@/components/icons";
import { legalLinks, site } from "@/content/site";

export default function SiteFooter() {
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach";

  return (
    <footer className="bg-ink px-6 pb-10 pt-14 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-x-14 gap-y-7">
          <div className="flex flex-col gap-2">
            <div className="font-serif text-[34px] font-semibold leading-[1.1]">{site.name}</div>
            <p className="m-0 max-w-[320px] text-[15px] text-mist">
              {site.tagline} {site.motto}
            </p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 inline-flex w-fit items-center gap-2 rounded py-2 text-[15px] font-medium text-white no-underline hover:text-peach ${focus}`}
            >
              <InstagramIcon />@{site.instagram.handle}
            </a>
            <a
              href={site.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-fit items-center gap-2 rounded py-2 text-[15px] font-medium text-white no-underline hover:text-peach ${focus}`}
            >
              <YouTubeIcon />
              YouTube: @{site.youtube.handle}
            </a>
            <a
              href={`mailto:${site.supportEmail}`}
              className={`inline-flex w-fit items-center gap-2 rounded py-2 text-[15px] font-medium text-white no-underline hover:text-peach ${focus}`}
            >
              {site.supportEmail}
            </a>
          </div>
          <nav aria-label="Legal">
            <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-1 p-0 text-[15px] font-medium">
              {[{ href: "/#courses", label: "Courses" }, ...legalLinks].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`inline-block rounded py-3 text-white no-underline hover:text-peach ${focus}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="m-0 flex max-w-[640px] items-start gap-3 rounded-2xl bg-ink-deep p-4 text-sm text-mist">
          <ShieldIcon className="mt-0.5 flex-none text-peach" />
          My team and I never ask for your OTP, UPI PIN or card CVV. Pay only through this website.
        </p>

        <div className="border-t border-ink-deep pt-6 text-sm text-mist">
          © {site.copyrightYear} {site.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

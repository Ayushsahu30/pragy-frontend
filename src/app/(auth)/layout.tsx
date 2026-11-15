import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/**
 * Split screen for log in, sign up and the profile step (from the design canvas):
 * brown panel with Pragy's photo on the left, the form on the right.
 * On phones the panel shrinks to a slim bar with the name.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white lg:flex-row">
      <aside className="flex flex-col gap-10 bg-ink px-6 py-5 text-white lg:w-[46%] lg:max-w-[640px] lg:justify-between lg:px-[clamp(24px,4vw,64px)] lg:py-10">
        <Link
          href="/"
          className="w-fit rounded font-serif text-[30px] font-semibold leading-none text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach"
        >
          {site.name}
        </Link>
        <div className="relative hidden min-h-[280px] flex-1 overflow-hidden rounded-b-[28px] rounded-t-[220px] bg-ink-deep lg:block">
          <Image
            src="/images/meet-pragy-main-photo.jpg"
            alt="Pragy in front of a palace"
            fill
            sizes="(min-width: 1024px) 560px, 0px"
            className="object-cover"
            style={{ objectPosition: "50% 40%" }}
            preload
          />
        </div>
        <div className="hidden flex-col gap-3 lg:flex">
          <p className="m-0 font-serif text-[34px] font-medium italic leading-[1.15]">{site.tagline}</p>
          <p className="m-0 text-[15px] text-mist">Log in to see your courses, calls and member material.</p>
        </div>
      </aside>

      <main id="main" className="flex flex-1 items-start justify-center px-6 py-10 sm:items-center sm:py-12">
        {children}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import AccountButton from "@/components/layout/AccountButton";
import { buttonClass } from "@/components/ui";
import { navLinks, site } from "@/content/site";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        className="mx-auto flex min-h-[68px] max-w-[1200px] items-center justify-between gap-3 rounded-full border border-line bg-cream/95 py-2.5 pl-6 pr-2.5 shadow-[0_8px_24px_rgba(72,60,50,0.06)] backdrop-blur"
      >
        <Link href="/" className={`rounded font-serif text-[30px] font-semibold leading-none text-ink no-underline ${focus}`}>
          {site.name}
        </Link>

        <ul className="m-0 hidden list-none gap-6 p-0 text-[15px] xl:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`rounded py-3 text-ink-soft no-underline hover:text-ink ${focus}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-none items-center gap-2">
          {/* max-md:hidden (not "hidden md:inline-flex"), because buttonClass already sets inline-flex */}
          <Link href="/#start" className={buttonClass("dark", "min-h-[48px] px-6 max-md:hidden")}>
            Book a call
          </Link>
          <AccountButton />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-12 w-12 flex-none items-center justify-center rounded-full border border-line bg-white text-ink xl:hidden ${focus}`}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-[1200px] rounded-[28px] border border-line bg-cream p-3 shadow-[0_16px_40px_rgba(72,60,50,0.12)] xl:hidden"
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-2xl px-4 py-3.5 text-base font-medium text-ink no-underline hover:bg-white ${focus}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#start" onClick={() => setMenuOpen(false)} className={buttonClass("dark", "mt-2 w-full")}>
            Book a call
          </Link>
        </div>
      )}
    </header>
  );
}

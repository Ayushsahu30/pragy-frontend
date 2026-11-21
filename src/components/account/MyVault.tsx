"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { accountApi, formatSize, type VaultItem, vaultFileHref } from "@/lib/account";

/**
 * Dashboard section: bonus files for members. The backend only sends the
 * files this user's active access allows.
 */
export default function MyVault({ sectionTitle, isMember }: { sectionTitle: string; isMember: boolean }) {
  const [items, setItems] = useState<VaultItem[] | null>(null);

  useEffect(() => {
    accountApi.vault().then(
      (r) => setItems(r.items),
      () => setItems([]),
    );
  }, []);

  return (
    <section id="vault" aria-labelledby="dash-vault" className="flex scroll-mt-6 flex-col gap-4">
      <h2 id="dash-vault" className={sectionTitle}>
        Members&apos; vault
      </h2>
      {!items ? (
        <p className="m-0 text-[15px] text-ink-soft">Loading…</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-field bg-white px-6 py-8 text-center">
          <h3 className="m-0 font-serif text-[26px] font-medium">{isMember ? "Bonus files are on their way" : "For members only"}</h3>
          <p className="m-0 max-w-[440px] text-[15px] text-ink-soft">
            {isMember
              ? "Extra guides and checklists for your course will appear here."
              : "Extra guides and checklists unlock when you buy a course."}
          </p>
          {!isMember && (
            <Link href="/#courses" className={buttonClass("dark", "min-h-[50px] px-5")}>
              Browse courses
            </Link>
          )}
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 p-0">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 rounded-3xl border border-line bg-white p-6">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-rust">Bonus file</p>
              <h3 className="m-0 font-serif text-[24px] font-medium leading-[1.15]">{item.title}</h3>
              {item.description && <p className="m-0 text-sm text-ink-soft">{item.description}</p>}
              <a href={vaultFileHref(item.id)} download className={buttonClass("outline", "mt-auto min-h-[46px] bg-white px-5")}>
                Download · {formatSize(item.sizeBytes)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

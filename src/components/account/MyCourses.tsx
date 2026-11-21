"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { products } from "@/content/products";
import { ApiError } from "@/lib/auth";
import { courseApi, type CourseInfo } from "@/lib/payments";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

type State = { kind: "loading" } | { kind: "none" } | { kind: "preparing" } | { kind: "active"; info: CourseInfo };

/** Dashboard section: the courses the user can open, with their access dates. */
export default function MyCourses({ sectionTitle }: { sectionTitle: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    courseApi.info().then(
      (info) => setState({ kind: "active", info }),
      (e: unknown) =>
        setState(e instanceof ApiError && e.code === "COURSE_NOT_READY" ? { kind: "preparing" } : { kind: "none" }),
    );
  }, []);

  return (
    <section id="courses" aria-labelledby="dash-courses" className="flex scroll-mt-6 flex-col gap-4">
      <h2 id="dash-courses" className={sectionTitle}>
        My courses
      </h2>

      {state.kind === "loading" ? (
        <p className="m-0 text-[15px] text-ink-soft">Loading…</p>
      ) : state.kind === "none" ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-field bg-white px-6 py-8 text-center">
          <h3 className="m-0 font-serif text-[28px] font-medium leading-[1.15]">No courses yet</h3>
          <p className="m-0 max-w-[420px] text-[15px] text-ink-soft">Courses you buy appear here with their access period.</p>
          <Link href="/#courses" className={buttonClass("dark", "min-h-[50px] px-5")}>
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
          <article className="flex flex-col gap-3.5 rounded-3xl border border-line bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-rust">PDF course</p>
                <h3 className="m-0 mt-0.5 font-serif text-[28px] font-medium leading-[1.15]">{products.pdfCourse.priceLabel}</h3>
              </div>
              <span className="flex-none rounded-full bg-peach px-3 py-1 text-xs font-semibold">Active</span>
            </div>
            {state.kind === "preparing" ? (
              <p className="m-0 text-sm text-ink-soft">The course is being prepared and will open here soon.</p>
            ) : (
              <>
                <p className="m-0 text-[15px] text-ink-soft">
                  {state.info.endsAt ? `Access until ${dateFormat.format(new Date(state.info.endsAt))}` : "Access does not expire"}
                  {" · "}
                  {state.info.lastPage > 1 ? `Continue from page ${state.info.lastPage} of ${state.info.pageCount}` : `${state.info.pageCount} pages`}
                </p>
                <Link href="/courses/pdf" className={buttonClass("dark", "mt-auto min-h-[50px] px-5")}>
                  {state.info.lastPage > 1 ? "Continue reading" : "Start reading"}
                </Link>
              </>
            )}
          </article>
        </div>
      )}
    </section>
  );
}

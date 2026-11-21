"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui";
import { products } from "@/content/products";
import { ApiError } from "@/lib/auth";
import { courseApi, type CourseInfo } from "@/lib/payments";
import { refreshSession, useSession } from "@/lib/session";

const ZOOMS = [0.75, 1, 1.25, 1.5, 2];
const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
const control =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-[#5a4c40] bg-transparent px-3 font-sans text-sm font-semibold text-white hover:bg-[#5a4c40] disabled:cursor-default disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peach";

/**
 * The protected PDF course reader. Each page arrives from the backend as a
 * picture with the buyer's email on it and is drawn on a canvas, so there is
 * no PDF or image file to save. A phone camera or screenshot cannot be
 * stopped; the watermark shows who shared it.
 */
export default function PdfReader() {
  const router = useRouter();
  const session = useSession();
  const [info, setInfo] = useState<CourseInfo | null>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<ApiError | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cache = useRef(new Map<number, Promise<Blob>>());

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/login?next=${encodeURIComponent("/courses/pdf")}`);
  }, [session.status, router]);

  const fail = useCallback((e: unknown) => {
    const apiError = e instanceof ApiError ? e : new ApiError("UNKNOWN", "Something went wrong. Please reload the page.", 0);
    if (["NOT_SIGNED_IN", "SIGNED_IN_ELSEWHERE"].includes(apiError.code)) void refreshSession();
    setError(apiError);
  }, []);

  // Access, page count and the last page read.
  useEffect(() => {
    if (session.status !== "signed-in") return;
    courseApi.info().then((i) => {
      setInfo(i);
      setPage(i.lastPage);
    }, fail);
  }, [session.status, fail]);

  /** A page's picture, kept for a moment so going back and forth is quick. */
  const fetchPage = useCallback((n: number) => {
    let blob = cache.current.get(n);
    if (!blob) {
      blob = courseApi.page(n);
      blob.catch(() => cache.current.delete(n));
      cache.current.set(n, blob);
      if (cache.current.size > 4) cache.current.delete(cache.current.keys().next().value!);
    }
    return blob;
  }, []);

  // Draw the current page, then get the next one ready.
  useEffect(() => {
    if (!info) return;
    let current = true;
    fetchPage(page)
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        const canvas = canvasRef.current;
        if (!current || !canvas) return;
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
        bitmap.close();
        setLoadingPage(false);
        if (page < info.pageCount) fetchPage(page + 1).catch(() => undefined);
      })
      .catch((e: unknown) => current && fail(e));
    // Remember the page, a moment after the reader stops on it.
    const timer = setTimeout(() => courseApi.saveProgress(page).catch(() => undefined), 1500);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [info, page, fetchPage, fail]);

  const goTo = useCallback(
    (n: number) => {
      if (!info) return;
      const next = Math.min(Math.max(n, 1), info.pageCount);
      if (next === page) return;
      setLoadingPage(true);
      setPage(next);
      window.scrollTo({ top: 0 });
    },
    [info, page],
  );

  // Arrow keys turn pages; save and print shortcuts are blocked.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["p", "s", "c", "a", "u"].includes(key)) {
        e.preventDefault();
        return;
      }
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") goTo(page + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") goTo(page - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, page]);

  const zoomIndex = ZOOMS.indexOf(zoom);
  const title = products.pdfCourse.priceLabel;

  return (
    <div
      className="flex min-h-dvh select-none flex-col bg-cream print:hidden"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-ink px-4 py-3 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard#courses"
            aria-label="Back to My account"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-white no-underline hover:bg-[#5a4c40] focus-visible:outline-2 focus-visible:outline-peach"
          >
            <ArrowRightIcon className="rotate-180" />
          </Link>
          <div className="min-w-0">
            <h1 className="m-0 truncate font-serif text-[22px] font-medium leading-tight">{title}</h1>
            {info?.endsAt && (
              <p className="m-0 text-xs text-[#e9e1d8]">Access until {dateFormat.format(new Date(info.endsAt))}</p>
            )}
          </div>
        </div>

        {info && (
          <div className="flex items-center gap-2">
            <button type="button" className={control} onClick={() => setZoom(ZOOMS[zoomIndex - 1])} disabled={zoomIndex <= 0} aria-label="Zoom out">
              −
            </button>
            <span className="w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              className={control}
              onClick={() => setZoom(ZOOMS[zoomIndex + 1])}
              disabled={zoomIndex >= ZOOMS.length - 1}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        )}
      </header>

      <main id="main" className="flex flex-1 flex-col items-center gap-4 overflow-x-auto px-3 py-6 sm:px-6">
        {error ? (
          <div role="alert" className="mt-10 flex max-w-[480px] flex-col items-center gap-4 text-center">
            <p className="m-0 font-serif text-[30px] font-medium leading-tight">
              {error.code === "NO_ACCESS" ? "This course is locked." : "The course could not open."}
            </p>
            <p className="m-0 text-ink-soft">{error.message}</p>
            {error.code === "NO_ACCESS" ? (
              <Link href="/pdf-course" className={buttonClass("dark")}>
                Get the course
              </Link>
            ) : (
              <Link href="/dashboard" className={buttonClass("outline")}>
                Back to My account
              </Link>
            )}
          </div>
        ) : !info ? (
          <p className="mt-10 text-ink-soft">Opening the course…</p>
        ) : (
          <>
            <div className="relative w-full" style={{ maxWidth: `${Math.round(900 * zoom)}px` }}>
              <canvas
                ref={canvasRef}
                aria-label={`Page ${page} of ${info.pageCount}`}
                role="img"
                className="block h-auto w-full rounded-lg bg-white shadow-[0_8px_30px_rgba(72,60,50,0.12)]"
              />
              {loadingPage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70 text-ink-soft">
                  Loading page…
                </div>
              )}
            </div>

            <nav aria-label="Pages" className="sticky bottom-3 flex items-center gap-3 rounded-full bg-ink px-3 py-2 text-white shadow-lg">
              <button type="button" className={control} onClick={() => goTo(page - 1)} disabled={page <= 1}>
                Previous
              </button>
              <span role="status" className="min-w-24 text-center text-sm tabular-nums">
                Page {page} of {info.pageCount}
              </span>
              <button type="button" className={control} onClick={() => goTo(page + 1)} disabled={page >= info.pageCount}>
                Next
              </button>
            </nav>
          </>
        )}
      </main>
    </div>
  );
}

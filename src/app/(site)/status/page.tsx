import type { Metadata } from "next";
import BackendStatus from "@/components/BackendStatus";

export const metadata: Metadata = {
  title: "System status",
  robots: { index: false },
};

// Developer check page (from Phase 1): shows whether the backend and database answer.
export default function StatusPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-[28px] border border-line bg-cream p-6">
        <div>
          <h1 className="m-0 font-serif text-[36px] font-medium">System status</h1>
          <p className="m-0 mt-1 text-sm text-ink-soft">This page asks the backend if it is running.</p>
        </div>
        <BackendStatus />
      </div>
    </section>
  );
}

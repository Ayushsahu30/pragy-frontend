import BackendStatus from "@/components/BackendStatus";

// Phase 1 test page. It is replaced by the real landing page in Phase 2.
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Project setup check
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            This page asks the backend if it is running.
          </p>
        </div>
        <BackendStatus />
      </div>
    </main>
  );
}

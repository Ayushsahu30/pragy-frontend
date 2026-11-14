"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";

type Health = {
  status: string;
  message: string;
  database: "connected" | "not_configured" | "error";
  time: string;
};

type State =
  | { kind: "loading" }
  | { kind: "ok"; health: Health }
  | { kind: "failed" };

const databaseLabel: Record<Health["database"], string> = {
  connected: "Connected",
  not_configured: "Not set up yet",
  error: "Cannot reach the database",
};

/** Calls the backend from the browser and shows whether it answered. */
export default function BackendStatus() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/health`, { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return response.json() as Promise<Health>;
      })
      .then((health) => setState({ kind: "ok", health }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ kind: "failed" });
      });

    return () => controller.abort();
  }, []);

  return (
    <dl className="w-full divide-y divide-zinc-200 rounded-lg border border-zinc-200 text-left text-sm dark:divide-zinc-800 dark:border-zinc-800">
      <Row label="Backend address" value={API_URL} />
      <Row
        label="Backend"
        value={
          state.kind === "loading"
            ? "Checking…"
            : state.kind === "ok"
              ? state.health.message
              : "Not reachable"
        }
        tone={
          state.kind === "ok" ? "good" : state.kind === "failed" ? "bad" : "none"
        }
      />
      <Row
        label="Database"
        value={state.kind === "ok" ? databaseLabel[state.health.database] : "—"}
        tone={
          state.kind !== "ok"
            ? "none"
            : state.health.database === "connected"
              ? "good"
              : state.health.database === "error"
                ? "bad"
                : "none"
        }
      />
    </dl>
  );
}

function Row({
  label,
  value,
  tone = "none",
}: {
  label: string;
  value: string;
  tone?: "good" | "bad" | "none";
}) {
  const color =
    tone === "good"
      ? "text-green-700 dark:text-green-400"
      : tone === "bad"
        ? "text-red-700 dark:text-red-400"
        : "text-zinc-900 dark:text-zinc-100";

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className={`break-all text-right font-medium ${color}`}>{value}</dd>
    </div>
  );
}

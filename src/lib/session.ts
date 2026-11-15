"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ApiError, authApi, type PublicUser } from "@/lib/auth";

/** Who is logged in, shared by the header, login pages and dashboard. */
export type SessionState =
  | { status: "loading" }
  | { status: "signed-in"; user: PublicUser }
  /** `reason: "elsewhere"` = logged out because the account was used on another device. */
  | { status: "signed-out"; reason?: "elsewhere" };

const LOADING: SessionState = { status: "loading" };
let state: SessionState = LOADING;
let started = false;
const listeners = new Set<() => void>();

function setState(next: SessionState) {
  state = next;
  listeners.forEach((listener) => listener());
}

/** Asks the backend who is logged in. */
export async function refreshSession(): Promise<SessionState> {
  try {
    const { user } = await authApi.me();
    setState({ status: "signed-in", user });
  } catch (error) {
    const elsewhere = error instanceof ApiError && error.code === "SIGNED_IN_ELSEWHERE";
    setState(elsewhere ? { status: "signed-out", reason: "elsewhere" } : { status: "signed-out" });
  }
  return state;
}

export function setSignedIn(user: PublicUser) {
  started = true;
  setState({ status: "signed-in", user });
}

export async function signOut() {
  try {
    await authApi.logout();
  } finally {
    setState({ status: "signed-out" });
  }
}

/** Current login state. Checks with the backend once per page load. */
export function useSession(): SessionState {
  const current = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => LOADING,
  );

  useEffect(() => {
    if (started) return;
    started = true;
    void refreshSession();
  }, []);

  return current;
}

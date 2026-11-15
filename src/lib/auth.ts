/**
 * Talks to the backend's login API. Calls go to /api/... on this website,
 * which forwards them to the backend (see next.config.ts), so the login
 * cookie belongs to this website's address.
 */

export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  marketingConsent: boolean;
  role: "USER" | "ADMIN";
  /** True until name and phone are filled in. */
  needsProfile: boolean;
};

/** An error from the backend, with a message that can be shown as-is. */
export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
    readonly retryAfterSeconds?: number,
    readonly attemptsLeft?: number,
  ) {
    super(message);
  }
}

/** Calls the backend through /api and turns errors into ApiError. */
export async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("NETWORK", "We can't reach the server. Check your connection and try again.", 0);
  }

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (response.ok) return body as T;

  // Input errors come back as a list of messages; show the first one.
  const raw = body?.message;
  const message = Array.isArray(raw) ? String(raw[0]) : typeof raw === "string" ? raw : "Something went wrong. Please try again.";
  throw new ApiError(
    typeof body?.code === "string" ? body.code : `HTTP_${response.status}`,
    message,
    response.status,
    typeof body?.retryAfterSeconds === "number" ? body.retryAfterSeconds : undefined,
    typeof body?.attemptsLeft === "number" ? body.attemptsLeft : undefined,
  );
}

export const authApi = {
  requestCode: (email: string) =>
    call<{ ok: true }>("/auth/email/request-code", { method: "POST", body: JSON.stringify({ email }) }),

  verifyCode: (email: string, code: string) =>
    call<{ user: PublicUser }>("/auth/email/verify", { method: "POST", body: JSON.stringify({ email, code }) }),

  me: () => call<{ user: PublicUser }>("/auth/me"),

  updateProfile: (input: { name?: string; phone?: string; marketingConsent?: boolean }) =>
    call<{ user: PublicUser }>("/auth/profile", { method: "PATCH", body: JSON.stringify(input) }),

  logout: () => call<{ ok: true }>("/auth/logout", { method: "POST" }),

  /** Which login methods are switched on. */
  options: () => call<{ google: boolean }>("/auth/options"),
};

/** Messages for the ?error=... codes the backend adds when Google sign-in fails. */
export const googleErrors: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled. Try again, or use your email below.",
  google_failed: "We couldn't sign you in with Google. Please try again, or use your email below.",
  google_unavailable: "Google sign-in isn't available right now. Please use your email below.",
  google_busy: "Too many sign-in attempts. Please wait a few minutes and try again.",
};

/**
 * Where to send the user after login. Only paths on this website are
 * allowed, so a link like /login?next=https://evil.example can't redirect away.
 */
export function safeNext(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

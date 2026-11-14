/**
 * Address of the backend API.
 * Set NEXT_PUBLIC_API_URL in .env.local (local) or in the hosting dashboard (live).
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");

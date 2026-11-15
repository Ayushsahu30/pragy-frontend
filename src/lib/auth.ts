export type CurrentUser = {
  name: string;
  email: string;
};

/**
 * Returns the logged-in user, or null when nobody is logged in.
 *
 * Login does not exist yet, so this always returns null and the header
 * shows "Log in". Phase 3 replaces this with a real session check
 * against the backend; the header already handles both cases.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  return null;
}

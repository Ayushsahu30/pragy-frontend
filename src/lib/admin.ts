import { call } from "@/lib/auth";

/** Admin API. The backend checks the admin role on every call. */

export type AdminOverview = {
  totalUsers: number;
  newThisWeek: number;
  marketingOptIns: number;
  profileMissing: number;
  admins: number;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  marketingConsent: boolean;
  google: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export type AdminUserPage = { total: number; page: number; pageSize: number; users: AdminUser[] };

export const adminApi = {
  overview: () => call<AdminOverview>("/admin/overview"),

  users: (search: string, page: number) => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    return call<AdminUserPage>(`/admin/users?${params.toString()}`);
  },
};

import type { NextConfig } from "next";

// Where /api/... calls are forwarded. Locally the backend on port 4000; on
// Vercel set API_PROXY_TARGET (or NEXT_PUBLIC_API_URL) to the Railway address.
const backendUrl = (process.env.API_PROXY_TARGET ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(
  /\/+$/,
  "",
);

/** The real website address, e.g. https://acenshun.com (no slash at the end). */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

/** The address the site had before the domain was bought. */
const OLD_VERCEL_HOST = "pragy-frontend-zeta.vercel.app";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The browser only ever talks to this website. Login calls to /api/... are
  // passed on to the backend, so the login cookie is set on this website's
  // own address (browsers block cookies between two different sites).
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }];
  },
  // Once NEXT_PUBLIC_SITE_URL is the real domain, visitors of the old Vercel
  // address are sent there, keeping the page they asked for. Logins only work
  // on one address (Google returns to it), so everyone should use the same one.
  async redirects() {
    if (!siteUrl || new URL(siteUrl).hostname.endsWith(".vercel.app")) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: OLD_VERCEL_HOST }],
        destination: `${siteUrl}/:path*`,
        permanent: false,
      },
    ];
  },
  // Only the live site may appear in search results. Vercel sets VERCEL_ENV to
  // "preview" for staging.acenshun.com and other test copies of the site.
  async headers() {
    if (process.env.VERCEL_ENV === "production") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;

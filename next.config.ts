import type { NextConfig } from "next";

// Where /api/... calls are forwarded. Locally the backend on port 4000; on
// Vercel set API_PROXY_TARGET (or NEXT_PUBLIC_API_URL) to the Railway address.
const backendUrl = (process.env.API_PROXY_TARGET ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(
  /\/+$/,
  "",
);

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
};

export default nextConfig;

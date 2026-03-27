import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // We route /api to backend through the Next.js host to keep cookies same-site.
    // Development and production both use env config when available.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

    if (apiUrl) {
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/:path*`,
        },
      ];
    }

    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
      ];
    }

    return [];
  },
};

export default nextConfig;

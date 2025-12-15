/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other configurations
  // Remove invalid experimental keys and add optional rewrites to proxy
  // /api requests to the backend during development. This avoids Next.js
  // returning 404 for API routes that are served by the external backend.
  images: {
    // Use `remotePatterns` to whitelist external hosts for the built-in Image
    // component. This replaces the deprecated `images.domains` config.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "tse3.mm.bing.net" },
      { protocol: "https", hostname: "tse1.mm.bing.net" },
      { protocol: "https", hostname: "tse2.mm.bing.net" },
      { protocol: "https", hostname: "tse4.mm.bing.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "picsum.photos" },
      // Localhost images (dev): allow http on localhost
      { protocol: "http", hostname: "localhost" },
      {
        protocol: "https",
        hostname: "2mtegaywr8.ucarecd.net",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  async rewrites() {
    // Use NEXT_PUBLIC_API_BASE_URL if set, otherwise default to localhost:5000
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    // strip trailing slashes and any trailing /api to avoid double /api
    const apiHost = raw.replace(/\/+$/g, "").replace(/\/api$/i, "");
    // Add specific mappings for admin-style endpoints that the backend
    // exposes under different paths. These are checked before the
    // catch-all rewrite below.
    return [
      // Admin -> backend mappings
      {
        source: "/api/admin/home/hero-section",
        destination: `${apiHost}/api/hero`,
      },
      {
        source: "/api/admin/home/stats-section",
        destination: `${apiHost}/api/stat/stats`,
      },
      {
        source: "/api/admin/home/events-section",
        destination: `${apiHost}/api`,
      },
      {
        source: "/api/admin/home/daily-activities",
        destination: `${apiHost}/api/activities`,
      },
      {
        source: "/api/admin/home/volunteer-opportunities",
        destination: `${apiHost}/api/volunteer-management`,
      },
      {
        source: "/api/admin/home/impact-section",
        destination: `${apiHost}/api/impact`,
      },
      {
        source: "/api/admin/home/featured-causes",
        destination: `${apiHost}/api/causes`,
      },
      {
        source: "/api/admin/home/testimonials",
        destination: `${apiHost}/api/test`,
      },
      {
        source: "/api/admin/home/call-to-action",
        destination: `${apiHost}/api/cta`,
      },
      {
        source: "/api/admin/home/newsletter",
        destination: `${apiHost}/api/newsletter`,
      },

      // Catch-all: forward any other /api requests to the backend
      { source: "/api/:path*", destination: `${apiHost}/api/:path*` },
    ];
  },
};

module.exports = nextConfig;

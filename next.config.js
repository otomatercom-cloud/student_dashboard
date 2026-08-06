/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js blocks cross-origin dev-server requests by default (a real
  // security feature, not a bug) — add any non-localhost address you'll
  // actually be testing from here.
  allowedDevOrigins: ['45.129.87.39'],
};

module.exports = nextConfig;

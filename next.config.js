/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "ik.imagekit.io"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },
  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/system",
    "@mui/x-data-grid",
    "@mui/x-date-pickers-pro",
  ],
};

module.exports = withPWA(nextConfig);

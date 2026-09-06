import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // The artwork is already hand-exported to webp at its display size; letting
    // the optimizer re-encode gains little and costs a build step per image.
    // next/image still gives us lazy loading, width/height and no layout shift.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production verification from overwriting a running dev server's assets.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;

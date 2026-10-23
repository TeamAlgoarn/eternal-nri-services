
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  reactStrictMode: true,

  cacheComponents: false,

  partialPrefetching: false,

  turbopack: {
    root: process.cwd(),
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;

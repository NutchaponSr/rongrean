import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "impressive-bat-430.convex.cloud",
      }
    ]
  }
};

export default nextConfig;

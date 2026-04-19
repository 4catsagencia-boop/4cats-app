import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.2"],
  transpilePackages: ["three"],
};

export default nextConfig;

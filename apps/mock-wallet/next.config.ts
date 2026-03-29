import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@stable-compliance/protocol-sdk'],
  reactCompiler: true,
};

export default nextConfig;

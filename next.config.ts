import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    GATEWAY_URL: process.env["GATEWAY_URL"] ?? "http://localhost:8080",
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_IAM_URL: process.env["NEXT_PUBLIC_IAM_URL"] ?? "http://localhost:8081",
    NEXT_PUBLIC_CONFERENCE_URL:
      process.env["NEXT_PUBLIC_CONFERENCE_URL"] ?? "http://localhost:8082",
    NEXT_PUBLIC_WALLET_URL: process.env["NEXT_PUBLIC_WALLET_URL"] ?? "http://localhost:8083",
  },
};

export default nextConfig;

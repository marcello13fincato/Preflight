import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    // ensure the root is the preflight folder and not the parent workspace
    root: __dirname,
  },
};

export default nextConfig;

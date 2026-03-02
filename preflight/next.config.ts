import type { NextConfig } from "next";
import path from "path";

const projectRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Ensure turbopack.root matches Next's outputFileTracingRoot (the project root)
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

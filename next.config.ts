import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // three.js ecosystem packages ship ES-module syntax that Next.js needs to
  // transpile through its own Webpack pipeline to avoid "SyntaxError: Cannot
  // use import statement in a module" at runtime.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;

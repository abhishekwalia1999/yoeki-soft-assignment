import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Three.js and WebGL packages
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

export default nextConfig;

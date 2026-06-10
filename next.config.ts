// next.config.ts
import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  /* In Next.js 16.2, 'allowedDevOrigins' is a top-level property.
     It is no longer under 'experimental'.
  */
     
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.100.82' // Add your specific local IP here
  ],

  // Other standard configs
  reactStrictMode: true,
};

export default nextConfig;
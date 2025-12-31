import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Set base path for GitHub Pages (change 'fund' to your repo name)
  basePath: isProd ? '/fund' : '',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Trailing slashes help with GitHub Pages routing
  trailingSlash: true,
};

export default nextConfig;

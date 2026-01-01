import type { NextConfig } from "next";

// Detect if we're building for GitHub Pages (set in GitHub Actions workflow)
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const nextConfig: NextConfig = {
  // Only use static export for GitHub Pages
  ...(isGitHubPages && { output: 'export' }),
  
  // Set base path only for GitHub Pages (must match your repo name)
  ...(isGitHubPages && { basePath: '/aeternum' }),
  
  // Trailing slashes help with GitHub Pages routing
  ...(isGitHubPages && { trailingSlash: true }),
  
  // Disable image optimization for static export (GitHub Pages)
  // Vercel handles this automatically
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;

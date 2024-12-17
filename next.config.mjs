/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  output: "standalone", // For deployment flexibility in GitHub Codespaces
};

export default nextConfig;

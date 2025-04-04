/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Add this line
  },
  env: {
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  },
  experimental: {
      serverComponentsExternalPackages: ['googleapis'],
  },
  webpack: (config, { isServer }) => {
      if (isServer) {
          config.externals = ['@google-cloud/local-auth', ...config.externals];
      }
      return config;
  },
  async rewrites() {
      return [
          {
              source: "/sitemap.xml",
              destination: "/api/sitemap.xml",
          },
      ];
  },
};

export default nextConfig;

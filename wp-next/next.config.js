const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_IMAGE_HOSTNAME,
        pathname: "/**",
      },
    ],
  },

  env: {
    SITE_URL: process.env.SITE_URL,
    NEXT_EXTERNAL_API_BASE_URL: process.env.NEXT_EXTERNAL_API_BASE_URL,
    NEXT_INTERNAL_API_BASE_URL: process.env.NEXT_INTERNAL_API_BASE_URL,
    API_KEY: process.env.API_KEY,
  },

  distDir: "./next-build",
  images: { unoptimized: true },
  basePath: "/wp-content/themes/core-theme/next-build",
  assetPrefix: "/wp-content/themes/core-theme/next-build/",
};

module.exports = nextConfig;

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// beri tahu plugin di mana file config-nya
const withNextIntl = createNextIntlPlugin("./next-intl.config.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

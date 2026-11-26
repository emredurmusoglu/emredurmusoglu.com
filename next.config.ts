import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ayrı repodan taşınan statik sayfalar public/ altında; temiz adresle açılsınlar.
  async rewrites() {
    return [
      { source: "/tk-bc", destination: "/tk-bc/index.html" },
      { source: "/tk-bc/chef", destination: "/tk-bc/chef.html" },
    ];
  },
};

export default nextConfig;

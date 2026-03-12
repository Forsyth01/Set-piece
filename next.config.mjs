/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["source.unsplash.com"],
  },
  async redirects() {
    const shopifyHosts = [
      'shop.setpiecesclothing.com',
    ];

    return shopifyHosts.map((host) => ({
      source: '/:path*',
      has: [{ type: 'host', value: host }],
      destination: 'https://setpiecesclothing.com/:path*',
      permanent: false,
    }));
  },
};

export default nextConfig;

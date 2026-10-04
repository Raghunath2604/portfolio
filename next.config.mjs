/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [75, 80, 95, 100],
  },
};

export default nextConfig;

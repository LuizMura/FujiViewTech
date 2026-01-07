import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jxcmxjmqcsxkxftblbrq.supabase.co",
        pathname: "/storage/v1/object/public/artigos/**",
      },
      // Permite imagens do bucket 'uploads' (API de upload)
      {
        protocol: "https",
        hostname: "jxcmxjmqcsxkxftblbrq.supabase.co",
        pathname: "/storage/v1/object/public/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "images.samsung.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
};

export default nextConfig;

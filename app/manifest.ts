import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KLYXDEV",
    short_name: "KLYXDEV",
    description: "Digital products built with premium product thinking.",
    start_url: "/",
    display: "standalone",
    background_color: "#090A0C",
    theme_color: "#090A0C",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

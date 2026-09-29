import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FitStreak",
    short_name: "FitStreak",
    description: "Registra entrenamientos, mira tu progreso y mantén tu racha.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#f97316",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

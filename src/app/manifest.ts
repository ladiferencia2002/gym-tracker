import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/gym-tracker" : "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FitStreak",
    short_name: "FitStreak",
    description: "Registra entrenamientos, mira tu progreso y mantén tu racha.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#020617",
    theme_color: "#f97316",
    icons: [
      { src: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}

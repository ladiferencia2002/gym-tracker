import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { TopNavLinks, BottomNavLinks } from "@/components/nav/NavLinks";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/gym-tracker" : "";

export const metadata: Metadata = {
  title: "FitStreak",
  description: "Registra entrenamientos, mira tu progreso y mantén tu racha.",
  icons: {
    icon: `${basePath}/icon-192.png`,
    apple: `${basePath}/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f97316",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 pb-20 text-white antialiased sm:pb-0">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span>🔥</span> FitStreak
            </Link>
            <TopNavLinks />
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>

        <BottomNavLinks />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

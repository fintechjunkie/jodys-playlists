import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Fraunces } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s — ${SITE_NAME}` },
  description: "Hand-built playlists across Spotify, Apple Music and YouTube.",
  openGraph: { siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <header className="border-b border-edge/60">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <Link href="/" className="font-display text-xl tracking-tight hover:opacity-80">
              {SITE_NAME}
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-edge/60 mt-24">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">
            © {new Date().getFullYear()} {SITE_NAME}
          </div>
        </footer>
      </body>
    </html>
  );
}

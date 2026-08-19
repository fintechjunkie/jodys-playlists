import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { livePlaylists } from "@/lib/playlists";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { CornerNav } from "@/components/CornerNav";
import "./globals.css";

// Stand-ins for Beni and Clash Grotesk, per the style reference's substitute list.
const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s — ${SITE_NAME}` },
  description: "Hand-sequenced playlists. Each one built as a set of acts, dusk to after midnight.",
  openGraph: { siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const links = livePlaylists().map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <CornerNav links={links} />

        {/* No nav bar, no breadcrumbs — the corner circles are the whole chrome. */}
        <main>{children}</main>

        <footer className="mx-auto max-w-[1440px] px-6 pb-15 pt-30 sm:px-15">
          <p className="label-micro text-forest-ink">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </footer>
      </body>
    </html>
  );
}

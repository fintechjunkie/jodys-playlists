import { NextResponse, type NextRequest } from "next/server";
import { livePlaylists } from "@/lib/playlists";

/**
 * Vanity subdomains for ad campaigns.
 *
 *   late-night-drive.violetelixir.com  ->  serves /late-night-drive
 *
 * One wildcard DNS record + one wildcard domain in Vercel covers every playlist,
 * so adding a playlist still means editing one file and committing. The path
 * form stays canonical (see generateMetadata in app/[slug]/page.tsx) so the two
 * hostnames never compete for the same search result.
 *
 * Anything that isn't a known slug — www, apex, *.vercel.app previews — passes
 * straight through.
 */
export default function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];
  const labels = hostname.split(".");

  // Need at least sub.domain.tld for this to be a vanity subdomain.
  if (labels.length < 3) return NextResponse.next();

  const sub = labels[0];
  if (sub === "www") return NextResponse.next();
  if (!livePlaylists().some((p) => p.slug === sub)) return NextResponse.next();

  const url = request.nextUrl.clone();
  // Only rewrite the root; deeper paths on the subdomain stay where they point,
  // so /about on a vanity host still resolves.
  if (url.pathname !== "/") return NextResponse.next();

  url.pathname = `/${sub}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|covers/|favicon.ico|sitemap.xml|robots.txt).*)"],
};

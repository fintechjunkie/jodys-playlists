/**
 * Change SITE_DOMAIN once you point the real domain at Vercel. Everything
 * else — canonical URLs, sitemap, subdomain rewrites, share metadata — reads
 * from here.
 */
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "jodysplaylists.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_NAME = "Jody's Playlists";
export const SITE_TAGLINE = "Playlists worth the drive.";

/** Canonical URL for a playlist. Always the path form, never the subdomain. */
export function playlistUrl(slug: string): string {
  return `${SITE_URL}/${slug}`;
}

/** The vanity subdomain for ad campaigns. Rewrites to the path above. */
export function playlistAdUrl(slug: string): string {
  return `https://${slug}.${SITE_DOMAIN}`;
}

/**
 * Jody's own tracks get a quiet marker in the tracklist. Matched by exact
 * artist string, so keep the spelling in lib/playlists.ts consistent.
 */
export const OWN_ARTIST = "Jody Lynn";

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

/**
 * The playlist creator, surfaced by the "About the playlist creator" dialog on
 * the home page and every playlist page.
 *
 * TODO: `blurb` is still placeholder copy — replace it with Jody's real bio
 * before launch. The Spotify artist URL is real.
 */
export const CREATOR = {
  name: "Jody Lynn",
  role: "Playlist creator, and the artist behind several tracks on every list",
  blurb:
    "Jody Lynn builds playlists the way records used to be sequenced — in acts, with a shape, meant to be played start to finish rather than shuffled. She writes and records her own music too, and a few of her tracks sit inside every list here alongside the artists who shaped them.",
  // The ?si= share-tracking parameter is stripped deliberately: it identifies
  // the person who copied the link, and there's no reason to attach that to
  // every visitor who clicks through.
  spotifyArtistUrl: "https://open.spotify.com/artist/6YLtlPHlSvadNAENGawZDk",
} as const;

/** True once a real Spotify artist URL has been set. */
export function hasCreatorSpotify(): boolean {
  return !CREATOR.spotifyArtistUrl.includes("REPLACE_ME");
}

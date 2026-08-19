/**
 * Change SITE_DOMAIN once you point the real domain at Vercel. Everything
 * else — canonical URLs, sitemap, subdomain rewrites, share metadata — reads
 * from here.
 */
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "jodysplaylists.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_NAME = "Jody's Playlists";
/**
 * Hero line and the suffix on the home page's title tag. Kept as two short
 * clauses because the hero sets it as two overlapping display lines — see
 * HERO_LINES below, which must stay in sync with it.
 */
export const SITE_TAGLINE = "Steal these. Play them loud.";

/**
 * The tagline broken for the hero. Lines are authored rather than wrapped: at
 * line-height 0.70 they overlap and take different colors, so where the break
 * falls is a design decision.
 */
export const HERO_LINES = ["Steal these", "Play them loud"];

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
 * The first paragraph is Jody's own bio, in her voice, kept verbatim. Its
 * closing "Follow @jodylynnmusic on IG" line is dropped because the Instagram
 * link renders as a real button below — no reason to say it twice.
 *
 * Paragraphs are a real array rather than one string with escaped newlines:
 * easier to edit, and impossible to get the escaping wrong.
 */
export const CREATOR = {
  name: "Jody Lynn",
  role: "Songwriter, and the artist behind several tracks on every list",
  paragraphs: [
    "Songwriter in a lyrical life with a voice like sugar-coated barbwire. Pouring it all out, surrendering to my cathexis while serving up a little ear candy for ya! ;)",
    "These playlists are that same habit pointed outward — made for the love of the music, and sequenced in acts so they play like a night instead of a shuffle. A few of my own songs sit in every one.",
  ],
  // The ?si= share-tracking parameter is stripped deliberately: it identifies
  // the person who copied the link, and there's no reason to attach that to
  // every visitor who clicks through.
  spotifyArtistUrl: "https://open.spotify.com/artist/6YLtlPHlSvadNAENGawZDk",
  instagramUrl: "https://www.instagram.com/jodylynnmusic/",
  instagramHandle: "@jodylynnmusic",
} as const;

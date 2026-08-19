/**
 * The entire content of the site lives in this file.
 * To add a playlist: append an object to `playlists` and commit. Vercel deploys it.
 *
 * `slug` is the public URL and doubles as the ad-campaign subdomain:
 *   slug "revenge-dressing" -> jodysplaylists.com/revenge-dressing
 *                          and revenge-dressing.jodysplaylists.com
 * Keep slugs short, lowercase, hyphenated, and PERMANENT — they end up printed
 * in ad creative, and changing one breaks every link already out in the world.
 */

export type Provider =
  | "spotify"
  | "apple"
  | "youtube"
  | "youtubeMusic"
  | "amazon"
  | "tidal"
  | "soundcloud"
  | "deezer";

export type Source = {
  provider: Provider;
  /** Public share link. This is what "Open in ..." points at. */
  url: string;
  /**
   * Provider playlist ID, for providers we can embed by ID (spotify, apple,
   * youtube). Omit for link-out-only sources.
   */
  embedId?: string;
  /** Escape hatch: a full iframe src, for providers we can't build a URL for. */
  embedUrl?: string;
};

export type Track = {
  artist: string;
  title: string;
};

export type Act = {
  /** Roman numeral or number, shown as the act label. */
  number: string;
  /** Short name, e.g. "Dusk". */
  title: string;
  /** The line that explains what this act is doing. This is the product. */
  note: string;
  tracks: Track[];
};

export type Playlist = {
  slug: string;
  title: string;
  /**
   * The title broken into display lines. Required for anything that wraps.
   *
   * Display type runs at line-height 0.70, so lines physically overlap and
   * each one gets a different color from the cycle. Where the break falls is
   * therefore a design decision, not something to leave to auto-wrap. Falls
   * back to the whole title on one line if omitted.
   */
  titleLines?: string[];
  /** One short line for the card. Keep it under ~70 characters. */
  tagline: string;
  /** The full pitch, shown on the playlist page. Blank lines make paragraphs. */
  description: string;
  /**
   * Cover art: a local file in /public/covers, or a remote URL from a provider
   * CDN (Spotify/Apple/YouTube hosts are allowlisted in next.config.ts).
   */
  cover: string;
  /** Two hex colors — the card's fallback gradient and the page's glow. */
  accent: [string, string];
  acts: Act[];
  /** Optional, e.g. "1 hr 47 min". Track count is derived from `acts`. */
  duration?: string;
  tags?: string[];
  /** Streaming links, in display order. Empty is fine — the page adapts. */
  sources: Source[];
  /** Which provider gets the on-page player. Must appear in `sources`. */
  embedProvider?: Provider;
  /** ISO date. Drives sort order and the sitemap. */
  published: string;
  /** Set false to keep it in this file but off the site. */
  live?: boolean;
};

export const playlists: Playlist[] = [
  {
    slug: "actually-scary",
    title: "Halloween Party, Actually Scary",
    titleLines: ["Halloween", "Party,", "Actually", "Scary"],
    tagline: "No Monster Mash. No Thriller. Twenty six songs that feel like the night.",
    description:
      "No Monster Mash. No Thriller. Twenty six songs that actually feel like the night.\n\nSequenced from dusk to after midnight, so just press play and let it run the room.",
    cover: "/covers/placeholder.svg",
    accent: ["#140a1e", "#b91c1c"],
    tags: ["halloween", "goth", "industrial", "party"],
    published: "2026-08-19",
    // TODO: add the real share links + Spotify playlist ID. While `sources` is
    // empty the page shows a "links coming soon" note instead of dead buttons.
    // Once you have it:
    //   { provider: "spotify", url: "https://open.spotify.com/playlist/<id>", embedId: "<id>" }
    sources: [],
    embedProvider: "spotify",
    acts: [
      {
        number: "I",
        title: "Dusk",
        note: "People arriving, drinks getting poured, nothing has happened yet.",
        tracks: [
          { artist: "Bauhaus", title: "Bela Lugosi's Dead" },
          { artist: "Chelsea Wolfe", title: "16 Psyche" },
          { artist: "Zola Jesus", title: "Exhumed" },
          { artist: "Jody Lynn", title: "Dearly Departed" },
          { artist: "Portishead", title: "Machine Gun" },
          { artist: "Massive Attack", title: "Angel" },
        ],
      },
      {
        number: "II",
        title: "Something's Wrong",
        note: "Tension building, room filling, still controlled.",
        tracks: [
          { artist: "Nine Inch Nails", title: "The Perfect Drug" },
          { artist: "Jody Lynn", title: "The Hunted" },
          { artist: "The Kills", title: "Future Starts Slow" },
          { artist: "Yeah Yeah Yeahs", title: "Heads Will Roll" },
          { artist: "Poppy", title: "BLOODMONEY" },
          { artist: "Marilyn Manson", title: "The Beautiful People" },
        ],
      },
      {
        number: "III",
        title: "The Peak",
        note: "This is the dancefloor.",
        tracks: [
          { artist: "Rob Zombie", title: "Dragula" },
          { artist: "Deftones", title: "My Own Summer (Shove It)" },
          { artist: "Jody Lynn", title: "Undertow" },
          { artist: "Korn", title: "Freak on a Leash" },
          { artist: "Crystal Castles", title: "Baptism" },
          { artist: "The Prodigy", title: "Breathe" },
          { artist: "Nine Inch Nails", title: "Head Like a Hole" },
        ],
      },
      {
        number: "IV",
        title: "After Midnight",
        note: "Comedown, eerier, people sitting on the floor talking.",
        tracks: [
          { artist: "Type O Negative", title: "Black No. 1" },
          { artist: "Siouxsie and the Banshees", title: "Spellbound" },
          { artist: "Jody Lynn", title: "DARK" },
          { artist: "The Cure", title: "Lullaby" },
          { artist: "Radiohead", title: "Climbing Up the Walls" },
          { artist: "Nick Cave and the Bad Seeds", title: "Red Right Hand" },
          { artist: "Angelo Badalamenti", title: "Laura Palmer's Theme" },
        ],
      },
    ],
  },
  {
    slug: "revenge-dressing",
    title: "Revenge Dressing",
    titleLines: ["Revenge", "Dressing"],
    tagline: "For the night you're getting ready and you already know.",
    description:
      "For the night you're getting ready and you already know. Twenty six songs sequenced from first coat of mascara to walking out the door.\n\nConfidence, not closure.",
    cover: "/covers/placeholder.svg",
    accent: ["#1a0316", "#e11d48"],
    tags: ["pop", "hype", "getting ready", "confidence"],
    published: "2026-08-19",
    // TODO: add the real share links + Spotify playlist ID (see note above).
    sources: [],
    embedProvider: "spotify",
    acts: [
      {
        number: "I",
        title: "The Decision",
        note: "Shower done, mirror lights on, nothing decided yet.",
        tracks: [
          { artist: "Rihanna", title: "Needed Me" },
          { artist: "SZA", title: "Kill Bill" },
          { artist: "Jody Lynn", title: "Daily Special" },
          { artist: "FKA twigs", title: "Two Weeks" },
          { artist: "Doja Cat", title: "Streets" },
          { artist: "Tinashe", title: "Nasty" },
        ],
      },
      {
        number: "II",
        title: "Getting Sharper",
        note: "Outfit on, first real look in the mirror.",
        tracks: [
          { artist: "Charli XCX", title: "360" },
          { artist: "Jody Lynn", title: "Tantalizing" },
          { artist: "Dua Lipa", title: "Physical" },
          { artist: "Chappell Roan", title: "Femininomenon" },
          { artist: "Lady Gaga", title: "Bad Romance" },
          { artist: "Kesha", title: "Woman" },
        ],
      },
      {
        number: "III",
        title: "The Peak",
        note: "Last look. This is the dopamine.",
        tracks: [
          { artist: "Jody Lynn", title: "FLAUNT" },
          { artist: "Beyoncé", title: "Partition" },
          { artist: "Megan Thee Stallion", title: "Savage" },
          { artist: "Ariana Grande", title: "yes, and?" },
          { artist: "Jody Lynn", title: "Saucy" },
          { artist: "Miley Cyrus", title: "Mother's Daughter" },
        ],
      },
      {
        number: "IV",
        title: "In The Car",
        note: "Final armor, five minutes out.",
        tracks: [
          { artist: "Olivia Rodrigo", title: "get him back!" },
          { artist: "Jody Lynn", title: "Sucker" },
          { artist: "Blondie", title: "One Way or Another" },
          { artist: "Gwen Stefani", title: "Hollaback Girl" },
          { artist: "Doja Cat", title: "Woman" },
          { artist: "Kelis", title: "Milkshake" },
          { artist: "Beyoncé", title: "Formation" },
          { artist: "Beyoncé", title: "Don't Hurt Yourself" },
        ],
      },
    ],
  },
];

/** Slugs that can never be a playlist, because a real page owns them. */
export const RESERVED_SLUGS = new Set([
  "about",
  "api",
  "contact",
  "privacy",
  "terms",
  "www",
  "sitemap.xml",
  "robots.txt",
]);

export function livePlaylists(): Playlist[] {
  return playlists
    .filter((p) => p.live !== false && !RESERVED_SLUGS.has(p.slug))
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getPlaylist(slug: string): Playlist | undefined {
  return livePlaylists().find((p) => p.slug === slug);
}

/** Display lines for a title, falling back to a single line. */
export function titleLines(playlist: Playlist): string[] {
  return playlist.titleLines ?? [playlist.title];
}

export function trackCount(playlist: Playlist): number {
  return playlist.acts.reduce((sum, act) => sum + act.tracks.length, 0);
}

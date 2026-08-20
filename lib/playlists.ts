/**
 * The entire content of the site lives in this file.
 * To add a playlist: append an object to `playlists` and commit. Vercel deploys it.
 *
 * `slug` is the public URL and doubles as the ad-campaign subdomain:
 *   slug "revenge-dressing" -> violetelixir.com/revenge-dressing
 *                          and revenge-dressing.violetelixir.com
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
  /**
   * The act's identifier, set as the oversized display numeral. Usually a roman
   * numeral ("III"), but any short string works — a time-based playlist uses a
   * range like "12-30".
   */
  number: string;
  /** Short name, e.g. "Dusk". */
  title: string;
  /**
   * The line explaining what this act is doing. This is the product, so write
   * one wherever there is something to say — but it is optional, because some
   * playlists have act titles that already say it.
   */
  note?: string;
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
  /**
   * Flat color painted behind the cover art while the image loads. Set it to
   * the artwork's dominant motif color — `npm run covers` samples the art and
   * prints the value to paste here.
   */
  accent: string;
  /**
   * Ink color for the title that `npm run covers` burns into the cover.
   * Pick the one that CONTRASTS with the artwork's motif — magenta type against
   * a magenta motif disappears at thumbnail size.
   */
  coverInk?: "magenta" | "forest";
  acts: Act[];
  /**
   * What each act header is called: "Act I", or "Minutes 12-30" for a
   * time-structured playlist. Defaults to "Act". This only labels the individual
   * headers — "acts" stays the structural noun everywhere else.
   */
  actNoun?: string;
  /** Optional, e.g. "47 min". Track count is derived from `acts`. */
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
    cover: "/covers/actually-scary-1028ab18.jpg",
    accent: "#05462b",
    coverInk: "magenta",
    tags: ["halloween", "goth", "industrial", "party"],
    published: "2026-08-19",
    sources: [
      {
        provider: "spotify",
        // ?si= share-tracking parameter stripped, as above.
        url: "https://open.spotify.com/playlist/0GjwEVyE4BykephX88JqIV",
        embedId: "0GjwEVyE4BykephX88JqIV",
      },
    ],
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
    cover: "/covers/revenge-dressing-1d3597ca.jpg",
    accent: "#f12c72",
    coverInk: "forest",
    tags: ["pop", "hype", "getting ready", "confidence"],
    published: "2026-08-19",
    sources: [
      {
        provider: "spotify",
        // The ?si= share-tracking parameter is stripped: it identifies whoever
        // copied the link, and there's no reason to attach it to every visitor.
        url: "https://open.spotify.com/playlist/7neCWZPod8zQ2U5KVbhoYw",
        embedId: "7neCWZPod8zQ2U5KVbhoYw",
      },
    ],
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
  {
    slug: "rage-clean",
    title: "The 47 Minute Rage Clean",
    titleLines: ["The 47 Minute", "Rage Clean"],
    tagline: "Forty seven minutes. Kitchen, bathroom, floors. Don't stop.",
    description:
      "Forty seven minutes. Kitchen, bathroom, floors. Do not stop when the first song ends. Twelve tracks sequenced so you're moving fastest at minute thirty.\n\nFree.",
    cover: "/covers/rage-clean-cb07ceab.jpg",
    accent: "#024b2b",
    coverInk: "magenta",
    // The runtime IS the hook, so it goes on the page.
    duration: "47 min",
    // Time blocks rather than numbered acts.
    actNoun: "Minutes",
    tags: ["rage", "cleaning", "nu metal", "workout"],
    published: "2026-08-19",
    // TODO: add the Spotify playlist once it exists.
    sources: [],
    embedProvider: "spotify",
    acts: [
      {
        number: "0-12",
        title: "Ignition",
        note: "Dishes and clearing surfaces.",
        tracks: [
          { artist: "Rage Against the Machine", title: "Bulls on Parade" },
          { artist: "Jody Lynn", title: "LOVE ME HATE ME" },
          { artist: "The Prodigy", title: "Breathe" },
          { artist: "Limp Bizkit", title: "Break Stuff" },
        ],
      },
      {
        number: "12-30",
        title: "The Grind",
        note: "Scrubbing. Peak effort.",
        tracks: [
          { artist: "Deftones", title: "My Own Summer (Shove It)" },
          { artist: "Jody Lynn", title: "DARK" },
          { artist: "Korn", title: "Blind" },
          { artist: "System of a Down", title: "Chop Suey!" },
          { artist: "Jody Lynn", title: "The Hunted" },
        ],
      },
      {
        number: "30-47",
        title: "The Finish",
        note: "Floors, trash out, done.",
        tracks: [
          { artist: "Linkin Park", title: "One Step Closer" },
          { artist: "Nine Inch Nails", title: "Head Like a Hole" },
          { artist: "Rage Against the Machine", title: "Killing in the Name" },
        ],
      },
    ],
  },
  {
    slug: "seventeen-again",
    title: "Feel Seventeen Again",
    titleLines: ["Feel", "Seventeen", "Again"],
    tagline: "Twenty two songs that put you back in a car you no longer own.",
    description:
      "Twenty two songs that put you back in a car you no longer own. Play it loud enough that it's embarrassing.\n\nFree.",
    cover: "/covers/seventeen-again-167840d1.jpg",
    accent: "#ec6697",
    coverInk: "forest",
    tags: ["nostalgia", "pop punk", "emo", "throwback"],
    published: "2026-08-19",
    // TODO: add the Spotify playlist once it exists.
    sources: [],
    embedProvider: "spotify",
    // NOTE: these acts have titles but no notes — the act names carry it for now.
    // Notes render automatically if you add them.
    acts: [
      {
        number: "I",
        title: "The Parking Lot",
        tracks: [
          { artist: "Paramore", title: "Misery Business" },
          { artist: "Fall Out Boy", title: "Sugar, We're Goin Down" },
          { artist: "Jody Lynn", title: "Flipside" },
          { artist: "My Chemical Romance", title: "I'm Not Okay (I Promise)" },
          { artist: "Blink-182", title: "All the Small Things" },
        ],
      },
      {
        number: "II",
        title: "Windows Down",
        tracks: [
          { artist: "Green Day", title: "American Idiot" },
          { artist: "Jody Lynn", title: "Daily Special" },
          { artist: "Avril Lavigne", title: "Complicated" },
          { artist: "Jimmy Eat World", title: "The Middle" },
          { artist: "All Time Low", title: "Dear Maria, Count Me In" },
          { artist: "Panic! At The Disco", title: "I Write Sins Not Tragedies" },
        ],
      },
      {
        number: "III",
        title: "Too Loud, Too Fast",
        tracks: [
          { artist: "Jody Lynn", title: "Different Story" },
          { artist: "Taking Back Sunday", title: "MakeDamnSure" },
          { artist: "Yellowcard", title: "Ocean Avenue" },
          { artist: "The Used", title: "The Taste of Ink" },
          { artist: "Jody Lynn", title: "Sucker" },
          { artist: "Sum 41", title: "In Too Deep" },
        ],
      },
      {
        number: "IV",
        title: "The Drive Home",
        tracks: [
          { artist: "Dashboard Confessional", title: "Hands Down" },
          { artist: "Third Eye Blind", title: "Semi-Charmed Life" },
          { artist: "The Killers", title: "Mr. Brightside" },
          { artist: "Paramore", title: "The Only Exception" },
          { artist: "My Chemical Romance", title: "Welcome to the Black Parade" },
        ],
      },
    ],
  },
  {
    slug: "no-contact",
    title: "Day One Of No Contact",
    titleLines: ["Day One Of", "No Contact"],
    tagline: "Twenty four songs for the first week. Wreckage toward steadier.",
    description:
      "Twenty four songs for the first week. Sequenced from wreckage toward something steadier. It gets easier around track sixteen.\n\nFree.",
    cover: "/covers/no-contact-173d4ca0.jpg",
    accent: "#034629",
    coverInk: "magenta",
    tags: ["heartbreak", "breakup", "healing", "sad"],
    published: "2026-08-19",
    // TODO: add the Spotify playlist once it exists.
    sources: [],
    embedProvider: "spotify",
    acts: [
      {
        number: "I",
        title: "The First 48 Hours",
        note: "Raw.",
        tracks: [
          { artist: "Bon Iver", title: "Skinny Love" },
          { artist: "Jody Lynn", title: "Hollow" },
          { artist: "Phoebe Bridgers", title: "Motion Sickness" },
          { artist: "Adele", title: "Someone Like You" },
          { artist: "Jody Lynn", title: "Saving You" },
          { artist: "Lorde", title: "Liability" },
        ],
      },
      {
        number: "II",
        title: "The Anger Arrives",
        note: "This is the turn, and it should feel like relief.",
        tracks: [
          { artist: "Olivia Rodrigo", title: "good 4 u" },
          { artist: "Jody Lynn", title: "Bitter End" },
          { artist: "Paramore", title: "Decode" },
          { artist: "Kelsea Ballerini", title: "Peter Pan" },
          { artist: "Alanis Morissette", title: "You Oughta Know" },
          { artist: "Fiona Apple", title: "Sleep to Dream" },
        ],
      },
      {
        number: "III",
        title: "Clarity",
        note: "Steadier. Less about them.",
        tracks: [
          { artist: "Jody Lynn", title: "A Heartbeat Away" },
          { artist: "Maggie Rogers", title: "Light On" },
          { artist: "Lucy Dacus", title: "Night Shift" },
          { artist: "Miley Cyrus", title: "Flowers" },
          { artist: "Kacey Musgraves", title: "Happy & Sad" },
          { artist: "SZA", title: "Good Days" },
        ],
      },
      {
        number: "IV",
        title: "Day Seven",
        note: "Not healed. Just further along.",
        tracks: [
          { artist: "Jody Lynn", title: "Different Story" },
          { artist: "Florence + The Machine", title: "Shake It Out" },
          { artist: "Robyn", title: "Dancing On My Own" },
          { artist: "HAIM", title: "Want You Back" },
          { artist: "Taylor Swift", title: "Clean" },
          { artist: "Mitski", title: "Two Slow Dancers" },
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

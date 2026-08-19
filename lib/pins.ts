/**
 * Pinterest pin copy and assignments.
 *
 * Two separate things live here on purpose:
 *
 *   PIN_COPY  — the approved lines, keyed by a short id. Written once, reusable.
 *   pins      — which inbox image gets which line, and where its banner sits.
 *
 * Keeping them apart means dropping a new image is a one-line assignment, and the
 * same line can be tried on several images without being retyped.
 *
 * Type is set in Anton, uppercase, exactly as on the playlist covers. Pins get a
 * solid banner behind the text, because pin artwork is busier than cover artwork
 * and bare type over it would not survive a fast-scrolling feed.
 */

/** Which Pinterest board a line is written for. */
export type PinBoard = "party-ideas" | "moody-aesthetic" | "party-playlists";

/**
 * Where the banner sits. Match this to the quiet area of the image.
 *
 *   "top"    — one banner across the top 30%
 *   "middle" — one banner across the middle 30%
 *   "split"  — two banners: headline in the top 20%, subline in the bottom 20%
 */
export type PinZone = "top" | "middle" | "split";

/**
 * Banner colourway.
 *
 *   "charcoal" — charcoal banner, chartreuse headline, cream subline
 *   "magenta"  — magenta banner, cream type
 *   "cream"    — warm chalk banner, magenta headline, forest subline
 */
export type PinBanner = "charcoal" | "magenta" | "cream";

/**
 * How hard the type sits on the photograph.
 *
 *   "band" — solid block across the full width. Loudest, most ad-like. Suits
 *            high-intent boards, and any image whose quiet zone is bright and
 *            busy enough that blockless type would lose legibility.
 *   "tag"  — solid block only as wide as the text. Barely differs from "band"
 *            once a headline runs long, so rarely worth choosing.
 *   "bare" — no block. Type sits on the photograph, coloured from the measured
 *            luminance behind it. Best on dark, controlled images.
 *   "rule" — "bare" plus a short brand-colour rule above the headline. Keeps
 *            some brand structure without covering the picture.
 *
 * Preview all four with:  npm run pins -- --variants
 */
export type PinTreatment = "band" | "tag" | "bare" | "rule";

export type PinCopy = {
  board: PinBoard;
  /** The big line. Set very large, so shorter is stronger. */
  headline: string;
  /** Secondary line, set smaller in Inter. */
  subline: string;
};

/**
 * Each board gets its own banner colour by default, so the three boards look
 * like three distinct campaigns rather than one repeated template. Override per
 * assignment when a particular image needs it.
 */
export const BOARD_BANNER: Record<PinBoard, PinBanner> = {
  "party-ideas": "charcoal",
  "moody-aesthetic": "cream",
  "party-playlists": "magenta",
};

/**
 * Approved lines. Five per board, chosen for a short headline (it is set very
 * large) and for attacking a different angle from its neighbours — near-duplicate
 * pins compete with each other in the same feed.
 */
export const PIN_COPY: Record<string, PinCopy> = {
  // ---- Board 1: Halloween Party Ideas — utility, problem-solving ----
  "party-dies-at-9": {
    board: "party-ideas",
    headline: "Your party dies at 9pm",
    subline: "It's not the snacks. It's the playlist.",
  },
  "nobody-wants-to-dj": {
    board: "party-ideas",
    headline: "Nobody wants to DJ their own party",
    subline: "Press play at 8 and never touch it again",
  },
  "zero-thriller": {
    board: "party-ideas",
    headline: "Zero Thriller",
    subline: "A Halloween playlist for adults",
  },
  "host-who-hates-hosting": {
    board: "party-ideas",
    headline: "For the host who hates hosting",
    subline: "One tap and the night runs itself",
  },
  "nobody-dances-until-13": {
    board: "party-ideas",
    headline: "Nobody dances until track 13",
    subline: "That's on purpose",
  },
  "planned-everything-but-this": {
    board: "party-ideas",
    headline: "You planned everything but this",
    subline: "The free playlist your Halloween party is missing",
  },
  "stop-scrolling": {
    board: "party-ideas",
    headline: "Stop scrolling for a playlist",
    subline: "Someone already sequenced it for you",
  },

  // ---- Board 2: Moody Halloween Aesthetic — atmosphere, save-optimised ----
  "aesthetic-right": {
    board: "moody-aesthetic",
    headline: "You got the aesthetic right",
    subline: "Now get the sound right",
  },
  "elegant-not-costume-shop": {
    board: "moody-aesthetic",
    headline: "Elegant, not costume shop",
    subline: "A Halloween playlist with taste",
  },
  "nothing-orange": {
    board: "moody-aesthetic",
    headline: "Nothing plastic. Nothing orange.",
    subline: "Twenty six songs that earned the atmosphere",
  },
  "october-is-a-feeling": {
    board: "moody-aesthetic",
    headline: "October is a feeling",
    subline: "Here's what it sounds like",
  },
  "house-before-anyone-arrives": {
    board: "moody-aesthetic",
    headline: "The house before anyone arrives",
    subline: "Play this while you light the candles",
  },
  "black-candles-dark-florals": {
    board: "moody-aesthetic",
    headline: "Black candles, dark florals",
    subline: "The playlist that matches the tablescape",
  },
  "beautiful-slightly-wrong": {
    board: "moody-aesthetic",
    headline: "Beautiful and slightly wrong",
    subline: "A Halloween playlist with actual taste",
  },

  // ---- Board 3: Halloween Party Playlists — highest intent, most direct ----
  "sequenced-not-shuffled": {
    board: "party-playlists",
    headline: "Sequenced, not shuffled",
    subline: "Four acts from arrival to comedown",
  },
  "goth-party-playlist": {
    board: "party-playlists",
    headline: "Goth Halloween party playlist",
    subline: "Bauhaus to Nine Inch Nails, properly ordered",
  },
  "free-playlist": {
    board: "party-playlists",
    headline: "Free Halloween playlist",
    subline: "No sign up. Just press play.",
  },
  "curated-by-a-musician": {
    board: "party-playlists",
    headline: "Curated by a musician",
    subline: "Not generated by an algorithm",
  },
  "same-11-songs": {
    board: "party-playlists",
    headline: "Every Halloween playlist is the same 11 songs",
    subline: "This one isn't",
  },
  "made-by-jody-lynn": {
    board: "party-playlists",
    headline: "Made by Jody Lynn",
    // Verified against lib/playlists.ts: Dearly Departed is 4, The Hunted 8,
    // Undertow 15, DARK 22. Re-check these numbers if the tracklist changes.
    subline: "Her songs are 4, 8, 15 and 22",
  },
};

export type Pin = {
  /** Filename in art/pins/inbox, without the extension. */
  file: string;
  /** Key into PIN_COPY. */
  copyId: keyof typeof PIN_COPY;
  /** Playlist this pin drives to. Used in the output filename. */
  slug: string;
  zone: PinZone;
  /** Defaults to the board's colourway in BOARD_BANNER. */
  banner?: PinBanner;
  /** Defaults to "band". */
  treatment?: PinTreatment;
};

/**
 * Image-to-copy assignments.
 *
 * `zone` is set from where each image is actually quiet, checked image by image —
 * a banner dropped on a focal point wastes the photograph. Notably pin-02 and
 * pin-10 avoid "top" because the moon and the pumpkin-house spires are the whole
 * shot; pin-05, pin-12 and pin-13 use "middle" because their calm area is a plain
 * door and open water rather than the sky.
 *
 * Copy is matched to what is literally in the frame wherever possible: the snack
 * board gets "It's not the snacks", the empty gothic kitchen gets "The house
 * before anyone arrives", the styled minimal interior gets "You got the aesthetic
 * right".
 */
export const pins: Pin[] = [
  // --- Moody aesthetic: dark, elegant, save-driven. Cream banner reads hard
  //     against these near-black photographs. ---
  { file: "pin-01", copyId: "house-before-anyone-arrives", slug: "actually-scary", zone: "top" },
  { file: "pin-04", copyId: "black-candles-dark-florals", slug: "actually-scary", zone: "top" },
  { file: "pin-06", copyId: "elegant-not-costume-shop", slug: "actually-scary", zone: "top" },
  { file: "pin-09", copyId: "beautiful-slightly-wrong", slug: "actually-scary", zone: "top" },
  { file: "pin-11", copyId: "aesthetic-right", slug: "actually-scary", zone: "top" },
  // Fantasy pumpkin house: spires and moon are the shot, so the banner goes over
  // the band of mist across the middle.
  { file: "pin-10", copyId: "october-is-a-feeling", slug: "actually-scary", zone: "middle" },

  // --- Party ideas: utility copy on images of an actual party being prepared. ---
  { file: "pin-03", copyId: "party-dies-at-9", slug: "actually-scary", zone: "top" },
  { file: "pin-05", copyId: "planned-everything-but-this", slug: "actually-scary", zone: "middle" },
  { file: "pin-08", copyId: "stop-scrolling", slug: "actually-scary", zone: "top" },
  // Split so the moon at 22% height survives; the subline lands on dark water.
  { file: "pin-02", copyId: "nobody-wants-to-dj", slug: "actually-scary", zone: "split" },

  // --- Party playlists: highest intent. Magenta banner, which is loudest against
  //     the pale pool and the retro kitchen. ---
  { file: "pin-07", copyId: "same-11-songs", slug: "actually-scary", zone: "top" },
  { file: "pin-12", copyId: "free-playlist", slug: "actually-scary", zone: "middle" },
  // Charcoal here so the two near-identical pool shots don't read as one pin.
  {
    file: "pin-13",
    copyId: "curated-by-a-musician",
    slug: "actually-scary",
    zone: "middle",
    banner: "charcoal",
  },
];

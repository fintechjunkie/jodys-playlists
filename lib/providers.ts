import type { Playlist, Provider, Source } from "./playlists";

export const PROVIDER_LABEL: Record<Provider, string> = {
  spotify: "Spotify",
  apple: "Apple Music",
  youtube: "YouTube",
  youtubeMusic: "YouTube Music",
  amazon: "Amazon Music",
  tidal: "Tidal",
  soundcloud: "SoundCloud",
  deezer: "Deezer",
};

/** Brand-ish accent per provider, used only for the link buttons. */
export const PROVIDER_COLOR: Record<Provider, string> = {
  spotify: "#1db954",
  apple: "#fa2d48",
  youtube: "#ff0033",
  youtubeMusic: "#ff0033",
  amazon: "#25d1da",
  tidal: "#38bdf8",
  soundcloud: "#ff5500",
  deezer: "#a238ff",
};

/**
 * Build the iframe src for a source, or return null if it can't be embedded.
 *
 * All three embeddable providers are free and need no API key or app registration.
 * How much a visitor gets depends on *their* session, not on us:
 *   - Spotify: full tracks, plus a save control, if they're logged in to Spotify
 *     in this browser; 30-second previews otherwise.
 *   - Apple Music: full tracks for subscribers; previews otherwise.
 *   - YouTube: full playback for everyone.
 * The "Open in ..." links stay on the page either way — that's the reliable
 * route to saving the whole playlist to an account.
 */
export function embedSrc(source: Source): string | null {
  if (source.embedUrl) return source.embedUrl;
  if (!source.embedId) return null;

  switch (source.provider) {
    case "spotify":
      return `https://open.spotify.com/embed/playlist/${source.embedId}?utm_source=generator&theme=0`;
    case "apple":
      return `https://embed.music.apple.com/us/playlist/${source.embedId}`;
    case "youtube":
      return `https://www.youtube.com/embed/videoseries?list=${source.embedId}`;
    default:
      return null;
  }
}

/** Recommended iframe height per provider. */
export function embedHeight(provider: Provider): number {
  return provider === "youtube" ? 420 : 520;
}

/** The source that should get the on-page player, if any. */
export function embeddableSource(playlist: Playlist): Source | null {
  const preferred = playlist.embedProvider
    ? playlist.sources.find((s) => s.provider === playlist.embedProvider)
    : undefined;
  const candidate = preferred ?? playlist.sources.find((s) => embedSrc(s));
  return candidate && embedSrc(candidate) ? candidate : null;
}

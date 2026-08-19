import type { Source } from "@/lib/playlists";
import { embedHeight, embedSrc, PROVIDER_LABEL } from "@/lib/providers";

export function PlayerEmbed({ source }: { source: Source }) {
  const src = embedSrc(source);
  if (!src) return null;

  return (
    <div className="flex flex-col gap-2">
      <iframe
        src={src}
        title={`${PROVIDER_LABEL[source.provider]} player`}
        height={embedHeight(source.provider)}
        className="w-full"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
      {source.provider === "spotify" ? (
        <p className="text-xs text-muted">
          Logged in to Spotify? You&apos;ll hear full tracks and can save them right here.
          Otherwise the player gives 30-second previews — open it in Spotify to save the
          whole playlist.
        </p>
      ) : null}
    </div>
  );
}

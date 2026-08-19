import type { Source } from "@/lib/playlists";
import { embedHeight, embedSrc, PROVIDER_LABEL } from "@/lib/providers";

export function PlayerEmbed({ source }: { source: Source }) {
  const src = embedSrc(source);
  if (!src) return null;

  return (
    <div className="flex flex-col gap-4">
      <iframe
        src={src}
        title={`${PROVIDER_LABEL[source.provider]} player`}
        height={embedHeight(source.provider)}
        className="w-full max-w-[720px]"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
      {source.provider === "spotify" ? (
        <p className="max-w-[60ch] text-[14px] leading-[1.35] text-forest-ink/70">
          Logged in to Spotify? You&apos;ll hear full tracks and can save them right here.
          Otherwise this gives 30-second previews — open it in Spotify to save the whole
          playlist.
        </p>
      ) : null}
    </div>
  );
}

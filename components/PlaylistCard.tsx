import Link from "next/link";
import { trackCount, type Playlist } from "@/lib/playlists";
import { PROVIDER_LABEL } from "@/lib/providers";
import { Cover } from "./Cover";

export function PlaylistCard({
  playlist,
  priority = false,
}: {
  playlist: Playlist;
  priority?: boolean;
}) {
  const count = trackCount(playlist);

  return (
    <Link
      href={`/${playlist.slug}`}
      className="group flex w-full flex-col gap-4 rounded-2xl border border-edge/70 bg-card p-4 transition hover:border-edge hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
    >
      <Cover
        playlist={playlist}
        priority={priority}
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
      />

      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-lg leading-snug decoration-1 underline-offset-4 group-hover:underline">
          {playlist.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{playlist.tagline}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <span>{count} tracks</span>
        <span aria-hidden>·</span>
        <span>
          {playlist.acts.length} {playlist.acts.length === 1 ? "act" : "acts"}
        </span>
        {playlist.sources.length > 0 ? (
          <>
            <span aria-hidden>·</span>
            <span>{playlist.sources.map((s) => PROVIDER_LABEL[s.provider]).join(", ")}</span>
          </>
        ) : null}
      </div>
    </Link>
  );
}

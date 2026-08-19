import Link from "next/link";
import { trackCount, type Playlist } from "@/lib/playlists";
import { PROVIDER_LABEL } from "@/lib/providers";
import { AnimatedTitle } from "./AnimatedTitle";
import { Cover } from "./Cover";

/**
 * One playlist on the index. Deliberately not a card — the reference forbids
 * card grids, so this is a full-width editorial row: micro-label, oversized
 * title, tagline capped for readability, and a square image slab.
 *
 * `title-sweep` makes the title recolor letter by letter on hover (see
 * globals.css). It's the one interactive flourish on the page.
 */
export function PlaylistRow({
  playlist,
  index,
  priority = false,
}: {
  playlist: Playlist;
  index: number;
  priority?: boolean;
}) {
  const count = trackCount(playlist);

  return (
    <Link
      href={`/${playlist.slug}`}
      className="title-sweep group block border-t border-blush-cream py-12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lipstick-magenta sm:py-15"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
        {/* Asymmetric: image left, type right, never centered. */}
        <div className="w-full max-w-[260px] shrink-0">
          <Cover
            playlist={playlist}
            priority={priority}
            sizes="(max-width: 640px) 90vw, 260px"
          />
        </div>

        <div className="flex flex-col gap-5">
          <p className="label-micro text-lipstick-magenta">
            {String(index + 1).padStart(2, "0")} — {count} tracks · {playlist.acts.length} acts
          </p>

          <AnimatedTitle
            text={playlist.title}
            as="h2"
            className="display-md text-forest-ink"
            delay={index * 90}
          />

          <p className="max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink">
            {playlist.tagline}
          </p>

          <p className="label-micro text-forest-ink/70">
            {playlist.sources.length > 0
              ? playlist.sources.map((s) => PROVIDER_LABEL[s.provider]).join(" · ")
              : "Streaming links coming soon"}
          </p>
        </div>
      </div>
    </Link>
  );
}

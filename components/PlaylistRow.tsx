import Link from "next/link";
import { titleLines, trackCount, type Playlist } from "@/lib/playlists";
import { PROVIDER_LABEL } from "@/lib/providers";
import { AnimatedTitle, HOVER_COLORS } from "./AnimatedTitle";
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
      className="group block border-t border-blush-cream py-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lipstick-magenta"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
        {/* Asymmetric: image left, type right, never centered. */}
        <div className="w-full shrink-0 sm:max-w-[220px]">
          <Cover
            playlist={playlist}
            priority={priority}
            sizes="(max-width: 640px) 100vw, 220px"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="label-micro text-lipstick-magenta">
            {String(index + 1).padStart(2, "0")} — {count} tracks · {playlist.acts.length} acts
          </p>

          {/*
            The cover art now carries the title, burned in. On a phone the cover
            is full width and the title would repeat immediately beneath it,
            which reads as a stutter. Below sm the heading goes screen-reader-only
            — still a real h2 for document structure and SEO, just not printed
            twice. From sm up the cover is a 220px thumbnail beside the type, so
            the title has to be visible there.
          */}
          <AnimatedTitle
            lines={titleLines(playlist)}
            as="h2"
            className="display-md max-sm:sr-only"
            hoverColors={HOVER_COLORS}
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

import Image from "next/image";
import type { Playlist } from "@/lib/playlists";

/**
 * A full-bleed strip of cover art drifting sideways, forever.
 *
 * This replaced a drifting strip of *text* set in blush cream on warm chalk —
 * so low in contrast it was effectively invisible, and it was the only thing
 * between the hero and the index. On a phone that meant the first screen and a
 * half carried no image at all.
 *
 * Decorative, so it is aria-hidden and carries no links: the index directly
 * below has the real ones, and duplicating five links here would just make a
 * screen reader read the whole collection twice.
 *
 * The track is repeated twice and then duplicated, with the animation
 * translating exactly -50%. Two repeats per track is what keeps the strip wider
 * than a desktop viewport, which is what makes the loop seamless. The five
 * distinct URLs are still only five network requests however many times they
 * appear.
 */
export function CoverMarquee({ playlists }: { playlists: Playlist[] }) {
  if (playlists.length === 0) return null;

  const run = [...playlists, ...playlists];

  const track = (key: string) => (
    <div key={key} className="flex shrink-0">
      {run.map((playlist, i) => (
        <div
          key={`${key}-${playlist.slug}-${i}`}
          className="relative mr-3 size-40 shrink-0 sm:mr-4 sm:size-56"
          style={{ background: playlist.accent }}
        >
          <Image
            src={playlist.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 160px, 224px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div aria-hidden className="overflow-hidden py-10 sm:py-15">
      <div className="marquee">
        {track("a")}
        {track("b")}
      </div>
    </div>
  );
}

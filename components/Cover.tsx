import Image from "next/image";
import type { Playlist } from "@/lib/playlists";

/**
 * Cover art with a gradient underneath, so a missing or slow image never
 * leaves a grey hole.
 */
export function Cover({
  playlist,
  sizes,
  priority = false,
}: {
  playlist: Playlist;
  sizes: string;
  priority?: boolean;
}) {
  const [from, to] = playlist.accent;
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-xl"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <Image
        src={playlist.cover}
        alt={`${playlist.title} cover art`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

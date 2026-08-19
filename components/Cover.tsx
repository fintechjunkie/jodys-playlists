import Image from "next/image";
import type { Playlist } from "@/lib/playlists";

/**
 * Cover art as a raw rectangular slab — no rounded corners, no shadow, no
 * frame, per the reference's treatment of imagery. The flat accent color sits
 * underneath so a slow or missing image shows brand color, not a grey hole.
 * (Flat, not a gradient — the system forbids gradients.)
 */
export function Cover({
  playlist,
  sizes,
  priority = false,
  className = "",
}: {
  playlist: Playlist;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden ${className}`}
      style={{ background: playlist.accent[0] }}
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

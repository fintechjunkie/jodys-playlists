import { livePlaylists } from "@/lib/playlists";
import { SITE_TAGLINE } from "@/lib/site";
import { PlaylistCard } from "@/components/PlaylistCard";

export default function Home() {
  const all = livePlaylists();

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="py-14 sm:py-20">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight max-w-2xl leading-[1.1]">
          {SITE_TAGLINE}
        </h1>
        <p className="mt-5 max-w-xl text-muted leading-relaxed">
          {all.length} playlists, made by hand, one mood at a time. Play them here or
          take them with you to Spotify, Apple Music or YouTube.
        </p>
      </section>

      <section aria-label="All playlists" className="pb-8">
        {all.length === 0 ? (
          <p className="text-muted">No playlists yet — check back soon.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((playlist, i) => (
              <li key={playlist.slug} className="flex">
                <PlaylistCard playlist={playlist} priority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

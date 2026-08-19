import { livePlaylists } from "@/lib/playlists";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PlaylistRow } from "@/components/PlaylistRow";
import { TitleMarquee } from "@/components/TitleMarquee";

export default function Home() {
  const all = livePlaylists();

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-15">
      {/* One idea per screen: the hero is a typographic statement, nothing else. */}
      <section className="flex min-h-[82vh] flex-col justify-end pb-30 pt-40">
        <p className="label-micro mb-8 text-forest-ink">Sequenced, not shuffled</p>

        <AnimatedTitle text="Playlists" className="display-xl text-lipstick-magenta" />
        <AnimatedTitle
          text="worth the drive"
          className="display-xl text-bubblegum"
          delay={280}
        />

        <p className="mt-15 max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink">
          {all.length} playlists, each built as a set of acts with the running order
          explained. Play them here or take them to Spotify, Apple Music or YouTube.
        </p>
      </section>

      {/* Faded echo of the statement above, drifting. Decorative only. */}
      <TitleMarquee text="worth the drive —" className="text-blush-cream" />

      <section aria-label="All playlists" className="pt-30">
        <p className="label-micro mb-12 text-lipstick-magenta">The index</p>

        {all.length === 0 ? (
          <p className="text-[20px] text-forest-ink">No playlists yet.</p>
        ) : (
          <ul className="flex flex-col">
            {all.map((playlist, i) => (
              <li key={playlist.slug}>
                <PlaylistRow playlist={playlist} index={i} priority={i < 2} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

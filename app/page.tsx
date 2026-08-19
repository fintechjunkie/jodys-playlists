import { livePlaylists } from "@/lib/playlists";
import { HERO_LINES } from "@/lib/site";
import { AboutCreator } from "@/components/AboutCreator";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { PlaylistRow } from "@/components/PlaylistRow";
import { TitleMarquee } from "@/components/TitleMarquee";

export default function Home() {
  const all = livePlaylists();

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-15">
      {/* One idea per screen: the hero is a typographic statement, nothing else.
          The two lines overlap at line-height 0.70, so they carry different
          colors from the cycle — that separation is what makes it readable. */}
      <section className="flex min-h-[72vh] flex-col justify-end pb-20 pt-32">
        <p className="label-micro mb-8 text-forest-ink">Sequenced, not shuffled</p>

        <AnimatedTitle lines={HERO_LINES} className="display-xl" />

        <p className="mt-12 max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink">
          {all.length} playlists, each built as a set of acts with the running order
          explained. Play them here or take them to Spotify, Apple Music or YouTube.
        </p>

        <AboutCreator className="mt-8" />
      </section>

      {/* Faded echo of the statement above, drifting. Decorative only. */}
      <TitleMarquee text="play them loud —" className="text-blush-cream" />

      <section aria-label="All playlists" className="pt-20">
        <p className="label-micro mb-8 text-lipstick-magenta">The index</p>

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

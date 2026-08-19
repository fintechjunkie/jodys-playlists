import { livePlaylists, trackCount } from "@/lib/playlists";
import { HERO_LINES } from "@/lib/site";
import { AboutCreator } from "@/components/AboutCreator";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { CoverMarquee } from "@/components/CoverMarquee";
import { PlaylistRow } from "@/components/PlaylistRow";

// One shared container. Full-bleed bands sit OUTSIDE it rather than breaking out
// of it with viewport-width tricks — simpler, and immune to scrollbar width.
const CONTAINER = "mx-auto max-w-[1440px] px-6 sm:px-15";

export default function Home() {
  const all = livePlaylists();
  const tracks = all.reduce((sum, p) => sum + trackCount(p), 0);

  return (
    <div>
      {/*
        One idea per screen: the hero is a typographic statement, nothing else.
        The two lines overlap at line-height 0.70, so they carry different colors
        from the cycle — that separation is what makes it readable.

        Shorter on phones than on desktop so the cover strip below is visible
        without scrolling; at 72vh the first screen held no image at all.
      */}
      <section className={`${CONTAINER} flex min-h-[52vh] flex-col justify-end pb-12 pt-24 sm:min-h-[72vh] sm:pb-20 sm:pt-32`}>
        <p className="label-micro mb-6 text-forest-ink sm:mb-8">Sequenced, not shuffled</p>

        <AnimatedTitle lines={HERO_LINES} className="display-xl" />

        <p className="mt-8 max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink sm:mt-12">
          {all.length} playlists, {tracks} tracks, each built as a set of acts with the
          running order explained. Play them here or save them to Spotify.
        </p>

        <AboutCreator className="mt-8" />
      </section>

      <CoverMarquee playlists={all} />

      {/* Full-bleed charcoal band: the landing page is otherwise one flat field
          of cream, and this gives it a structural break that echoes the act
          blocks on the playlist pages. */}
      <section className="bg-charcoal py-12 sm:py-15">
        <div className={CONTAINER}>
          <p className="label-micro mb-3 text-bubblegum">The index</p>
          <h2 className="display-sm text-chartreuse">
            {all.length} playlists, sequenced in acts
          </h2>
        </div>
      </section>

      <section aria-label="All playlists" className={`${CONTAINER} pt-4`}>
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

import type { Act } from "@/lib/playlists";
import { OWN_ARTIST } from "@/lib/site";

/**
 * The act-header block. One scheme for every act: charcoal ground, chartreuse
 * title, bubblegum label, cream note.
 *
 * Deliberately not alternating. A single treatment makes the blocks read as
 * structural rhythm — the same beat repeating down the page — rather than as a
 * colour decision competing for attention with the type sitting on it.
 */
const ACT_BLOCK = {
  bg: "bg-charcoal",
  label: "text-bubblegum",
  title: "text-chartreuse",
  note: "text-warm-chalk",
};

/**
 * The acts, in order, with continuous track numbering across act boundaries —
 * so track 14 is the 14th song you hear, not the 2nd song of act III.
 *
 * Row spacing is deliberately tight. The rest of the site breathes at 120px
 * section gaps, but this is a 26-row list someone is scanning: the act blocks
 * carry the hierarchy, so the whitespace between rows does not have to.
 */
export function Tracklist({
  acts,
  actNoun = "Act",
}: {
  acts: Act[];
  actNoun?: string;
}) {
  // Track number each act starts at.
  const offsets = acts.reduce<number[]>(
    (acc, act, i) => [...acc, acc[i] + act.tracks.length],
    [0],
  );

  return (
    <div className="flex flex-col gap-16">
      {acts.map((act, actIndex) => {
        const start = offsets[actIndex];

        return (
          <section key={`${act.number}-${act.title}`} className="flex flex-col gap-4">
            <header className="relative isolate py-8 sm:py-10">
              {/*
                Full-bleed color block. The tracklist sits in a centred
                max-width container, so the block breaks out of it: pinned to the
                container's horizontal centre, then pulled back half a viewport
                and made a full viewport wide. Body has overflow-x clipped to
                absorb the scrollbar that 100vw includes.
              */}
              <div
                aria-hidden
                className={`absolute inset-y-0 left-1/2 -z-10 -ml-[50vw] w-[100vw] ${ACT_BLOCK.bg}`}
              />

              {/*
                "ACT III" is set as one display unit, at display scale. A bare
                oversized numeral doesn't tell anyone it's an act, and the word
                shrunk to 12px was too small to do that job — so the noun and its
                value stay together and stay large. Works identically for
                "MINUTES 30-47" on the time-structured playlist.
              */}
              <p className={`display-sm mb-2 ${ACT_BLOCK.label}`}>
                {actNoun} {act.number}
              </p>
              <h3 className={`display-md ${ACT_BLOCK.title}`}>{act.title}</h3>
              {act.note ? (
                <p className={`mt-4 max-w-[60ch] text-[20px] leading-[1.2] ${ACT_BLOCK.note}`}>
                  {act.note}
                </p>
              ) : null}
            </header>

            <ol className="flex flex-col">
              {act.tracks.map((track, i) => {
                const isOwn = track.artist === OWN_ARTIST;

                return (
                  <li
                    key={`${track.artist}-${track.title}`}
                    className="flex items-baseline gap-4 border-b border-blush-cream py-1.5"
                  >
                    <span className="w-6 shrink-0 text-right text-[12px] tabular-nums text-lipstick-magenta">
                      {start + i + 1}
                    </span>

                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span
                        className={`text-[16px] leading-[1.25] ${
                          isOwn ? "font-bold text-lipstick-magenta" : "text-forest-ink"
                        }`}
                      >
                        {track.title}
                      </span>
                      <span className="text-[13px] text-forest-ink/70">{track.artist}</span>
                      {isOwn ? (
                        <span className="rounded-full bg-blush-cream px-[8px] py-[1px] text-[10px] font-medium uppercase tracking-[0.12em] text-forest-ink">
                          Jody
                        </span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

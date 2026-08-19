import type { Act } from "@/lib/playlists";
import { OWN_ARTIST } from "@/lib/site";

/**
 * The acts, in order, with continuous track numbering across act boundaries —
 * so track 14 is the 14th song you hear, not the 2nd song of act III.
 *
 * Spacing is deliberately tight here. The rest of the site breathes at 120px
 * section gaps, but this is a 26-row list someone is scanning: the act headers
 * carry the hierarchy, so the whitespace between rows doesn't have to. The
 * oversized act numeral sits beside the title rather than above it, which buys
 * emphasis without buying vertical space.
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
            <header className="border-b-2 border-lipstick-magenta pb-3">
              {/* Just the noun — the oversized numeral below supplies the value,
                  so "MINUTES" over "12-30" reads as a time block without saying
                  the number twice. */}
              <p className="label-micro mb-2 text-forest-ink/70">{actNoun}</p>
              <div className="flex items-baseline gap-4">
                <span
                  aria-hidden
                  className="display-md shrink-0 text-bubblegum"
                >
                  {act.number}
                </span>
                <h3 className="display-sm text-lipstick-magenta">
                  <span className="sr-only">{actNoun} {act.number}. </span>
                  {act.title}
                </h3>
              </div>
              {act.note ? (
                <p className="mt-2 max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink">
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

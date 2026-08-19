import type { Act } from "@/lib/playlists";
import { OWN_ARTIST } from "@/lib/site";

/**
 * The acts, in order, with continuous track numbering across act boundaries —
 * so track 14 is the 14th song you hear, not the 2nd song of act III.
 *
 * Each act is headed by an oversized numeral and its note; the note is the
 * product, so it gets body-size type rather than caption treatment.
 */
export function Tracklist({ acts }: { acts: Act[] }) {
  // Track number each act starts at.
  const offsets = acts.reduce<number[]>(
    (acc, act, i) => [...acc, acc[i] + act.tracks.length],
    [0],
  );

  return (
    <div className="flex flex-col gap-30">
      {acts.map((act, actIndex) => {
        const start = offsets[actIndex];

        return (
          <section key={`${act.number}-${act.title}`} className="flex flex-col gap-8">
            <header className="flex flex-col gap-4">
              <p className="label-micro text-lipstick-magenta">Act {act.number}</p>
              <h3 className="display-sm text-forest-ink">{act.title}</h3>
              <p className="max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink">
                {act.note}
              </p>
            </header>

            <ol className="flex flex-col">
              {act.tracks.map((track, i) => {
                const isOwn = track.artist === OWN_ARTIST;

                return (
                  <li
                    key={`${track.artist}-${track.title}`}
                    className="flex items-baseline gap-5 border-t border-blush-cream py-3 last:border-b last:border-b-blush-cream"
                  >
                    <span className="w-7 shrink-0 text-right text-[12px] tabular-nums text-lipstick-magenta">
                      {start + i + 1}
                    </span>

                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span
                        className={`text-[20px] leading-[1.2] ${
                          isOwn ? "font-bold text-lipstick-magenta" : "text-forest-ink"
                        }`}
                      >
                        {track.title}
                      </span>
                      <span className="text-[14px] text-forest-ink/70">{track.artist}</span>
                      {isOwn ? (
                        <span className="rounded-full bg-blush-cream px-[10px] py-[3px] text-[10px] font-medium uppercase tracking-[0.14em] text-forest-ink">
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

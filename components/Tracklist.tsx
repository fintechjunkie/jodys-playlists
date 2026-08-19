import type { Act } from "@/lib/playlists";
import { OWN_ARTIST } from "@/lib/site";

/**
 * The acts, in order, with continuous track numbering across act boundaries —
 * so track 14 is the 14th song you hear, not the 2nd song of act III.
 */
export function Tracklist({ acts }: { acts: Act[] }) {
  // Track number each act starts at, so numbering runs 1..n across the whole set.
  const offsets = acts.reduce<number[]>(
    (acc, act, i) => [...acc, acc[i] + act.tracks.length],
    [0],
  );

  return (
    <div className="flex flex-col gap-12">
      {acts.map((act, actIndex) => {
        const start = offsets[actIndex];

        return (
          <section key={`${act.number}-${act.title}`} className="flex flex-col gap-5">
            <header className="flex flex-col gap-1.5 border-l-2 border-edge pl-4">
              <h3 className="font-display text-lg leading-tight">
                <span className="text-muted">Act {act.number}.</span> {act.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed max-w-xl">{act.note}</p>
            </header>

            <ol className="flex flex-col">
              {act.tracks.map((track, i) => {
                const isOwn = track.artist === OWN_ARTIST;
                return (
                  <li
                    key={`${track.artist}-${track.title}`}
                    className="flex items-baseline gap-4 border-b border-edge/40 py-2.5 last:border-b-0"
                  >
                    <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted">
                      {start + i + 1}
                    </span>
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className={isOwn ? "font-medium" : ""}>{track.title}</span>
                      <span className="text-sm text-muted">{track.artist}</span>
                      {isOwn ? (
                        <span className="rounded-full border border-edge px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
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

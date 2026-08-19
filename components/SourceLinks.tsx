import type { Source } from "@/lib/playlists";
import { PROVIDER_LABEL } from "@/lib/providers";

/**
 * Streaming links as pill tags — forest ink on blush cream, fully rounded, no
 * border, no shadow. Provider brand colors are deliberately not used: the
 * reference allows only its own palette, and eight competing brand greens and
 * reds would wreck the page.
 */
export function SourceLinks({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return (
      <p className="label-micro text-forest-ink/70">
        Streaming links are on the way — this one is being finalized
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {sources.map((source) => (
        <a
          key={`${source.provider}-${source.url}`}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-blush-cream px-[15px] py-[7px] text-[14px] font-medium text-forest-ink transition-colors hover:bg-lipstick-magenta hover:text-warm-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lipstick-magenta"
        >
          Open in {PROVIDER_LABEL[source.provider]} ↗
        </a>
      ))}
    </div>
  );
}

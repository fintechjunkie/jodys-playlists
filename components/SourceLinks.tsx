import type { Source } from "@/lib/playlists";
import { PROVIDER_COLOR, PROVIDER_LABEL } from "@/lib/providers";

export function SourceLinks({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return (
      <p className="text-sm text-muted">
        Streaming links are on the way — this one is being finalized.
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
          className="inline-flex items-center gap-2 rounded-full border border-edge px-4 py-2 text-sm font-medium transition hover:bg-ink-soft"
        >
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ background: PROVIDER_COLOR[source.provider] }}
          />
          Open in {PROVIDER_LABEL[source.provider]}
        </a>
      ))}
    </div>
  );
}

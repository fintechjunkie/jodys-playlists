import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaylist, livePlaylists, trackCount } from "@/lib/playlists";
import { embeddableSource } from "@/lib/providers";
import { playlistUrl, SITE_NAME } from "@/lib/site";
import { Cover } from "@/components/Cover";
import { PlayerEmbed } from "@/components/PlayerEmbed";
import { SourceLinks } from "@/components/SourceLinks";
import { Tracklist } from "@/components/Tracklist";

type Params = { params: Promise<{ slug: string }> };

/** Prerender every playlist at build time; nothing here is dynamic. */
export function generateStaticParams() {
  return livePlaylists().map((p) => ({ slug: p.slug }));
}

/** A slug that isn't in the data file is a 404, not a miss-and-render. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const playlist = getPlaylist(slug);
  if (!playlist) return {};

  return {
    title: playlist.title,
    description: playlist.tagline,
    // Canonical is always the path form, so the ad subdomains never compete
    // with it for the same search result.
    alternates: { canonical: playlistUrl(playlist.slug) },
    openGraph: {
      title: `${playlist.title} — ${SITE_NAME}`,
      description: playlist.tagline,
      url: playlistUrl(playlist.slug),
      images: [{ url: playlist.cover }],
    },
  };
}

export default async function PlaylistPage({ params }: Params) {
  const { slug } = await params;
  const playlist = getPlaylist(slug);
  if (!playlist) notFound();

  const embed = embeddableSource(playlist);
  const [from, to] = playlist.accent;
  const count = trackCount(playlist);

  return (
    <div>
      {/* Ambient wash pulled from the playlist's own accent colors. */}
      <div
        aria-hidden
        className="h-56 w-full opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(70% 100% at 50% 0%, ${to}, ${from} 65%, transparent)`,
        }}
      />

      <div className="mx-auto -mt-40 max-w-3xl px-6">
        <header className="flex flex-col gap-8 sm:flex-row sm:items-end">
          <div className="w-40 shrink-0 sm:w-52">
            <Cover playlist={playlist} priority sizes="208px" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              {playlist.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              <span>{count} tracks</span>
              <span aria-hidden>·</span>
              <span>
                {playlist.acts.length} {playlist.acts.length === 1 ? "act" : "acts"}
              </span>
              {playlist.duration ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{playlist.duration}</span>
                </>
              ) : null}
            </div>
          </div>
        </header>

        {/* The pitch. Read this before deciding whether to press play. */}
        <div className="mt-10 max-w-2xl">
          <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-200">
            {playlist.description}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <SourceLinks sources={playlist.sources} />
          {embed ? <PlayerEmbed source={embed} /> : null}
        </div>

        <hr className="my-14 border-edge/50" />

        <section aria-label="Tracklist">
          <h2 className="mb-10 font-display text-2xl tracking-tight">The sequence</h2>
          <Tracklist acts={playlist.acts} />
        </section>

        {playlist.tags?.length ? (
          <ul className="mt-14 flex flex-wrap gap-2">
            {playlist.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-edge px-3 py-1 text-xs text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href="/"
          className="mt-14 inline-block text-sm text-muted underline underline-offset-4 hover:text-text"
        >
          All playlists
        </Link>
      </div>
    </div>
  );
}

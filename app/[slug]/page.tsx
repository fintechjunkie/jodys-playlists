import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaylist, livePlaylists, titleLines, trackCount } from "@/lib/playlists";
import { embeddableSource } from "@/lib/providers";
import { playlistUrl, SITE_NAME } from "@/lib/site";
import { AboutCreator } from "@/components/AboutCreator";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { Cover } from "@/components/Cover";
import { PlayerEmbed } from "@/components/PlayerEmbed";
import { SourceLinks } from "@/components/SourceLinks";
import { TitleMarquee } from "@/components/TitleMarquee";
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
  const count = trackCount(playlist);

  return (
    <div>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-15">
        {/* Hero: the title arrives letter by letter, bottom-anchored, no image
            competing with it. The type is the layout. */}
        <header className="flex min-h-[56vh] flex-col justify-end pb-10 pt-32">
          <p className="label-micro mb-8 text-forest-ink">
            {count} tracks · {playlist.acts.length} acts
            {playlist.duration ? ` · ${playlist.duration}` : ""}
          </p>

          {/* Lines are color-cycled: at line-height 0.70 they overlap, so
              consecutive lines must differ in color to stay legible. */}
          <AnimatedTitle lines={titleLines(playlist)} className="display-lg" />
        </header>
      </div>

      {/* The title again as a drifting echo band — the dynamic counterpoint to
          the statement above. */}
      <TitleMarquee text={`${playlist.title} —`} className="text-bubblegum" />

      <div className="mx-auto max-w-[1440px] px-6 sm:px-15">
        {/* The pitch. This is what someone reads before deciding to press play. */}
        <section className="flex flex-col gap-10 pt-20 sm:flex-row sm:gap-12">
          <div className="w-full max-w-[320px] shrink-0">
            <Cover playlist={playlist} priority sizes="(max-width: 640px) 90vw, 320px" />
          </div>

          <div className="flex flex-col gap-8">
            <p className="max-w-[60ch] whitespace-pre-line text-[20px] leading-[1.2] text-forest-ink">
              {playlist.description}
            </p>

            <SourceLinks sources={playlist.sources} />

            <AboutCreator />

            {playlist.tags?.length ? (
              <ul className="flex flex-wrap gap-2">
                {playlist.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-blush-cream px-[15px] py-[7px] text-[12px] font-medium text-forest-ink"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        {embed ? (
          <section className="pt-20">
            <p className="label-micro mb-8 text-lipstick-magenta">Listen</p>
            <PlayerEmbed source={embed} />
          </section>
        ) : null}

        <section aria-label="Tracklist" className="pt-20">
          <p className="label-micro mb-8 text-forest-ink">
            {playlist.acts.length} {playlist.acts.length === 1 ? "act" : "acts"}, in order
          </p>
          <AnimatedTitle
            lines={["The sequence"]}
            as="h2"
            className="display-md mb-12"
          />
          <Tracklist acts={playlist.acts} actNoun={playlist.actNoun} />
        </section>

        <Link
          href="/"
          className="label-micro mt-20 inline-block text-lipstick-magenta hover:text-forest-ink"
        >
          ← All playlists
        </Link>
      </div>
    </div>
  );
}

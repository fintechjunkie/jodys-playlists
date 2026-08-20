# Jody's Playlists

Next.js 16 + Tailwind 4, deployed on Vercel. Every playlist is prerendered as
static HTML at build time, so the site is fast and costs nothing to serve.

## Image assets — covers and pins

Two commands produce every image asset. Both depend on typefaces committed under
`art/fonts/` — **do not delete them**, or the pipelines emit untitled output.

```bash
npm run covers              # art/inbox      -> public/covers + art/spotify
npm run pins                # art/pins/inbox -> art/pins/out
npm run pins -- --variants  # treatment mockups for review
```

**[docs/ASSET-PIPELINE.md](docs/ASSET-PIPELINE.md) is the authoritative record** —
the locked typefaces and why they were chosen, and every threshold that was arrived
at by measuring the real artwork rather than guessing. Read it before changing
either script; several of the constants in there look arbitrary and are not.

**[docs/pin-copy-library.md](docs/pin-copy-library.md)** holds all fifty supplied
pin headlines, which are in use, and accuracy notes — including three lines that
overstate the playlist runtime and should be fixed before they run as paid creative.

## Design system

The visual language is the Agence Foudre editorial reference, vendored at
[`docs/DESIGN.md`](docs/DESIGN.md). **Read it before changing any styling.** The
tokens live in the `@theme` block of [`app/globals.css`](app/globals.css).

Rules that are easy to violate by reflex:

- **No shadows, no gradients, no glass.** The system is flat on purpose; depth
  comes from type scale and color contrast.
- **No card grids.** The index is full-width editorial rows. Structure comes
  from whitespace (60–120px section gaps) and typographic scale.
- **Body text is `forest-ink` (#00522d), never black.** Black is for icons and
  line art only. Magenta is punctuation — never a background for large areas.
- **Body copy caps at 60ch** regardless of viewport.
- **Left-align everything.** No symmetric centered layouts.
- **Two type families only.** `display-*` classes (Anton) for display, Inter for
  everything functional. Never set display type below 30px.

Two deliberate deviations from the reference, both documented in the CSS:

1. Beni and Clash Grotesk aren't freely licensed, so we use **Anton** and
   **Inter** — both named on the reference's own substitute list, self-hosted
   through `next/font`.
2. Display sizes use `clamp()` rather than the reference's fixed
   46/80/94/130/230px. The ranges hit those values at desktop widths and
   collapse proportionally below, which is the responsive behavior it asks for.

### Motion

Titles are the only animated thing on the site, and that's the point — the
stillness everywhere else is what makes them read as deliberate.

- [`AnimatedTitle`](components/AnimatedTitle.tsx) staggers each character into
  place. The stagger is an inline `--i` custom property feeding a CSS
  `animation-delay`, so it stays a **server component** and animates before any
  JS arrives. Characters are `aria-hidden` behind an `aria-label` so screen
  readers get whole words, not spelling.
- [`TitleMarquee`](components/TitleMarquee.tsx) drifts a faded echo of the title
  sideways behind the hero. The track is duplicated and translated exactly -50%,
  so the loop is seamless with no JS measuring anything.
- Index rows sweep their title from the pink cycle into a **green** cycle on hover,
  letter by letter. The hover colours sit on each line (see `HOVER_COLORS` in
  AnimatedTitle) and the characters inherit them, so one inherited colour change
  still animates per character. It has to be a cycle for the same reason the resting
  colours do: at line-height 0.70 the lines overlap, and sweeping every line to one
  flat green makes a multi-line title merge into an unreadable mass.
- Hover recolor is a `transition`, not an `animation`, so it never fights the
  entrance keyframes.

Everything above is disabled under `prefers-reduced-motion`. Keep it that way.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # what Vercel runs; catches type errors
npm run lint
```

## Adding a playlist

Everything lives in [`lib/playlists.ts`](lib/playlists.ts). Append an object to
`playlists`, commit, push. Vercel builds and deploys it. There is no CMS and no
database on purpose.

Required fields: `slug`, `title`, `tagline`, `description`, `cover`, `accent`,
`acts`, `sources`, `published`. Track count is derived from `acts` — don't
maintain it by hand.

Notes:

- **`slug` is permanent.** It is the page URL *and* the ad-campaign subdomain.
  Changing it breaks every link already printed in an ad.
- **`sources` may be empty.** The page then shows "streaming links are on the
  way" instead of dead buttons. Fill it in before you advertise the playlist.
- **`accent`** is a single hex color, painted behind the cover while the image
  loads. `npm run covers` samples the artwork and prints the value to paste in.
- **`cover` is written by `npm run covers`, not by hand.** Filenames carry a
  content hash so replacing art cannot be defeated by browser or CDN caching; the
  script repoints this field itself.
- Tracks by `Jody Lynn` (the exact string in `OWN_ARTIST`, see
  [`lib/site.ts`](lib/site.ts)) get a marker in the tracklist automatically.

## URLs and ad campaigns

Two hostnames reach every playlist:

| Form | Example | Use |
| --- | --- | --- |
| Path (canonical) | `violetelixir.com/revenge-dressing` | Organic, sharing, SEO |
| Subdomain | `revenge-dressing.violetelixir.com` | Ad creative |

The subdomain is handled by [`proxy.ts`](proxy.ts), which rewrites
`<slug>.<domain>/` to `/<slug>`. A **single wildcard DNS record covers every
playlist**, so adding a playlist is still one file edit — no DNS work per campaign.

Only known slugs are rewritten; `www`, the apex domain, and `*.vercel.app`
preview URLs pass straight through.

`generateMetadata` sets `rel=canonical` to the path form on both hostnames, so
the two never compete for the same search result and the subdomain accumulates
no separate SEO identity.

### DNS setup (once)

At your registrar, for the domain you bought:

```
A      @      76.76.21.21          # apex -> Vercel
CNAME  www    cname.vercel-dns.com
CNAME  *      cname.vercel-dns.com # every playlist subdomain
```

Then in Vercel → Project → Settings → Domains, add `violetelixir.com`,
`www.violetelixir.com`, and `*.violetelixir.com`. Confirm the wildcard is
available on your Vercel plan; if it is not, add subdomains individually for
just the playlists you are actively advertising — the proxy handles both cases
identically.

Set `NEXT_PUBLIC_SITE_DOMAIN` in Vercel's environment variables to the real
domain. It defaults to `violetelixir.com` (see [`lib/site.ts`](lib/site.ts)).

## Playback and saving

The on-page player is a provider `<iframe>`. Free, no API key, no app
registration, no per-play cost. What a visitor gets depends on *their* session:

- **Spotify** — logged in to Spotify in that browser: full tracks plus a save
  control. Not logged in: 30-second previews.
- **Apple Music** — full tracks for subscribers, previews otherwise.
- **YouTube** — full playback for everyone.

The "Open in ..." buttons stay on the page regardless. That is the reliable
route to saving a whole playlist to an account, and it is what ad traffic should
be measured against.

A real "save this playlist to your Spotify" button on our own site is possible
and free to run, but needs Spotify OAuth and a registered Spotify app. Note that
a Spotify app in development mode is limited to a small number of manually
allowlisted users until Spotify approves an extension request. Treat it as a
later phase, not a launch requirement.

## Deploying

Push to `main`. Vercel builds and promotes it to production. Pull requests get
their own preview URL automatically.

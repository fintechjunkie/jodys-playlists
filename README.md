# Jody's Playlists

Next.js 16 + Tailwind 4, deployed on Vercel. Every playlist is prerendered as
static HTML at build time, so the site is fast and costs nothing to serve.

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
- Index rows sweep their title into magenta letter by letter on hover
  (`.title-sweep`). Hover recolor is a `transition`, not an `animation`, so it
  never fights the entrance keyframes.

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
- **`cover`** can be a local file in `public/covers/` or a remote URL from a
  provider CDN. Allowlisted hosts are in [`next.config.ts`](next.config.ts) —
  add any others there, or Next will refuse to optimize the image.
- **`accent`** is two hex colors. They draw the card gradient before the image
  loads and the glow behind the playlist header, so pick them from the cover art.
- Tracks by `Jody Lynn` (the exact string in `OWN_ARTIST`, see
  [`lib/site.ts`](lib/site.ts)) get a marker in the tracklist automatically.

## URLs and ad campaigns

Two hostnames reach every playlist:

| Form | Example | Use |
| --- | --- | --- |
| Path (canonical) | `jodysplaylists.com/revenge-dressing` | Organic, sharing, SEO |
| Subdomain | `revenge-dressing.jodysplaylists.com` | Ad creative |

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

Then in Vercel → Project → Settings → Domains, add `jodysplaylists.com`,
`www.jodysplaylists.com`, and `*.jodysplaylists.com`. Confirm the wildcard is
available on your Vercel plan; if it is not, add subdomains individually for
just the playlists you are actively advertising — the proxy handles both cases
identically.

Set `NEXT_PUBLIC_SITE_DOMAIN` in Vercel's environment variables to the real
domain. It defaults to `jodysplaylists.com` (see [`lib/site.ts`](lib/site.ts)).

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

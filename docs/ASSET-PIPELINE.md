# Asset Pipeline — Covers and Pins

The definitive record of how image assets are produced, which typefaces they use,
and which decisions were arrived at by measurement rather than preference.

Two commands produce every image asset:

```bash
npm run covers              # playlist covers  (art/inbox      -> public/covers + art/spotify)
npm run pins                # Pinterest pins   (art/pins/inbox -> art/pins/out)
npm run pins -- --variants  # treatment mockups for review
```

---

## Typefaces — locked

**Two faces, everywhere.** The website, the playlist covers and the Pinterest pins
all use the same pair, which is what makes the covers look like the site.

| Role | Face | Weight | Used by |
|---|---|---|---|
| Display / headlines | **Anton** | 400 (the weight is baked in; Anton ships one) | site `display-*` classes, cover titles, pin headlines |
| Body / labels / sublines | **Inter** | 400–700 | site body copy, pin sublines and brand line |

### Why these two

The original design reference (`docs/DESIGN.md`) specifies **Beni** for display and
**Clash Grotesk** for body. Neither is freely licensable or self-hostable, so we use
the substitutes the reference itself names: Anton for Beni (ultra-black condensed
display) and Inter for Clash Grotesk. This is a deliberate, documented deviation —
not an accident.

### Where the files live — do not delete

```
art/fonts/Anton-Regular.ttf     170,812 bytes   sha256 a4ba3a92350ebb03…
art/fonts/Inter-SemiBold.ttf    876,576 bytes   sha256 29160a80ff49ddca…
```

Both are **committed to the repository**, on purpose. The image scripts load them
from disk with `GlobalFonts.registerFromPath`, so without these files
`npm run covers` and `npm run pins` produce untitled or wrongly-set output. Vendoring
them means the pipeline works on any machine with no download step and can never
silently drift to a different version of the face.

Registered aliases (so the two scripts cannot collide):

| File | Alias in make-covers.mjs | Alias in make-pins.mjs |
|---|---|---|
| Anton-Regular.ttf | `AntonCover` | `AntonPin` |
| Inter-SemiBold.ttf | — (covers use Anton only) | `InterPin` |

The **website** loads the same two faces separately, through `next/font/google` in
`app/layout.tsx`, which self-hosts them at build time. So the faces are pinned in two
independent places; if you change one, change the other.

`Inter-SemiBold.ttf` is actually the Inter **variable** font (`Inter[opsz,wght].ttf`)
saved under that name. It renders at a semibold-ish default weight, which is what the
pin sublines want.

---

## Playlist covers

Source art in `art/inbox/<slug>.png`, output:

| Output | Size | Purpose |
|---|---|---|
| `public/covers/<slug>-<hash>.jpg` | source resolution, capped 1600 | the website |
| `art/spotify/<slug>-cover.jpg` | source resolution, capped 3000 | upload to Spotify / Apple |

Both carry the title burned in. Title ink is `coverInk` per playlist in
`lib/playlists.ts`, either `magenta` or `forest` — always the one that **contrasts
with the artwork's motif**, because magenta type on a magenta motif disappears at
thumbnail size.

### How the title is placed

The art is composed leaving the lower frame empty, so the title sets directly onto
bare paper. There is no colour band. The clear height differs per image, so it is
**measured, not assumed**.

`clearZoneTop()` samples the image down to 256px wide, takes the paper colour from
the bottom-left corner, then scans rows upward until a row carries too many
non-paper pixels.

**The thresholds came from profiling the real artwork, and the first attempt was
wrong.** Keyed on a summed RGB distance of 60, it reported clear zones of 0–4% on
covers that plainly had 25–30% — the paper grain was reading as artwork. Measuring
pixel coverage per 5% band across all five covers showed:

- clear paper rows: **0.0–0.2%** of pixels beyond a summed distance of 120
- first artwork rows: **18–70%**

So the threshold is **distance 120, with a 3% per-row allowance**. Measured clear
zones with those values: 25%, 30%, 25%, 32%, 25% — matching visual inspection.

### Other measured decisions

- **Line height comes from real glyph bounding boxes**, not a ratio. Anton's cap
  height is unusually large relative to its em box, so a guessed leading (the site
  uses 0.70) makes cover lines physically collide. First render of the four-line
  Halloween title was illegible mush because of this.
- **Cover line breaks are recomputed for a square frame**, not reused from the
  site's authored breaks. Every possible set of break points is tried and the one
  minimising the *widest rendered line* wins — that is the same thing as maximising
  the type size that fits. A greedy packer gave `HALLOWEEN / PARTY, ACTUALLY SCARY`
  and wasted a third of the width; the exact search gave `HALLOWEEN PARTY, /
  ACTUALLY SCARY` at 379px instead of 302px.
- **Output never upscales.** Source art arrived at 1254px, and upscaling to 3000
  adds no detail while visibly softening the halftone texture the covers depend on.
- **Filenames carry a content hash.** Without it, replacing a cover leaves the URL
  unchanged and browsers and CDNs keep serving the old picture indefinitely — which
  happened, and looked like the new art had not been written. The script prunes
  superseded versions and repoints `lib/playlists.ts` itself.
- **`accent` is sampled from the artwork** and printed for pasting. It keys on
  saturation alone (motif colours are 80+ apart, this paper only ~30), after an
  earlier version suggested `#f4e7d4` — the paper — for a cover.

---

## Pinterest pins

Source art in `art/pins/inbox/<name>.png`, copy and assignments in `lib/pins.ts`,
output grouped by board in `art/pins/out/<board>/<slug>--<copyId>.jpg` so a board's
folder can be scheduled as one batch.

Aspect ratio is **preserved and never cropped** — the quiet zone was composed
deliberately, and cropping would slide the banner off it. Long edge capped at 2000px.

### Zones

Set per image from where the photograph is actually quiet:

| Zone | Placement |
|---|---|
| `top` | one band across the top 30% |
| `middle` | one band across the middle 30% |
| `split` | headline in the top 20%, subline in the bottom 20% |

Chosen individually, not by template. `pin-02` uses `split` so the moon at 22%
height survives; `pin-10` uses `middle` because the pumpkin-house spires are the
subject and its calm band is the mist across the centre.

### Treatments

| Treatment | What it is | Where it works |
|---|---|---|
| `band` | solid block, full width | high-intent boards; any image whose quiet zone is bright and busy |
| `tag` | block sized to the text | rarely useful — with a long headline it fills the width and renders nearly identically to `band` |
| `bare` | no block; type on the photograph | dark, tonally consistent images. Transformative there |
| `rule` | `bare` plus a short brand rule above the headline | mid-tone images; keeps brand structure without covering anything |

`bare` and `rule` pick type colour by **measuring what is behind the text**
(`zoneProfile`) rather than laying a scrim over the photograph to force one. A scrim
would reintroduce the same problem in softer form, and the design system bans
gradients.

**Measure the extremes, not the mean.** The first version averaged the band's
luminance, and a band that is pale sky on one side and dark foliage on the other
averages to a comfortable mid grey — so it chose light ink and the headline set
white on white. `zoneProfile` instead reports the share of pixels too bright to
hold chalk type and the share too dark to hold charcoal type. The smaller share
picks the ink; the larger one is the risk.

**Blockless type is refused when neither ink survives.** `adaptiveTheme` returns
null above a conflict of `MAX_CONFLICT`, and that band falls back to a solid block
on its own — per band, because a `split` pin's top and bottom are different
pictures. Measured across every band of every pin:

| Conflict | Bands |
|---|---|
| 0.00–0.03 | every band that reads cleanly on inspection |
| 0.22 | pale sky, gold canopy and a dark trunk in one band |
| 0.42 | overcast sky beside a dark bus shelter — headline was white on white |

Nothing real lands between 0.03 and 0.22, so the cut sits mid-gap at **0.1**, far
from either cluster. Every render prints its conflict figure, so an image landing
in the gap says so rather than quietly looking wrong.

Preview all four side by side with `npm run pins -- --variants`, which renders a
dark, a bright and a mid-tone sample into `art/pins/variants/<treatment>/`.

**Known limit:** blockless type needs a tonally *consistent* quiet zone, not just
a bright or a dark one. This is now detected rather than remembered — see the
conflict table above — but the underlying constraint has not gone away. An image
whose quiet zone spans both extremes will be given a block, and if you want it
blockless the fix is a different zone or different art, not a lower threshold.

### Per-board treatment

`treatment` still defaults to `band`, so the first thirteen pins are unchanged.
`pin-14` onward set `treatment: "rule"` explicitly.

| Board | Recommended | Reason |
|---|---|---|
| `moody-aesthetic` | `bare` | dark controlled images; saves come from looking like content |
| `party-ideas` | `rule` | mid-tone interiors; rule keeps brand presence without a block |
| `party-playlists` | `band` | high intent, and the pool shots need the block for legibility |

### Banner colourways

One per board by default, so the three boards read as three campaigns rather than
one repeated template. Override per pin with `banner:`.

| Board | Banner | Headline | Subline |
|---|---|---|---|
| `party-ideas` | charcoal | chartreuse | cream |
| `moody-aesthetic` | cream | magenta | forest |
| `party-playlists` | magenta | cream | cream |

Every pin also carries a small `JODY'S PLAYLISTS` line above the headline. Swap this
for the real domain once it is live, so a screenshotted pin still leads somewhere —
one string in `scripts/make-pins.mjs`.

---

## Shared implementation notes

Both scripts independently contain:

- `balanceLines()` — exhaustive search for the line break minimising the widest
  rendered line
- `lineHeightFor()` / `measuredLineHeight()` — leading from real glyph bounds
- `fitText()` / `fitTitle()` — largest size that fits a box

They are duplicated rather than shared. If a third generator appears, extract them.

Both read playlist and pin data from `lib/` via Node's native TypeScript support, so
the assets can never drift from the site's own content.

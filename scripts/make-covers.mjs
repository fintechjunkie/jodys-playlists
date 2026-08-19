/**
 * Cover art pipeline.
 *
 *   Drop raw art in  art/inbox/<slug>.(png|jpg|jpeg|webp)
 *   Run              npm run covers
 *
 * For each file whose name matches a playlist slug it writes two assets:
 *
 *   public/covers/<slug>.jpg        1600px, NO text — used by the site, which
 *                                   already sets the title in huge type right
 *                                   beside the image.
 *   art/spotify/<slug>-cover.jpg    3000px, WITH the title burned in — for
 *                                   uploading to Spotify/Apple, where there is
 *                                   no surrounding layout to carry the name.
 *
 * The title is set in Anton (the same face the site uses) on a flat band in a
 * brand color, because we can't know where the artwork leaves empty space —
 * a band guarantees legibility over any composition. Flat fill, no gradient,
 * per the style reference.
 *
 * Playlist titles and line breaks come from lib/playlists.ts, so the covers can
 * never drift from the site.
 */

import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { livePlaylists } from "../lib/playlists.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = path.join(ROOT, "art", "inbox");
const SPOTIFY_OUT = path.join(ROOT, "art", "spotify");
const SITE_OUT = path.join(ROOT, "public", "covers");
const FONTS = path.join(ROOT, "art", "fonts");

// Palette — must match app/globals.css.
const WARM_CHALK = "#fff8f6";
const LIPSTICK_MAGENTA = "#db3c8a";
const FOREST_INK = "#00522d";

// Target sizes. Actual output is capped at the source resolution — upscaling
// adds no detail and visibly softens the halftone texture these covers depend
// on, so a 1254px original ships at 1254px rather than pretending to be 3000.
const SPOTIFY_SIZE = 3000;
const SITE_SIZE = 1600;

/** Output size for a target, never exceeding what the source actually has. */
function outputSize(target, image) {
  return Math.min(target, Math.min(image.width, image.height));
}

const ACCEPTED = new Set([".png", ".jpg", ".jpeg", ".webp"]);

GlobalFonts.registerFromPath(path.join(FONTS, "Anton-Regular.ttf"), "AntonCover");
GlobalFonts.registerFromPath(path.join(FONTS, "Inter-SemiBold.ttf"), "InterCover");

/**
 * Draw `image` to fill a square of `size`, cropping the overflowing axis
 * equally on both sides. Generated art is usually already square, but a hand
 * crop or a 4:5 export shouldn't silently stretch.
 */
function drawSquareCropped(ctx, image, size) {
  const scale = Math.max(size / image.width, size / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (size - w) / 2, (size - h) / 2, w, h);
}

/**
 * Break `words` into exactly `count` lines such that the WIDEST line is as
 * narrow as possible.
 *
 * Minimizing the widest rendered line is the same thing as maximizing the font
 * size that will fit, which is the actual goal. Titles are a handful of words,
 * so every possible set of break points is checked rather than approximated —
 * a greedy packer produces lopsided breaks like "HALLOWEEN / PARTY, ACTUALLY
 * SCARY" that waste most of the width.
 */
function balanceLines(words, count, measure) {
  const n = words.length;
  if (count > n) return null;
  if (count === 1) return [words.join(" ")];

  let best = null;

  const search = (start, need, breaks) => {
    if (need === 0) {
      const bounds = [0, ...breaks, n];
      const lines = [];
      for (let i = 0; i < bounds.length - 1; i += 1) {
        lines.push(words.slice(bounds[i], bounds[i + 1]).join(" "));
      }
      const widest = Math.max(...lines.map(measure));
      if (!best || widest < best.widest) best = { lines, widest };
      return;
    }
    // Leave at least one word for each line still to be filled.
    for (let i = start; i <= n - need; i += 1) search(i + 1, need - 1, [...breaks, i]);
  };

  search(1, count - 1, []);
  return best?.lines ?? null;
}

/**
 * Real line height for a block of text at a given size.
 *
 * Measured from glyph bounding boxes rather than derived from a ratio: Anton's
 * cap height is unusually large relative to its em box, so a guessed leading
 * (the site's 0.70 for instance) makes lines physically collide. The 1.08
 * multiplier is the gap between lines.
 */
function measuredLineHeight(ctx, lines, fontSize) {
  ctx.font = `${fontSize}px AntonCover`;
  const tallest = Math.max(
    ...lines.map((l) => {
      const m = ctx.measureText(l);
      return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    }),
  );
  return Math.ceil(tallest * 1.08);
}

/**
 * Choose how to break the title and how big to set it.
 *
 * The site's authored line breaks are tuned for a narrow column at 130px; a
 * square cover is wide and short, so it wants its own breaks. We try every
 * plausible line count and keep whichever yields the largest type that still
 * fits both the width and the height budget.
 */
function fitTitle(ctx, title, maxWidth, maxHeight) {
  const words = title.split(/\s+/);
  const PROBE = 400;
  let best = null;

  for (let count = 1; count <= Math.min(4, words.length); count += 1) {
    ctx.font = `${PROBE}px AntonCover`;
    const lines = balanceLines(words, count, (l) => ctx.measureText(l).width);
    if (!lines || lines.length !== count) continue;

    ctx.font = `${PROBE}px AntonCover`;
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    let fontSize = Math.floor((PROBE * maxWidth) / widest);

    // Shrink until the measured block actually fits the height budget.
    let lineHeight = measuredLineHeight(ctx, lines, fontSize);
    if (lineHeight * count > maxHeight) {
      fontSize = Math.floor((fontSize * maxHeight) / (lineHeight * count));
      lineHeight = measuredLineHeight(ctx, lines, fontSize);
    }

    if (!best || fontSize > best.fontSize) best = { lines, fontSize, lineHeight };
  }

  return best;
}

/** Suggest an `accent` value by finding the artwork's dominant saturated color. */
function dominantColor(image) {
  const S = 48;
  const probe = createCanvas(S, S);
  const pctx = probe.getContext("2d");
  pctx.drawImage(image, 0, 0, S, S);
  const { data } = pctx.getImageData(0, 0, S, S);

  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Ignore the near-white paper ground and near-neutral pixels; we want the
    // motif's color, which is what should sit behind the image while it loads.
    if (max > 240 && min > 225) continue;
    if (max - min < 30) continue;

    const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const hit = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    hit.n += 1;
    hit.r += r;
    hit.g += g;
    hit.b += b;
    buckets.set(key, hit);
  }

  if (buckets.size === 0) return null;
  const top = [...buckets.values()].sort((a, b) => b.n - a.n)[0];
  const hex = (v) =>
    Math.round(v / top.n)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(top.r)}${hex(top.g)}${hex(top.b)}`;
}

async function renderTitled(image, playlist) {
  const size = outputSize(SPOTIFY_SIZE, image);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Paper ground first, so any transparency in the source lands on cream
  // rather than black.
  ctx.fillStyle = WARM_CHALK;
  ctx.fillRect(0, 0, size, size);
  drawSquareCropped(ctx, image, size);

  const margin = Math.round(size * 0.055);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // Re-break the title for a square frame rather than reusing the site's
  // column breaks, and cap the block at 30% of the cover so the artwork stays
  // the dominant element.
  const { lines, fontSize, lineHeight } = fitTitle(
    ctx,
    playlist.title.toUpperCase(),
    size - margin * 2,
    size * 0.3,
  );

  const labelSize = Math.round(size * 0.019);
  const blockHeight = lines.length * lineHeight;
  const bandHeight = blockHeight + margin * 2 + labelSize * 2;
  const bandTop = size - bandHeight;

  ctx.fillStyle = playlist.coverBand === "magenta" ? LIPSTICK_MAGENTA : FOREST_INK;
  ctx.fillRect(0, bandTop, size, bandHeight);

  // Micro-label, so the cover is identifiable as part of the set on a platform
  // that shows no other branding.
  ctx.fillStyle = WARM_CHALK;
  ctx.globalAlpha = 0.75;
  ctx.font = `${labelSize}px InterCover`;
  const label = "JODY'S PLAYLISTS";
  ctx.letterSpacing = `${Math.round(labelSize * 0.16)}px`;
  ctx.fillText(label, margin, bandTop + margin * 0.75 + labelSize);
  ctx.letterSpacing = "0px";
  ctx.globalAlpha = 1;

  ctx.font = `${fontSize}px AntonCover`;
  let cursor = bandTop + margin * 0.75 + labelSize * 2.1;
  for (const line of lines) {
    const ascent = ctx.measureText(line).actualBoundingBoxAscent;
    ctx.fillText(line, margin, cursor + ascent);
    cursor += lineHeight;
  }

  return { buffer: await canvas.encode("jpeg", 92), fontSize, lines, size };
}

async function renderPlain(image) {
  const size = outputSize(SITE_SIZE, image);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = WARM_CHALK;
  ctx.fillRect(0, 0, size, size);
  drawSquareCropped(ctx, image, size);
  return { buffer: await canvas.encode("jpeg", 90), size };
}

async function main() {
  await mkdir(SPOTIFY_OUT, { recursive: true });
  await mkdir(SITE_OUT, { recursive: true });

  let entries = [];
  try {
    entries = await readdir(INBOX);
  } catch {
    console.error(`No inbox at ${INBOX}`);
    process.exit(1);
  }

  const art = entries.filter((f) => ACCEPTED.has(path.extname(f).toLowerCase()));
  if (art.length === 0) {
    console.log(`Nothing to do — drop art in art/inbox/ named <slug>.png or .jpg`);
    console.log(`Slugs awaiting art: ${livePlaylists().map((p) => p.slug).join(", ")}`);
    return;
  }

  const bySlug = new Map(livePlaylists().map((p) => [p.slug, p]));
  let made = 0;

  for (const file of art) {
    const slug = path.basename(file, path.extname(file));
    const playlist = bySlug.get(slug);

    if (!playlist) {
      console.warn(
        `SKIP ${file} — "${slug}" is not a playlist slug. Expected one of: ${[...bySlug.keys()].join(", ")}`,
      );
      continue;
    }

    const image = await loadImage(path.join(INBOX, file));
    if (Math.min(image.width, image.height) < SPOTIFY_SIZE) {
      console.log(
        `  note     source is ${image.width}x${image.height}; output capped there rather than upscaled to ${SPOTIFY_SIZE}`,
      );
    }

    const titled = await renderTitled(image, playlist);
    await writeFile(path.join(SPOTIFY_OUT, `${slug}-cover.jpg`), titled.buffer);
    const plain = await renderPlain(image);
    await writeFile(path.join(SITE_OUT, `${slug}.jpg`), plain.buffer);

    const suggested = dominantColor(image);
    made += 1;

    console.log(`\n${playlist.title}`);
    console.log(`  site     public/covers/${slug}.jpg          ${plain.size}px, no text`);
    console.log(`  spotify  art/spotify/${slug}-cover.jpg   ${titled.size}px, title at ${titled.fontSize}px`);
    console.log(`  title    ${titled.lines.join(" / ")}`);
    console.log(`  band     ${playlist.coverBand ?? "forest"}`);
    if (suggested) {
      console.log(`  suggest  accent: "${suggested}"  <- paste into lib/playlists.ts`);
    }
    if (playlist.cover !== `/covers/${slug}.jpg`) {
      console.log(`  ACTION   set cover: "/covers/${slug}.jpg" in lib/playlists.ts (currently "${playlist.cover}")`);
    }
  }

  console.log(`\nDone — ${made} cover${made === 1 ? "" : "s"} generated.`);
}

await main();

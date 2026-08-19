/**
 * Cover art pipeline.
 *
 *   Drop raw art in  art/inbox/<slug>.(png|jpg|jpeg|webp)
 *   Run              npm run covers
 *
 * For each file whose name matches a playlist slug it writes the SAME titled
 * composition at two sizes:
 *
 *   public/covers/<slug>.jpg       used by the site
 *   art/spotify/<slug>-cover.jpg   full size, for uploading to Spotify/Apple
 *
 * The artwork is drawn leaving the lower part of the frame clear, so the title
 * sets directly onto empty paper rather than onto a colour band. That clear
 * height differs from cover to cover, so it is MEASURED per image (see
 * `clearZoneTop`) and the type is fitted to whatever room actually exists —
 * a fixed band height would either crop into the art or waste space.
 *
 * Titles come from lib/playlists.ts, so the covers cannot drift from the site.
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
const INK = {
  magenta: "#db3c8a",
  forest: "#00522d",
};

const SPOTIFY_SIZE = 3000;
const SITE_SIZE = 1600;

const ACCEPTED = new Set([".png", ".jpg", ".jpeg", ".webp"]);

GlobalFonts.registerFromPath(path.join(FONTS, "Anton-Regular.ttf"), "AntonCover");

/** Output size for a target, never exceeding what the source actually has. */
function outputSize(target, image) {
  return Math.min(target, Math.min(image.width, image.height));
}

/**
 * Draw `image` to fill a square of `size`, cropping the overflowing axis equally
 * on both sides.
 */
function drawSquareCropped(ctx, image, size) {
  const scale = Math.max(size / image.width, size / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (size - w) / 2, (size - h) / 2, w, h);
}

/** Downscaled pixel data, used for paper sampling and zone measurement. */
function sample(image, width) {
  const h = Math.round((image.height / image.width) * width);
  const c = createCanvas(width, h);
  const ctx = c.getContext("2d");
  ctx.drawImage(image, 0, 0, width, h);
  return { data: ctx.getImageData(0, 0, width, h).data, width, height: h };
}

/**
 * The paper colour, averaged from the bottom-left corner.
 *
 * Not assumed to be the site's warm chalk: this art carries its own paper tone
 * and visible grain, so the measurement below compares against the real ground.
 */
function paperColor({ data, width, height }) {
  let r = 0, g = 0, b = 0, n = 0;
  const boxW = Math.max(2, Math.round(width * 0.06));
  const boxH = Math.max(2, Math.round(height * 0.06));
  for (let y = height - boxH; y < height; y += 1) {
    for (let x = 0; x < boxW; x += 1) {
      const i = (y * width + x) * 4;
      r += data[i]; g += data[i + 1]; b += data[i + 2]; n += 1;
    }
  }
  return [r / n, g / n, b / n];
}

/**
 * Where the clear bottom band begins, in output pixels.
 *
 * Scans upward from the bottom and stops at the first row carrying enough
 * non-paper pixels to count as artwork. Paper grain means a few stray pixels
 * always differ, hence the tolerance and the per-row percentage.
 */
function clearZoneTop(image, size) {
  const s = sample(image, 256);
  const paper = paperColor(s);
  // Thresholds measured against the real art rather than guessed: across all
  // five covers, clear paper rows sit at 0.0-0.2% of pixels beyond a summed
  // distance of 120, while the first artwork rows jump to 18-70%. A lower
  // tolerance reads paper grain as artwork and collapses the zone to nothing.
  const TOLERANCE = 40;   // summed distance/3 still counting as paper
  const ROW_LIMIT = 0.03; // fraction of a row that may be art before we stop

  let clearRows = 0;
  for (let y = s.height - 1; y >= 0; y -= 1) {
    let arty = 0;
    for (let x = 0; x < s.width; x += 1) {
      const i = (y * s.width + x) * 4;
      const d =
        Math.abs(s.data[i] - paper[0]) +
        Math.abs(s.data[i + 1] - paper[1]) +
        Math.abs(s.data[i + 2] - paper[2]);
      if (d > TOLERANCE * 3) arty += 1;
    }
    if (arty / s.width > ROW_LIMIT) break;
    clearRows += 1;
  }

  const clearFraction = clearRows / s.height;
  return { top: Math.round(size * (1 - clearFraction)), clearFraction };
}

/**
 * Break `words` into exactly `count` lines so the WIDEST line is as narrow as
 * possible — the same thing as maximising the font size that fits. Every set of
 * break points is checked; titles are only a few words.
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
    for (let i = start; i <= n - need; i += 1) search(i + 1, need - 1, [...breaks, i]);
  };
  search(1, count - 1, []);
  return best?.lines ?? null;
}

/**
 * Line height measured from real glyph bounding boxes rather than a ratio.
 * Anton's cap height is unusually large relative to its em box, so a guessed
 * leading makes lines physically collide.
 */
function measuredLineHeight(ctx, lines, fontSize) {
  ctx.font = `${fontSize}px AntonCover`;
  const tallest = Math.max(
    ...lines.map((l) => {
      const m = ctx.measureText(l);
      return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    }),
  );
  return Math.ceil(tallest * 1.06);
}

/**
 * Pick the line break and size that fill the available box most fully. The site
 * ships authored breaks tuned for a narrow column; a square cover is wide and
 * short, so it gets its own.
 */
function fitTitle(ctx, title, maxWidth, maxHeight) {
  const words = title.split(/\s+/);
  const PROBE = 400;
  let best = null;

  for (let count = 1; count <= Math.min(3, words.length); count += 1) {
    ctx.font = `${PROBE}px AntonCover`;
    const lines = balanceLines(words, count, (l) => ctx.measureText(l).width);
    if (!lines || lines.length !== count) continue;

    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    let fontSize = Math.floor((PROBE * maxWidth) / widest);

    let lineHeight = measuredLineHeight(ctx, lines, fontSize);
    if (lineHeight * count > maxHeight) {
      fontSize = Math.floor((fontSize * maxHeight) / (lineHeight * count));
      lineHeight = measuredLineHeight(ctx, lines, fontSize);
    }

    if (!best || fontSize > best.fontSize) best = { lines, fontSize, lineHeight };
  }
  return best;
}

/** Dominant saturated colour, suggested as the playlist's `accent`. */
function dominantColor(image) {
  const s = sample(image, 48);
  const buckets = new Map();
  for (let i = 0; i < s.data.length; i += 4) {
    const [r, g, b] = [s.data[i], s.data[i + 1], s.data[i + 2]];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Skip the paper ground and near-neutral pixels; we want the motif.
    // Saturation is the reliable test: this art's paper measures around
    // rgb(250,237,220), only ~30 apart, while every motif colour is 80+ apart.
    if (max - min < 45) continue;

    const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const hit = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    hit.n += 1; hit.r += r; hit.g += g; hit.b += b;
    buckets.set(key, hit);
  }
  if (buckets.size === 0) return null;
  const top = [...buckets.values()].sort((a, b) => b.n - a.n)[0];
  const hex = (v) => Math.round(v / top.n).toString(16).padStart(2, "0");
  return `#${hex(top.r)}${hex(top.g)}${hex(top.b)}`;
}

/** Composite one cover: artwork full-bleed, title set into the clear lower band. */
async function render(image, playlist, size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  drawSquareCropped(ctx, image, size);

  const { top, clearFraction } = clearZoneTop(image, size);
  const margin = Math.round(size * 0.055);

  // Floor of 18% of the frame, so the type never gets squeezed to nothing if a
  // piece of art runs long — at the cost of slightly overlapping the artwork.
  const available = Math.max(size * 0.18, size - top - margin * 2);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const fit = fitTitle(ctx, playlist.title.toUpperCase(), size - margin * 2, available);
  ctx.fillStyle = INK[playlist.coverInk ?? "forest"];
  ctx.font = `${fit.fontSize}px AntonCover`;

  // Bottom-anchored: the last line sits on the bottom margin.
  const blockHeight = fit.lines.length * fit.lineHeight;
  let cursor = size - margin - blockHeight;
  for (const line of fit.lines) {
    const ascent = ctx.measureText(line).actualBoundingBoxAscent;
    ctx.fillText(line, margin, cursor + ascent);
    cursor += fit.lineHeight;
  }

  return {
    buffer: await canvas.encode("jpeg", 92),
    size,
    fontSize: fit.fontSize,
    lines: fit.lines,
    clearPct: Math.round(clearFraction * 100),
  };
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
  const bySlug = new Map(livePlaylists().map((p) => [p.slug, p]));

  if (art.length === 0) {
    console.log("Nothing to do — drop art in art/inbox/ named <slug>.png or .jpg");
    console.log(`Slugs: ${[...bySlug.keys()].join(", ")}`);
    return;
  }

  let made = 0;
  for (const file of art) {
    const slug = path.basename(file, path.extname(file));
    const playlist = bySlug.get(slug);

    if (!playlist) {
      console.warn(
        `SKIP ${file} — "${slug}" is not a playlist slug. Expected: ${[...bySlug.keys()].join(", ")}`,
      );
      continue;
    }

    const image = await loadImage(path.join(INBOX, file));
    const spotify = await render(image, playlist, outputSize(SPOTIFY_SIZE, image));
    const site = await render(image, playlist, outputSize(SITE_SIZE, image));

    await writeFile(path.join(SPOTIFY_OUT, `${slug}-cover.jpg`), spotify.buffer);
    await writeFile(path.join(SITE_OUT, `${slug}.jpg`), site.buffer);

    const suggested = dominantColor(image);
    made += 1;

    console.log(`\n${playlist.title}`);
    console.log(`  clear zone  bottom ${spotify.clearPct}% of frame (measured)`);
    console.log(
      `  title       ${spotify.lines.join(" / ")}  @ ${spotify.fontSize}px, ${playlist.coverInk ?? "forest"} ink`,
    );
    console.log(`  site        public/covers/${slug}.jpg  ${site.size}px`);
    console.log(`  spotify     art/spotify/${slug}-cover.jpg  ${spotify.size}px`);
    if (suggested && suggested !== playlist.accent) {
      console.log(`  accent      ${playlist.accent} -> suggest "${suggested}"`);
    }
    if (playlist.cover !== `/covers/${slug}.jpg`) {
      console.log(`  ACTION      set cover: "/covers/${slug}.jpg" (currently "${playlist.cover}")`);
    }
  }

  console.log(`\nDone — ${made} cover${made === 1 ? "" : "s"}.`);
}

await main();

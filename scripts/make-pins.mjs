/**
 * Pinterest pin pipeline.
 *
 *   Drop pin images in  art/pins/inbox/<name>.(png|jpg|jpeg|webp)
 *   Add copy in         lib/pins.ts
 *   Run                 npm run pins
 *   Finished pins in    art/pins/out/
 *
 * Type is set in Anton, uppercase, matching the playlist covers. Unlike the
 * covers — where the title sits on bare paper — pins get a solid banner behind
 * the text: pin artwork is busier, and a feed scrolls fast.
 *
 * Aspect ratio is preserved, never cropped. The quiet zone was composed
 * deliberately, so cropping would move the banner off it.
 */

import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { BOARD_BANNER, PIN_COPY, pins } from "../lib/pins.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = path.join(ROOT, "art", "pins", "inbox");
const OUT = path.join(ROOT, "art", "pins", "out");
const VARIANTS = path.join(ROOT, "art", "pins", "variants");

/** Treatments rendered by `npm run pins -- --variants` for side-by-side review. */
const TREATMENTS = ["band", "tag", "rule", "bare"];
const FONTS = path.join(ROOT, "art", "fonts");

// Palette — must match app/globals.css.
const C = {
  magenta: "#db3c8a",
  forest: "#00522d",
  chalk: "#fff8f6",
  charcoal: "#2e2f33",
  chartreuse: "#d9f24b",
  bubblegum: "#f29ebd",
};

const BANNERS = {
  charcoal: { bg: C.charcoal, headline: C.chartreuse, subline: C.chalk, brand: C.bubblegum },
  magenta: { bg: C.magenta, headline: C.chalk, subline: C.chalk, brand: C.chalk },
  cream: { bg: C.chalk, headline: C.magenta, subline: C.forest, brand: C.forest },
};

/** Long edge cap. Pinterest serves around 1000x1500, so this is ample. */
const MAX_EDGE = 2000;

const ACCEPTED = new Set([".png", ".jpg", ".jpeg", ".webp"]);

GlobalFonts.registerFromPath(path.join(FONTS, "Anton-Regular.ttf"), "AntonPin");
GlobalFonts.registerFromPath(path.join(FONTS, "Inter-SemiBold.ttf"), "InterPin");

/**
 * Break `words` into exactly `count` lines so the widest line is as narrow as
 * possible, which maximises the type size that fits.
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
 * Line height from real glyph bounds rather than a ratio — Anton's cap height is
 * unusually large for its em box, so a guessed leading makes lines collide.
 */
function lineHeightFor(ctx, font, lines, fontSize) {
  ctx.font = `${fontSize}px ${font}`;
  const tallest = Math.max(
    ...lines.map((l) => {
      const m = ctx.measureText(l);
      return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    }),
  );
  return Math.ceil(tallest * 1.08);
}

/** Largest size and best break for `text` inside a box, up to `maxLines`. */
function fitText(ctx, text, font, maxWidth, maxHeight, maxLines) {
  const words = text.split(/\s+/);
  const PROBE = 400;
  let best = null;

  for (let count = 1; count <= Math.min(maxLines, words.length); count += 1) {
    ctx.font = `${PROBE}px ${font}`;
    const lines = balanceLines(words, count, (l) => ctx.measureText(l).width);
    if (!lines || lines.length !== count) continue;

    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    let fontSize = Math.floor((PROBE * maxWidth) / widest);
    let lh = lineHeightFor(ctx, font, lines, fontSize);
    if (lh * count > maxHeight) {
      fontSize = Math.floor((fontSize * maxHeight) / (lh * count));
      lh = lineHeightFor(ctx, font, lines, fontSize);
    }
    if (!best || fontSize > best.fontSize) best = { lines, fontSize, lineHeight: lh };
  }
  return best;
}

/** Draw pre-fitted lines, top-aligned at `y`, left-aligned at `x`. */
function drawLines(ctx, fit, font, color, x, y) {
  ctx.fillStyle = color;
  ctx.font = `${fit.fontSize}px ${font}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  let cursor = y;
  for (const line of fit.lines) {
    const ascent = ctx.measureText(line).actualBoundingBoxAscent;
    ctx.fillText(line, x, cursor + ascent);
    cursor += fit.lineHeight;
  }
  return cursor;
}

/** Banner rectangles for each zone, as fractions of height. */
function zoneBands(zone) {
  if (zone === "top") return [{ from: 0, to: 0.3, role: "headline" }];
  if (zone === "middle") return [{ from: 0.35, to: 0.65, role: "headline" }];
  // split
  return [
    { from: 0, to: 0.2, role: "headline" },
    { from: 0.8, to: 1, role: "subline" },
  ];
}

/**
 * Mean relative luminance of a region of the already-drawn canvas, 0..1.
 *
 * Used by the blockless treatments to pick type colour from what is actually
 * behind the text, instead of laying a scrim over the photograph to force one.
 */
function zoneLuminance(ctx, x, y, w, h) {
  const { data } = ctx.getImageData(
    Math.max(0, Math.round(x)),
    Math.max(0, Math.round(y)),
    Math.max(1, Math.round(w)),
    Math.max(1, Math.round(h)),
  );
  let sum = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    sum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
  }
  return sum / n;
}

/** Type colours for blockless treatments, chosen against the measured backdrop. */
function adaptiveTheme(luminance) {
  return luminance > 0.55
    ? { headline: C.charcoal, subline: C.forest, brand: C.magenta, rule: C.magenta }
    : { headline: C.chalk, subline: C.chalk, brand: C.chartreuse, rule: C.chartreuse };
}

/**
 * Composite one pin.
 *
 * `treatment` controls how hard the type sits on the photograph:
 *
 *   "band" — solid block across the full width. Loudest and most ad-like, which
 *            suits high-intent boards where looking like an offer is the point.
 *   "tag"  — solid block only as wide as the text needs. Reads as a label stuck
 *            on the image rather than a bar imposed across it.
 *   "bare" — no block at all. Type sits directly on the photograph, coloured from
 *            the measured luminance of what is behind it.
 *   "rule" — "bare" plus a short brand-colour rule above the headline, which buys
 *            some structure back without covering anything.
 */
async function renderPin(image, pin, treatment = "band") {
  // Preserve aspect; never upscale.
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const W = Math.round(image.width * scale);
  const H = Math.round(image.height * scale);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, W, H);

  const banner = BANNERS[pin.banner ?? BOARD_BANNER[pin.copy.board]];
  const margin = Math.round(W * 0.07);
  const inner = W - margin * 2;
  const bands = zoneBands(pin.zone);
  const brandSize = Math.max(12, Math.round(W * 0.022));
  const hasBlock = treatment === "band" || treatment === "tag";

  for (const band of bands) {
    const top = Math.round(H * band.from);
    const height = Math.round(H * (band.to - band.from));
    const padY = Math.round(height * 0.14);
    const boxTop = top + padY;
    const boxHeight = height - padY * 2;

    // Blockless treatments read their colours off the photograph itself.
    const theme = hasBlock
      ? banner
      : adaptiveTheme(zoneLuminance(ctx, 0, top, W, height));

    const ruleBlock = treatment === "rule" ? Math.round(brandSize * 1.4) : 0;

    if (band.role === "headline") {
      const sharesBanner = pin.zone !== "split" && Boolean(pin.copy.subline);
      const brandBlock = brandSize * 2.2;
      const sublineBlock = sharesBanner ? boxHeight * 0.26 : 0;
      const headlineBox = boxHeight - brandBlock - sublineBlock - ruleBlock;

      const head = fitText(ctx, pin.copy.headline.toUpperCase(), "AntonPin", inner, headlineBox, 3);
      const sub = sharesBanner
        ? fitText(ctx, pin.copy.subline, "InterPin", inner, sublineBlock, 2)
        : null;

      // Text is measured before any block is drawn, so a "tag" block can be
      // sized to the text rather than the frame.
      if (treatment === "band") {
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, top, W, height);
      } else if (treatment === "tag") {
        const widest = Math.max(
          ...head.lines.map((l) => {
            ctx.font = `${head.fontSize}px AntonPin`;
            return ctx.measureText(l).width;
          }),
          ...(sub
            ? sub.lines.map((l) => {
                ctx.font = `${sub.fontSize}px InterPin`;
                return ctx.measureText(l).width;
              })
            : [0]),
        );
        const pad = Math.round(W * 0.035);
        const blockW = Math.min(W, widest + margin + pad);
        const blockTop = boxTop - pad;
        const blockH =
          brandBlock + ruleBlock + head.lines.length * head.lineHeight +
          (sub ? brandSize * 0.6 + sub.lines.length * sub.lineHeight : 0) + pad * 2;
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, blockTop, blockW, blockH);
      }

      ctx.fillStyle = theme.brand;
      ctx.font = `${brandSize}px InterPin`;
      ctx.letterSpacing = `${Math.round(brandSize * 0.16)}px`;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("JODY'S PLAYLISTS", margin, boxTop + brandSize);
      ctx.letterSpacing = "0px";

      let y = boxTop + brandBlock;

      if (treatment === "rule") {
        ctx.fillStyle = theme.rule;
        ctx.fillRect(margin, y, Math.round(W * 0.16), Math.max(3, Math.round(W * 0.008)));
        y += ruleBlock;
      }

      y = drawLines(ctx, head, "AntonPin", theme.headline, margin, y);
      if (sub) drawLines(ctx, sub, "InterPin", theme.subline, margin, y + brandSize * 0.6);
    } else {
      // Bottom band of a split: subline only, set larger since it stands alone.
      const sub = fitText(ctx, pin.copy.subline ?? "", "InterPin", inner, boxHeight, 3);
      if (sub) {
        const blockH = sub.lines.length * sub.lineHeight;
        const textTop = boxTop + Math.max(0, (boxHeight - blockH) / 2);

        if (treatment === "band") {
          ctx.fillStyle = theme.bg;
          ctx.fillRect(0, top, W, height);
        } else if (treatment === "tag") {
          const widest = Math.max(
            ...sub.lines.map((l) => {
              ctx.font = `${sub.fontSize}px InterPin`;
              return ctx.measureText(l).width;
            }),
          );
          const pad = Math.round(W * 0.035);
          ctx.fillStyle = theme.bg;
          ctx.fillRect(0, textTop - pad, Math.min(W, widest + margin + pad), blockH + pad * 2);
        }

        drawLines(ctx, sub, "InterPin", theme.subline, margin, textTop);
      }
    }
  }

  return { buffer: await canvas.encode("jpeg", 92), W, H };
}

/**
 * Render every treatment for a handful of representative pins, so the choice can
 * be made by looking rather than by argument. One dark photograph, one bright
 * one, and one mid-tone, since the blockless treatments behave differently on
 * each.
 */
async function renderVariants() {
  const SAMPLES = ["pin-01", "pin-12", "pin-03"];
  const byFile = new Map(pins.map((p) => [p.file, p]));

  for (const treatment of TREATMENTS) {
    await mkdir(path.join(VARIANTS, treatment), { recursive: true });
  }

  for (const file of SAMPLES) {
    const pin = byFile.get(file);
    if (!pin) {
      console.warn(`SKIP ${file} — not assigned in lib/pins.ts`);
      continue;
    }
    const copy = PIN_COPY[pin.copyId];
    const image = await loadImage(path.join(INBOX, `${file}.png`));

    for (const treatment of TREATMENTS) {
      const out = await renderPin(image, { ...pin, copy }, treatment);
      await writeFile(
        path.join(VARIANTS, treatment, `${file}--${pin.copyId}.jpg`),
        out.buffer,
      );
    }
    console.log(`${file}  ${copy.headline}  ->  ${TREATMENTS.join(", ")}`);
  }

  console.log(`\nVariants in art/pins/variants/<treatment>/`);
}

async function main() {
  if (process.argv.includes("--variants")) {
    await renderVariants();
    return;
  }

  await mkdir(INBOX, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const entries = await readdir(INBOX);
  const art = entries.filter((f) => ACCEPTED.has(path.extname(f).toLowerCase()));

  if (art.length === 0) {
    console.log(`No images yet. Drop pin artwork in art/pins/inbox/, add copy in lib/pins.ts, then rerun.`);
    return;
  }

  const byFile = new Map(pins.map((p) => [p.file, p]));
  const usedCopy = new Set(pins.map((p) => p.copyId));
  const freeCopy = Object.keys(PIN_COPY).filter((id) => !usedCopy.has(id));
  let made = 0;
  const missing = [];
  const written = new Set();

  for (const file of art) {
    const name = path.basename(file, path.extname(file));
    const pin = byFile.get(name);

    if (!pin) {
      missing.push(name);
      continue;
    }

    const copy = PIN_COPY[pin.copyId];
    if (!copy) {
      console.warn(`SKIP ${file} — copyId "${pin.copyId}" is not in PIN_COPY`);
      continue;
    }

    const image = await loadImage(path.join(INBOX, file));
    const out = await renderPin(image, { ...pin, copy }, pin.treatment ?? "band");

    // Grouped by board and named after the copy, so a board's folder can be
    // bulk-uploaded or scheduled as one batch and every file says what it is.
    const boardDir = path.join(OUT, copy.board);
    await mkdir(boardDir, { recursive: true });

    let outName = `${pin.slug}--${pin.copyId}.jpg`;
    if (written.has(outName)) outName = `${pin.slug}--${pin.copyId}--${name}.jpg`;
    written.add(outName);

    await writeFile(path.join(boardDir, outName), out.buffer);
    made += 1;

    console.log(`\n${copy.headline}`);
    console.log(`  board    ${copy.board}`);
    console.log(`  zone     ${pin.zone}  banner ${pin.banner ?? BOARD_BANNER[copy.board]}`);
    console.log(`  size     ${out.W}x${out.H}  (aspect preserved, not cropped)`);
    console.log(`  out      art/pins/out/${copy.board}/${outName}`);
  }

  if (missing.length) {
    console.log(`\n${missing.length} image(s) not assigned yet.`);
    console.log(`\nCopy still unused:`);
    for (const id of freeCopy) {
      console.log(`   ${id.padEnd(30)} ${PIN_COPY[id].board.padEnd(17)} ${PIN_COPY[id].headline}`);
    }
    console.log(`\nAdd to \`pins\` in lib/pins.ts. Set zone to the image's quiet area:\n`);
    missing.forEach((name, i) => {
      const id = freeCopy[i] ?? "PICK_ONE";
      console.log(`  { file: "${name}", copyId: "${id}", slug: "actually-scary", zone: "top" },`);
    });
    console.log(`\n  zone: "top" (banner over top 30%) | "middle" (middle 30%) | "split" (top 20% + bottom 20%)`);
  }

  console.log(`\nDone — ${made} pin${made === 1 ? "" : "s"}.`);
}

await main();

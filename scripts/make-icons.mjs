/**
 * Generate every browser icon from the one bolt mark.
 *
 *   npm run icons
 *
 * app/icon.svg is the source of truth and browsers that honour it get it. But a
 * browser may request /favicon.ico before it has parsed any HTML, and some keep
 * preferring that file even when a <link rel="icon"> points elsewhere. With no
 * favicon.ico on the server that request 404s and the browser is free to keep
 * showing whatever it cached last -- which is how Next's default Vercel triangle
 * survived being deleted.
 *
 * So this writes the raster set as well, all from the same path data, so no
 * codepath can serve a different mark:
 *
 *   app/favicon.ico   16 + 32 + 48, PNG-encoded inside an ICO container
 *   app/icon.png      192, for Android and for anything ignoring the SVG
 *   app/apple-icon.png 180, iOS home screen (no transparency, per Apple)
 *
 * Next picks all of these up by filename convention -- no metadata wiring.
 */
import { createCanvas, Path2D } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "app");

// Kept identical to app/icon.svg and to the home link in components/CornerNav.
// Authored on a 24x24 grid; the bolt occupies x 4-19, y 2-22.
const BOLT = "M13.5 2 4 14h6l-1.5 8L19 9h-6.5z";
const MAGENTA = "#db3c8a";
const CHALK = "#fff8f6";

/**
 * The bolt fills far more of the frame than it does on the page, where it is a
 * 20px glyph inside a 50px circle. At 16px that proportion reads as a smudge.
 */
function render(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = MAGENTA;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Scale the 15x20 bolt to 78% of the frame's height, then centre it.
  const scale = (size * 0.78) / 20;
  ctx.translate((size - 15 * scale) / 2 - 4 * scale, (size - 20 * scale) / 2 - 2 * scale);
  ctx.scale(scale, scale);
  ctx.fillStyle = CHALK;
  ctx.fill(new Path2D(BOLT));

  return canvas.encode("png");
}

/**
 * Wrap PNGs in an ICO container. An ICO is a 6-byte header, one 16-byte
 * directory entry per image, then the payloads; each entry holds a size byte
 * (0 meaning 256), a byte count and an offset. Storing PNG rather than BMP is
 * legal and is what every modern browser expects.
 */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, buffer }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette colours: 0 = truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buffer.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buffer.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buffer)]);
}

const icoSizes = [16, 32, 48];
const pngs = [];
for (const size of icoSizes) pngs.push({ size, buffer: await render(size) });

writeFileSync(path.join(APP, "favicon.ico"), ico(pngs));
console.log(`app/favicon.ico     ${icoSizes.join(" + ")}`);

for (const [name, size] of [
  ["icon.png", 192],
  ["apple-icon.png", 180],
]) {
  writeFileSync(path.join(APP, name), await render(size));
  console.log(`app/${name.padEnd(15)} ${size}`);
}

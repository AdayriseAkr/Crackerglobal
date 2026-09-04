/**
 * Batch-converts every raster image in src/assets to WebP, downscaling anything
 * wider than MAX_WIDTH on the way through.
 *
 * The resize is the part that actually matters: most of these were exported at
 * ~2000px and are displayed at a few hundred, so re-encoding alone would just
 * produce an efficiently-stored image that is still several times larger than
 * anything the page can show. Format conversion is the second, smaller win.
 *
 * Originals are left in place. Nothing ships them once the imports point at the
 * .webp files (Vite only bundles what is imported), so they cost repo size and
 * nothing else, and they stay available as the re-encode source — WebP at q82
 * is lossy, so a second pass over an already-converted file would compound the
 * damage rather than save more.
 *
 * Usage: npm run optimize:images [-- --force]
 */
import sharp from "sharp";
import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = "src/assets";
const MAX_WIDTH = 1400;
const QUALITY = 82;
const force = process.argv.includes("--force");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const sources = walk(ROOT).filter((f) => /\.(png|jpe?g)$/i.test(f));
const kb = (n) => (n / 1024).toFixed(0).padStart(6) + " KB";

let totalBefore = 0;
let totalAfter = 0;
let converted = 0;
let skipped = 0;

for (const src of sources) {
  const out = src.slice(0, -extname(src).length) + ".webp";

  if (existsSync(out) && !force) {
    skipped++;
    continue;
  }

  const { width, height } = await sharp(src).metadata();
  // Encoded to a buffer first so the result can be rejected without leaving a
  // file behind. WebP is not universally better: a flat, alpha-carrying
  // illustration can encode smaller as PNG than as lossy WebP at any quality
  // (tokenomics.png here is 267 KB as PNG and 335 KB as WebP even at q60), and
  // silently shipping the larger file would make this script a pessimisation
  // for those. Anything that fails to beat its source is left as-is.
  const buf = await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  const before = statSync(src).size;
  const after = buf.length;

  if (after >= before) {
    console.log(
      `${kb(before)} -> ${kb(after)}  SKIP   ` +
        `${String(width) + "x" + String(height)}`.padEnd(28) +
        `${relative(ROOT, src)}  (WebP is larger; keeping the original)`
    );
    skipped++;
    continue;
  }

  writeFileSync(out, buf);
  totalBefore += before;
  totalAfter += after;
  converted++;

  const scaled = width > MAX_WIDTH ? `${width}x${height} -> ${MAX_WIDTH}w` : `${width}x${height}`;
  console.log(
    `${kb(before)} -> ${kb(after)}  ${String(Math.round((1 - after / before) * 100)).padStart(3)}%  ` +
      `${scaled.padEnd(20)} ${relative(ROOT, src)}`
  );
}

console.log(
  `\n${converted} converted, ${skipped} skipped (already had a .webp, or WebP came out no smaller).\n` +
    `${(totalBefore / 1048576).toFixed(1)} MB -> ${(totalAfter / 1048576).toFixed(1)} MB ` +
    `(${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
);

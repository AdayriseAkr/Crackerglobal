import sharp from "sharp";
import fs from "node:fs";

/**
 * Favicons and app icons, rendered from src/assets/favicon.svg.
 *
 * Vector source, so every size is drawn at its own resolution rather than
 * resampled from one raster. The previous source was a 195px PNG whose circle
 * was only 152px of that, which made the 512 a 3.4x enlarge - that is where
 * the softness came from.
 *
 * Output is PNG, not WebP: Safari does not accept a WebP favicon, and this is
 * the one place on the site where format support matters more than file size.
 */

const SRC = "src/assets/favicon.svg";
const CANVAS = "#f8f8fb"; // --color-canvas

const svg = fs.readFileSync(SRC, "utf8");

// The artwork's own coordinate system. Everything below is expressed in these
// units so the numbers can be read against the file.
const VIEW = 87;
// Measured off the paths, not guessed: the mark spans 36.88 x 49.38 and sits
// almost exactly on the middle of the canvas.
const MARK = { w: 36.88, h: 49.38, cx: 43.44, cy: 43.69 };

fs.mkdirSync("public", { recursive: true });

/**
 * Rasterises at 3x and comes back down. librsvg antialiases well on its own,
 * but supersampling costs nothing at these sizes and cleans up the places
 * where a curve meets the circle's edge.
 */
async function render(size, source = svg) {
  const over = Math.min(size * 3, 2048);
  return sharp(Buffer.from(source), { density: (72 * over) / VIEW })
    .resize(over, over)
    .resize(size, size, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 });
}

function report(name, size) {
  const { size: bytes } = fs.statSync(`public/${name}`);
  console.log(`public/${name}`.padEnd(32) + `${size}x${size}`.padEnd(10) + Math.round(bytes / 1024) + "KB");
}

async function icon(size, name, { background = null } = {}) {
  let img = await render(size);
  if (background) img = img.flatten({ background });
  await img.toFile(`public/${name}`);
  report(name, size);
}

await icon(32, "favicon-32.png");
await icon(192, "favicon-192.png");
await icon(512, "favicon-512.png");

// iOS ignores transparency on a touch icon and composites whatever is behind
// it, so this one gets an opaque tile in the page's own canvas colour.
await icon(180, "apple-touch-icon.png", { background: CANVAS });

/**
 * Android's adaptive icons crop what they are given to a shape the device
 * picks - circle, squircle, teardrop - and only the middle 61% is guaranteed
 * to survive. Handed a normal icon, a launcher shrinks it and floats it in the
 * centre of a white circle.
 *
 * So this version squares off the circle to bleed orange into every corner,
 * and pulls the mark in far enough that its diagonal fits the safe zone.
 * Whatever shape the launcher cuts, it cuts orange.
 */
{
  const diagonal = Math.hypot(MARK.w, MARK.h) / VIEW; // 0.709 of the tile
  const SAFE = 0.61;
  const scale = +(SAFE / diagonal).toFixed(3);

  const maskable = svg
    // rx="43.5" on an 87 box is a full circle; 0 makes it the square tile.
    .replace(/(<rect\b[^>]*?)\srx="[\d.]+"/, "$1")
    // Scale the mark about its own centre, then land that centre on the
    // canvas centre - the two are a quarter of a unit apart in the source.
    .replace(/(<path\b)/, `<g transform="translate(${VIEW / 2} ${VIEW / 2}) scale(${scale}) translate(${-MARK.cx} ${-MARK.cy})">$1`)
    .replace(/(<\/svg>)/, "</g>$1");

  await (await render(512, maskable)).toFile("public/favicon-maskable-512.png");
  report("favicon-maskable-512.png", 512);
}

// The vector itself, for the browsers that take an SVG favicon. Crisp at any
// zoom or pixel ratio, and it is 3KB.
fs.copyFileSync(SRC, "public/favicon.svg");
report("favicon.svg", VIEW);

/**
 * A real /favicon.ico as the fallback for Safari, and for the crawlers, feed
 * readers and link unfurlers that request that path blind - on an SPA it would
 * otherwise be answered with index.html, and an HTML body served as an image
 * is worse than a 404.
 *
 * ICO can carry a PNG payload directly, so this is a 22-byte header around the
 * 32px file rather than a BMP re-encode.
 */
const ico32 = fs.readFileSync("public/favicon-32.png");
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);   // reserved
header.writeUInt16LE(1, 2);   // type: icon
header.writeUInt16LE(1, 4);   // one image
header.writeUInt8(32, 6);     // width
header.writeUInt8(32, 7);     // height
header.writeUInt8(0, 8);      // not palette indexed
header.writeUInt8(0, 9);      // reserved
header.writeUInt16LE(1, 10);  // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(ico32.length, 14);
header.writeUInt32LE(22, 18); // payload offset
fs.writeFileSync("public/favicon.ico", Buffer.concat([header, ico32]));
report("favicon.ico", 32);

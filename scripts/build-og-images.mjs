import sharp from "sharp";
import fs from "node:fs";

/**
 * Turns the designed OG banners in src/assets into the share images the site
 * serves from public/.
 *
 * JPEG, not PNG. These are the images every crawler fetches when a link is
 * posted, and JPEG comes out around a tenth of the size here (79KB against
 * 829KB) with no visible difference on a banner. Not WebP: several scrapers
 * still refuse it, and a share image that some platforms cannot read is worse
 * than a slightly larger file.
 *
 * The source files carry alpha, so they are flattened onto the page canvas
 * colour first. JPEG has no transparency, and without an explicit background
 * sharp fills it black.
 *
 * Names are lowercase with no spaces or brackets: a URL with %20 in it is a
 * reliable way to break a scraper that does not encode properly.
 */

const CANVAS = "#f8f8fb"; // --color-canvas

const BANNERS = [
  {
    src: "src/assets/Primary OG Banner (Cracker) - 1200x630.png",
    out: "public/og-banner.jpg",
    note: "1200x630, the 1.91:1 Open Graph standard",
  },
  {
    src: "src/assets/X large card (Cracker) - 1200x675.png",
    out: "public/og-banner-x.jpg",
    note: "1200x675, 16:9 for X's summary_large_image",
  },
  {
    src: "src/assets/Square Preview (Cracker) - 1200x1200.png",
    out: "public/og-banner-square.jpg",
    note: "1200x1200, square for WhatsApp and messenger previews",
  },
];

fs.mkdirSync("public", { recursive: true });

for (const banner of BANNERS) {
  await sharp(banner.src)
    .flatten({ background: CANVAS })
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(banner.out);

  const before = fs.statSync(banner.src).size;
  const after = fs.statSync(banner.out).size;
  console.log(
    banner.out.padEnd(30) +
      Math.round(before / 1024) + "KB -> " + Math.round(after / 1024) + "KB  " +
      banner.note
  );
}

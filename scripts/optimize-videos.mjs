import { execFileSync, spawnSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import fs from "node:fs";
import path from "node:path";

/**
 * Re-encodes the two background videos.
 *
 * Both were exported at roughly 8.8 Mbps, which is a delivery bitrate for a
 * film. These are short silent clips that loop behind other content, and they
 * were 16MB of a 23MB bundle - the single largest thing a visitor waits for.
 *
 * Quality is the constraint here, not size. Every setting below was chosen
 * against SSIM measured on the real footage, and the numbers are in the table
 * at the bottom.
 *
 *   (no scale)   Native 1920 is kept. An earlier pass downscaled to 1280 and
 *                that, not the compression, was what made these look soft: a
 *                1280 source stretched across a 1920 hero is blurred by the
 *                browser before the codec is even involved. Resolution is the
 *                one thing you cannot trade here.
 *   -crf 20      Quality target rather than a fixed bitrate, so calm frames
 *                cost nothing and busy ones get what they need. SSIM barely
 *                moves between crf 16 and 22 on this footage; 20 sits well
 *                inside the range where nothing is visible.
 *   -tune animation
 *                The single biggest win: 28% smaller for an SSIM difference of
 *                0.0001. These are 3D renders - large flat areas, smooth
 *                gradients, clean edges - which is exactly the content this
 *                tuning is built for.
 *   -preset veryslow
 *                Strictly better than slow here: smaller AND slightly higher
 *                SSIM. It is a build step, it can afford the minutes.
 *   -an          Drops audio. Both <video> tags are muted, so the hero clip
 *                had been shipping an audio track nobody could hear.
 *   +faststart   Moves the index to the front of the file so playback can
 *                begin before the whole thing arrives. Without it a browser
 *                waits for the last byte, which on a background video reads as
 *                the section being broken.
 *   -g 60        A keyframe every two seconds, so a loop restarts cleanly.
 *
 * H.264 only. A VP9 WebM was tried alongside and came out no smaller on this
 * footage, so a second format and a <source> list would have bought nothing.
 *
 * Originals stay in place; nothing here writes over its own input.
 *
 *   community   10.51MB -> 2.49MB   SSIM 0.9939
 *   hero         5.25MB -> ~1.0MB   SSIM 0.9975
 */

const VIDEOS = ["src/assets/community.mp4", "src/assets/rig_robot_LIG2_1.0004.mp4"];

const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(2) + "MB";

for (const src of VIDEOS) {
  const out = path.join(path.dirname(src), path.basename(src, path.extname(src)) + ".min.mp4");

  execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-i", src,
    "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryslow", "-tune", "animation",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-g", "60", "-movflags", "+faststart", out]);

  // Measured, not assumed. 1.0 is identical; above 0.99 is the range where a
  // difference is not visible.
  const r = spawnSync(ffmpeg, ["-hide_banner", "-i", out, "-i", src, "-lavfi", "ssim", "-f", "null", "-"],
    { encoding: "utf8" });
  const ssim = (((r.stderr || "") + (r.stdout || "")).match(/All:([\d.]+)/) || [])[1] ?? "?";

  console.log(path.basename(src).padEnd(32) + mb(src).padEnd(10) + "->  " + mb(out).padEnd(10) + "SSIM " + ssim);
}

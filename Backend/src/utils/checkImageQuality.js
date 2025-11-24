import sharp from "sharp";

export async function checkImageQuality(buffer) {
  // ---- RESOLUTION CHECK ----
  const metadata = await sharp(buffer).metadata();
  const { width, height } = metadata;

  if (width < 200 || height < 200) {
    return { ok: false, reason: "low_resolution" };
  }

  // ---- BRIGHTNESS CHECK ----
  const stats = await sharp(buffer).stats();
  const brightness =
    stats.channels[0].mean * 0.299 +
    stats.channels[1].mean * 0.587 +
    stats.channels[2].mean * 0.114;

  if (brightness < 30) {
    return { ok: false, reason: "too_dark" };
  }
  if (brightness > 220) {
    return { ok: false, reason: "too_bright" };
  }

  // ---- BLUR CHECK (Correct Method: Variance of Laplacian) ----
  const laplaceBuffer = await sharp(buffer)
    .greyscale()
    .convolve({
      width: 3,
      height: 3,
      kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    })
    .raw()
    .toBuffer();

  // Compute variance
  let sum = 0;
  let sumSq = 0;
  const n = laplaceBuffer.length;

  for (let i = 0; i < n; i++) {
    const v = laplaceBuffer[i];
    sum += v;
    sumSq += v * v;
  }

  const mean = sum / n;
  const variance = sumSq / n - mean * mean;

  // Thresholds
  if (variance < 25) {
    return { ok: false, reason: "too_blurry" };
  }

  return { ok: true };
}

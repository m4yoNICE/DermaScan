import sharp from "sharp";

export async function checkImageQuality(buffer) {
  const metadata = await sharp(buffer).metadata();
  const { width, height } = metadata;

  // Resolution check
  if (width < 200 || height < 200) {
    return { ok: false, reason: "low_resolution" };
  }

  // Brightness check
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

  // Blur check with normalized threshold
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

  // Normalize by image size (variance scales with resolution)
  const normalizedVariance = variance / ((width * height) / 1000000); // Per megapixel

  // Adjusted threshold - test with real images to calibrate
  const BLUR_THRESHOLD = 10; // This needs empirical testing

  if (normalizedVariance < BLUR_THRESHOLD) {
    return { ok: false, reason: "too_blurry", variance: normalizedVariance };
  }

  return { ok: true, variance: normalizedVariance };
}

import sharp from "sharp";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const size = 512;
const circleSvg = Buffer.from(
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`,
);

const aiSrc = join(
  process.env.USERPROFILE || "",
  ".cursor/projects/d-Projects-SWAMI/assets/favicon-circle.png",
);
const logoSrc = join(root, "public/images/logo.png");
const outPng = join(root, "public/favicon.png");
const outApple = join(root, "public/apple-touch-icon.png");
const out32 = join(root, "public/favicon-32.png");
const outAppIcon = join(root, "src/app/icon.png");
const outAppleIcon = join(root, "src/app/apple-icon.png");

async function fromAiMark() {
  if (!existsSync(aiSrc)) return null;
  return sharp(aiSrc)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: circleSvg, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function fromLogoShield() {
  const meta = await sharp(logoSrc).metadata();
  const extractW = Math.max(1, Math.round((meta.width || 1) * 0.3));
  const extractH = meta.height || size;
  const square = await sharp(logoSrc)
    .extract({ left: 0, top: 0, width: extractW, height: extractH })
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();
  return sharp(square)
    .composite([{ input: circleSvg, blend: "dest-in" }])
    .png()
    .toBuffer();
}

const buf = (await fromAiMark()) || (await fromLogoShield());
mkdirSync(join(root, "public"), { recursive: true });
mkdirSync(join(root, "src/app"), { recursive: true });

await sharp(buf).png().toFile(outPng);
await sharp(buf).resize(180, 180).png().toFile(outApple);
await sharp(buf).resize(32, 32).png().toFile(out32);
copyFileSync(outPng, outAppIcon);
copyFileSync(outApple, outAppleIcon);

console.log("Wrote circular favicon:", outPng);
console.log("Also:", outApple, out32, outAppIcon, outAppleIcon);

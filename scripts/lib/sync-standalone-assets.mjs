import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export function syncStandaloneAssets(root = process.cwd()) {
  const standaloneDir = join(root, ".next", "standalone");
  const staticSrc = join(root, ".next", "static");
  const staticDest = join(standaloneDir, ".next", "static");
  const publicSrc = join(root, "public");
  const publicDest = join(standaloneDir, "public");

  if (!existsSync(staticSrc)) {
    throw new Error("Missing .next/static — run npm run build first.");
  }

  mkdirSync(join(standaloneDir, ".next"), { recursive: true });
  cpSync(staticSrc, staticDest, { recursive: true });
  cpSync(publicSrc, publicDest, { recursive: true });
}

/**
 * Windows-friendly PM2 starter for Next.js standalone output.
 * Usage: npm run build && npm run pm2:start
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { syncStandaloneAssets } from "./lib/sync-standalone-assets.mjs";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const serverJs = join(standaloneDir, "server.js");

if (!existsSync(serverJs)) {
  console.error("Run npm run build first (.next/standalone/server.js missing).");
  process.exit(1);
}

syncStandaloneAssets();

const port = process.env.PORT ?? "3005";
const result = spawnSync(
  "pm2",
  ["start", "ecosystem.config.cjs", "--update-env"],
  {
    stdio: "inherit",
    env: { ...process.env, PORT: port, HOSTNAME: process.env.HOSTNAME ?? "0.0.0.0" },
    shell: true,
  },
);

process.exit(result.status ?? 1);

/**
 * Prepare and run Next.js standalone server (required when output: "standalone").
 * Copies .next/static and public into the standalone bundle, then starts server.js.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { syncStandaloneAssets } from "./lib/sync-standalone-assets.mjs";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const serverJs = join(standaloneDir, "server.js");

if (!existsSync(serverJs)) {
  console.error("Run npm run build first (.next/standalone/server.js missing).");
  process.exit(1);
}

syncStandaloneAssets(root);

const port = process.env.PORT ?? "3000";
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

const child = spawn(process.execPath, [serverJs], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: hostname,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

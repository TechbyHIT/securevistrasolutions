import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * When a parent lockfile exists (e.g. /var/www/package-lock.json), Next may nest
 * standalone under .next/standalone/<abs-path>/server.js. Flatten that back to
 * .next/standalone/server.js so PM2 can start it.
 */
export function resolveStandaloneServer(root = process.cwd()) {
  const standaloneDir = join(root, ".next", "standalone");
  const direct = join(standaloneDir, "server.js");
  if (existsSync(direct)) return direct;

  const nested = join(standaloneDir, root.replace(/^[\\/]+/, ""), "server.js");
  if (existsSync(nested)) return nested;

  // Walk one common Windows/Unix nesting pattern: standalone + absolute path segments
  const candidates = [
    join(standaloneDir, "var", "www", "securevista", "server.js"),
    join(standaloneDir, ...root.split(/[\\/]+/).filter(Boolean), "server.js"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export function syncStandaloneAssets(root = process.cwd()) {
  const standaloneDir = join(root, ".next", "standalone");
  const staticSrc = join(root, ".next", "static");
  const publicSrc = join(root, "public");

  if (!existsSync(staticSrc)) {
    throw new Error("Missing .next/static — run npm run build first.");
  }
  if (!existsSync(standaloneDir)) {
    throw new Error("Missing .next/standalone — ensure next.config output: 'standalone'.");
  }

  let serverJs = resolveStandaloneServer(root);
  if (!serverJs) {
    throw new Error(
      "Missing standalone server.js. Set outputFileTracingRoot in next.config and rebuild.",
    );
  }

  // Flatten nested standalone into .next/standalone/
  const directServer = join(standaloneDir, "server.js");
  if (serverJs !== directServer) {
    const nestedRoot = join(serverJs, "..");
    const tmp = join(root, ".next", "standalone-flat-tmp");
    rmSync(tmp, { recursive: true, force: true });
    cpSync(nestedRoot, tmp, { recursive: true });
    // Keep a backup of any other files then replace
    const backup = join(root, ".next", "standalone-nested-backup");
    rmSync(backup, { recursive: true, force: true });
    renameSync(standaloneDir, backup);
    renameSync(tmp, standaloneDir);
    serverJs = directServer;
  }

  if (!existsSync(serverJs)) {
    throw new Error("Standalone flatten failed — server.js still missing.");
  }

  const staticDest = join(standaloneDir, ".next", "static");
  const publicDest = join(standaloneDir, "public");
  mkdirSync(join(standaloneDir, ".next"), { recursive: true });
  cpSync(staticSrc, staticDest, { recursive: true });
  if (existsSync(publicSrc)) {
    cpSync(publicSrc, publicDest, { recursive: true });
  }

  console.log("Standalone server:", serverJs);
}

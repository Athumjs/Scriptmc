import { build } from "esbuild";
import chokidar from "chokidar";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

export function start(name: string): void {
  const pathMine: string = getFolder(name);
  if (!pathMine) return;
  const watcher = chokidar.watch(path.join(pathMine, "scripts", "main.ts"), {
    ignoreInitial: true,
  });

  watcher.on("all", () => {
    build({
      entryPoints: [path.join(pathMine, "scripts", "main.ts")],
      outfile: path.join(pathMine, "scripts", "smc", "main.js"),
      bundle: true,
      platform: "node",
      target: "esnext",
      format: "esm",
      external: ["@minecraft/server", "@minecraft/server-ui"],
    });
  });
}

function getFolder(name: string): string {
  const pathMine: string = fs.readFileSync(
    path.join(__dirname, "../../path.config"),
    "utf-8"
  );
  if (
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "development_behavior_packs", name)
    )
  ) {
    console.log(`\x1b[1;31mAddon not found: ${name}\x1b[0m`);
    return "";
  }
  if (
    !fs.existsSync(
      path.join(
        os.homedir(),
        pathMine,
        "development_behavior_packs",
        name,
        "scripts",
        "main.ts"
      )
    )
  ) {
    console.log(`\x1b[1;31mTypescript not found: ${name}\x1b[0m`);
    return "";
  }
  return path.join(os.homedir(), pathMine, "development_behavior_packs", name);
}

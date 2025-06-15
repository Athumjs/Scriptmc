import { build } from "esbuild";
import chokidar from "chokidar";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

export function start(name: string): void {
  const pathMine: string = getFolder(name);
  if (!pathMine) return;
  const watcher = chokidar.watch(path.join(pathMine, "scriptmc"), {
    ignoreInitial: true,
  });

  watcher.on("change", (pathFile) => {
    build({
      entryPoints: [path.join(pathMine, "scriptmc/**/*.ts")],
      outdir: path.join(pathMine, "scripts"),
      platform: "node",
      target: "esnext",
      format: "esm",
    });
    console.clear();
    console.log(
      `\x1b[1;32mTranspiled \x1b[3;33m${path.basename(
        pathFile
      )}\x1b[1;32m file\x1b[0m`
    );
  });

  console.log(
    `\x1b[1;32mTranspilation enabled (edit \x1b[3;33m${path.join(
      pathMine,
      "scripts",
      "main.ts"
    )}\x1b[1;32m file)\x1b[0m`
  );
}

function getFolder(name: string): string {
  const pathMine: string = fs.readFileSync(
    path.join(__dirname, "../../path.config"),
    "utf-8"
  );
  if (
    !fs.existsSync(
      path.join(
        os.homedir(),
        pathMine,
        "development_behavior_packs",
        name,
        "scriptmc",
        "main.ts"
      )
    )
  ) {
    console.log(`\x1b[1;31mTypescript not found: ${name}\x1b[0m`);
    return "";
  }
  return path.join(os.homedir(), pathMine, "development_behavior_packs", name);
}

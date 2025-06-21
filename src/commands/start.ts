import { build } from "esbuild";
import chokidar from "chokidar";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import inquirer from "inquirer";
import colors from "yoctocolors-cjs";
import { event } from "../event";

export async function start(name: string): Promise<void> {
  const pathMine: string = await getFolder(name);
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
    event(
      "sucess",
      `Transpiled ${colors.blue(colors.italic(path.basename(pathFile)))} file`
    );
  });

  watcher.on("unlink", (pathFile) => {
    build({
      entryPoints: [path.join(pathMine, "scriptmc/**/*.ts")],
      outdir: path.join(pathMine, "scripts"),
      platform: "node",
      target: "esnext",
      format: "esm",
    });
    console.clear();
    event(
      "sucess",
      `Remove ${colors.blue(colors.italic(path.basename(pathFile)))} file`
    );
  });

  event(
    "sucess",
    `Transpilation enabled (edit ${colors.blue(
      colors.italic(path.join(pathMine, "scriptmc", "main.ts"))
    )} file)`
  );
}

async function getFolder(name: string): Promise<string> {
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
    event("error", `Typescript not found: ${name}`);
    const { create } = await inquirer.prompt([
      {
        type: "confirm",
        name: "create",
        message: "Do create typescript in this addon?",
      },
    ]);
    if (create) {
      if (
        !fs.existsSync(
          path.join(
            os.homedir(),
            pathMine,
            "development_behavior_packs",
            name,
            "scriptmc"
          )
        )
      )
        fs.mkdirSync(
          path.join(
            os.homedir(),
            pathMine,
            "development_behavior_packs",
            name,
            "scriptmc"
          )
        );
      fs.writeFileSync(
        path.join(
          os.homedir(),
          pathMine,
          "development_behavior_packs",
          name,
          "scriptmc",
          "main.ts"
        ),
        ""
      );
      event("sucess", `Typescript added for the addon: ${name}`);
    }
    return "";
  }
  return path.join(os.homedir(), pathMine, "development_behavior_packs", name);
}

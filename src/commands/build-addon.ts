import fs from "node:fs";
import archiver from "archiver";
import path from "node:path";
import os from "node:os";
import { event } from "../event";
import colors from "yoctocolors-cjs";

export function build_addon(
  nameB: string,
  nameR: string,
  namePack: string
): void {
  const pathMine: string[] = getFolder(nameB, nameR);
  const output = fs.createWriteStream(
    path.join(pathMine[2], `${namePack}.mcaddon`)
  );
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    if (fs.existsSync(path.join(pathMine[0], `../scriptmc-backup-${nameB}`))) {
      fs.cpSync(
        path.join(pathMine[0], `../scriptmc-backup-${nameB}`),
        path.join(pathMine[0], "scriptmc"),
        { recursive: true }
      );
      fs.rmSync(path.join(pathMine[0], `../scriptmc-backup-${nameB}`), {
        recursive: true,
        force: true,
      });
    }
    event(
      "sucess",
      `Addon construction completed. ${colors.blue(
        colors.italic(path.join(pathMine[2], `${namePack}.mcaddon`))
      )}`
    );
  });

  archive.pipe(output);

  if (fs.existsSync(path.join(pathMine[0], "scriptmc"))) {
    fs.cpSync(
      path.join(pathMine[0], "scriptmc"),
      path.join(pathMine[0], `../scriptmc-backup-${nameB}`),
      { recursive: true }
    );
    fs.rmSync(path.join(pathMine[0], "scriptmc"), {
      recursive: true,
      force: true,
    });
  }
  archive.directory(`${pathMine[0]}/`, nameB);
  archive.directory(`${pathMine[1]}/`, nameR);

  archive.finalize();
}

function getFolder(nameB: string, nameR: string): string[] {
  const pathMine: string = fs.readFileSync(
    path.join(__dirname, "../../path.config"),
    "utf-8"
  );
  if (!fs.existsSync(path.join(os.homedir(), pathMine, "scriptmc-exports")))
    fs.mkdirSync(path.join(os.homedir(), pathMine, "scriptmc-exports"));
  if (
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "scriptmc-exports", "addons")
    )
  )
    fs.mkdirSync(
      path.join(os.homedir(), pathMine, "scriptmc-exports", "addons")
    );
  return [
    path.join(os.homedir(), pathMine, "development_behavior_packs", nameB),
    path.join(os.homedir(), pathMine, "development_resource_packs", nameR),
    path.join(os.homedir(), pathMine, "scriptmc-exports", "addons"),
  ];
}

import fs from "node:fs";
import archiver from "archiver";
import path from "node:path";
import os from "node:os";

export function build_addon(
  nameB: string,
  nameR: string,
  namePack: string
): void {
  const pathMine: string[] = getFolder(nameB, nameR);
  if (pathMine.length <= 0) return;
  const output = fs.createWriteStream(
    path.join(pathMine[2], `${namePack}.mcaddon`)
  );
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    console.log(
      `\x1b[1;32mAddon construction completed. \x1b[3;33m${path.join(
        pathMine[2],
        `${namePack}.mcaddon`
      )}\x1b[0m`
    );
  });

  archive.pipe(output);

  archive.directory(`${pathMine[0]}/`, `${nameB} smcB`);
  archive.directory(`${pathMine[1]}/`, `${nameR} smcR`);

  archive.finalize();
}

function getFolder(nameB: string, nameR: string): string[] {
  const pathMine: string = fs.readFileSync(
    path.join(__dirname, "../../path.config"),
    "utf-8"
  );
  if (
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "development_behavior_packs", nameB)
    ) &&
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "development_resource_packs", nameR)
    )
  ) {
    console.log(`\x1b[1;31mAddon not found: ${nameB} &  ${nameR}\x1b[0m`);
    return [];
  }
  if (!fs.existsSync(path.join(os.homedir(), pathMine, "scriptmc-exports")))
    fs.mkdirSync(path.join(os.homedir(), pathMine, "scriptmc-exports"));
  return [
    path.join(os.homedir(), pathMine, "development_behavior_packs", nameB),
    path.join(os.homedir(), pathMine, "development_resource_packs", nameR),
    path.join(os.homedir(), pathMine, "scriptmc-exports"),
  ];
}

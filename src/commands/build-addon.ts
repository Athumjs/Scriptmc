import fs from "node:fs";
import archiver from "archiver";
import path from "node:path";
import os from "node:os";

export function build_addon(name: string): void {
  const pathMine: string[] = getFolder(name);
  if (pathMine.length <= 0) return;
  const output = fs.createWriteStream(`${name}.mcaddon`);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    console.log("\x1b[1;32mAddon construction completed.\x1b[0m");
  });

  archive.pipe(output);

  archive.directory(`${pathMine[0]}/`, `${name} B`);
  archive.directory(`${pathMine[1]}/`, `${name} R`);

  archive.finalize();
}

function getFolder(name: string): string[] {
  const pathMine: string = fs.readFileSync(
    path.join(__dirname, "../../path.config"),
    "utf-8"
  );
  if (
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "development_behavior_packs", name)
    ) &&
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "development_resource_packs", name)
    )
  ) {
    console.log(`\x1b[1;31mAddon not found: ${name}\x1b[0m`);
    return [];
  }
  return [
    path.join(os.homedir(), pathMine, "development_behavior_packs", name),
    path.join(os.homedir(), pathMine, "development_resource_packs", name),
  ];
}

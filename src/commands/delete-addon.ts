import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export function delete_addon(name: string): void {
  const pathMine: string[] = getFolder(name);
  if (pathMine.length <= 0) return;
  fs.rmSync(pathMine[0], {
    recursive: true,
    force: true,
  });
  fs.rmSync(pathMine[1], {
    recursive: true,
    force: true,
  });
  console.log(`\x1b[1;32mAddon deleted sucessfully: ${name}\x1b[0m`);
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

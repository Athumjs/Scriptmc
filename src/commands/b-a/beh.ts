import fs from "node:fs";
import path from "node:path";

const beh: string[] = [
  "animation_controllers",
  "animations",
  "blocks",
  "cameras",
  "entities",
  "features",
  "features_rules",
  "dialogue",
  "functions",
  "item_catalog",
  "items",
  "loot_table",
  "recipes",
  "spawn_rules",
  "structures",
  "texts",
  "trading",
  "scripts",
  "manifest.json",
  "pack_icon.png",
];

export function Beh(pathMine: string, name: string) {
  beh.forEach((item) => {
    if (!fs.existsSync(path.join(pathMine, item))) return;
    fs.cpSync(
      path.join(pathMine, item),
      path.join(pathMine, `../smc-backup-${name}`, item),
      { recursive: true }
    );
  });
}

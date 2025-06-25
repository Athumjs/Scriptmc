import fs from "node:fs";
import path from "node:path";

const reh: string[] = [
  "manifest.json",
  "animation_controllers",
  "animations",
  "attachables",
  "block_culling",
  "entity",
  "fogs",
  "items",
  "materials",
  "models",
  "particles",
  "render_controllers",
  "sounds",
  "texts",
  "textures",
  "ui",
  "blocks.json",
  "manifest.json",
  "pack_icon.png",
  "sounds.json",
];

export function Reh(pathMine: string, name: string) {
  reh.forEach((item) => {
    if (!fs.existsSync(path.join(pathMine, item))) return;
    fs.cpSync(
      path.join(pathMine, item),
      path.join(pathMine, `../smc-backup-${name}`, item),
      { recursive: true }
    );
  });
}

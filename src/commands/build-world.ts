import fs from "node:fs";
import archiver from "archiver";
import path from "node:path";
import os from "node:os";
import { event } from "../event";
import colors from "yoctocolors-cjs";

export function build_world(
  nameW: string,
  nameB: string,
  nameR: string,
  namePack: string
): void {
  const pathMine: string[] = getFolder(nameW, nameB, nameR);
  const output = fs.createWriteStream(
    path.join(pathMine[3], `${namePack}.mcworld`)
  );
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });
  output.on("close", () => {
    if (nameB && nameR) {
      fs.rmSync(path.join(pathMine[2], "behavior_packs", nameB), {
        recursive: true,
        force: true,
      });
      fs.rmSync(path.join(pathMine[2], "resource_packs", nameR), {
        recursive: true,
        force: true,
      });
    }
    event(
      "sucess",
      `World construction completed. ${colors.blue(
        colors.italic(path.join(pathMine[3], `${namePack}.mcworld`))
      )}`
    );
  });

  archive.pipe(output);
  if (nameB && nameR) {
    fs.cpSync(pathMine[0], path.join(pathMine[2], "behavior_packs", nameB), {
      recursive: true,
    });
    fs.cpSync(pathMine[1], path.join(pathMine[2], "resource_packs", nameR), {
      recursive: true,
    });
  }
  archive.directory(`${pathMine[2]}/`, false);
  archive.finalize();
}

function getFolder(nameW: string, nameB: string, nameR: string): string[] {
  const pathMine: string = fs.readFileSync(
    path.join(__dirname, "../../path.config"),
    "utf-8"
  );
  if (!fs.existsSync(path.join(os.homedir(), pathMine, "scriptmc-exports")))
    fs.mkdirSync(path.join(os.homedir(), pathMine, "scriptmc-exports"));
  if (
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "scriptmc-exports", "worlds")
    )
  )
    fs.mkdirSync(
      path.join(os.homedir(), pathMine, "scriptmc-exports", "worlds")
    );
  return [
    path.join(
      os.homedir(),
      pathMine,
      "development_behavior_packs",
      nameB || ""
    ),
    path.join(
      os.homedir(),
      pathMine,
      "development_resource_packs",
      nameR || ""
    ),
    path.join(os.homedir(), pathMine, "minecraftWorlds", nameW),
    path.join(os.homedir(), pathMine, "scriptmc-exports", "worlds"),
  ];
}

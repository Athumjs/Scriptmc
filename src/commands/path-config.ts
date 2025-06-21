import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export function path_config(path_config: string): void {
  if (path_config.includes(os.homedir())) {
    fs.writeFileSync(
      path.join(__dirname, "../../path.config"),
      path_config.slice(os.homedir().length).replace(/"/g, "")
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, "../../path.config"),
      path_config.replace(/"/g, "")
    );
  }
}

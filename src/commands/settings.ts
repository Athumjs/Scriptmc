import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import inquirer from "inquirer";
import { event } from "../event";

const paths: {
  minecraft: () => Promise<void>;
  folderPath: () => Promise<void>;
  folderName: () => Promise<void>;
} = {
  minecraft: async () => {
    const { pathMine } = await inquirer.prompt([
      {
        type: "input",
        name: "pathMine",
        message: "Minecraft (com.mojang) Path:",
      },
    ]);
    if (pathMine.includes(os.homedir())) {
      if (!fs.existsSync(pathMine)) {
        event("error", "Path not exist.");
        return;
      }
      fs.writeFileSync(
        path.join(__dirname, "../../configs/path.config"),
        fs
          .readFileSync(
            path.join(__dirname, "../../configs/path.config"),
            "utf-8"
          )
          .replace(
            fs
              .readFileSync(
                path.join(__dirname, "../../configs/path.config"),
                "utf-8"
              )
              .match(/\$mojang:.*\$/)![0],
            `$mojang: ${pathMine.slice(os.homedir().length).replace(/"/g, "")}$`
          )
      );
    } else {
      if (!fs.existsSync(path.join(os.homedir(), pathMine))) {
        event("error", "Path not exist.");
        return;
      }
      fs.writeFileSync(
        path.join(__dirname, "../../configs/path.config"),
        fs
          .readFileSync(
            path.join(__dirname, "../../configs/path.config"),
            "utf-8"
          )
          .replace(
            fs
              .readFileSync(
                path.join(__dirname, "../../configs/path.config"),
                "utf-8"
              )
              .match(/\$mojang:.*\$/)![0],
            `$mojang: ${pathMine.replace(/"/g, "")}$`
          )
      );
    }
  },
  folderPath: async () => {
    const { pathFolder } = await inquirer.prompt([
      {
        type: "input",
        name: "pathFolder",
        message: "Exports Folder Path:",
      },
    ]);
    if (pathFolder.includes(os.homedir())) {
      if (!fs.existsSync(pathFolder)) {
        event("error", "Path not exist.");
        return;
      }
      fs.writeFileSync(
        path.join(__dirname, "../../configs/path.config"),
        fs
          .readFileSync(
            path.join(__dirname, "../../configs/path.config"),
            "utf-8"
          )
          .replace(
            fs
              .readFileSync(
                path.join(__dirname, "../../configs/path.config"),
                "utf-8"
              )
              .match(/\$exportsPath:.*\$/)![0],
            `$exportsPath: ${pathFolder
              .slice(os.homedir().length)
              .replace(/"/g, "")}$`
          )
      );
    } else {
      if (!fs.existsSync(path.join(os.homedir(), pathFolder))) {
        event("error", "Path not exist.");
        return;
      }
      fs.writeFileSync(
        path.join(__dirname, "../../configs/path.config"),
        fs
          .readFileSync(
            path.join(__dirname, "../../configs/path.config"),
            "utf-8"
          )
          .replace(
            fs
              .readFileSync(
                path.join(__dirname, "../../configs/path.config"),
                "utf-8"
              )
              .match(/\$exportsPath:.*\$/)![0],
            `$exportsPath: ${pathFolder.replace(/"/g, "")}$`
          )
      );
    }
  },
  folderName: async () => {
    const { nameFolder } = await inquirer.prompt([
      {
        type: "input",
        name: "nameFolder",
        message: "Exports Folder Name:",
      },
    ]);
    fs.writeFileSync(
      path.join(__dirname, "../../configs/path.config"),
      fs
        .readFileSync(
          path.join(__dirname, "../../configs/path.config"),
          "utf-8"
        )
        .replace(
          fs
            .readFileSync(
              path.join(__dirname, "../../configs/path.config"),
              "utf-8"
            )
            .match(/\$exportsName:.*\$/)![0],
          `$exportsName: ${path.basename(nameFolder.replace(/"/g, ""))}$`
        )
    );
  },
};

const manifestOptions: {
  min_engine_version: () => Promise<void>;
  minecraft_server: () => Promise<void>;
  minecraft_server_ui: () => Promise<void>;
} = {
  min_engine_version: async () => {
    const { version } = await inquirer.prompt([
      {
        type: "input",
        name: "version",
        message: "min_engine_version:",
      },
    ]);
    if (!version.match(/\[\d,\d{1,2},\d{1,2}\]/)) {
      event("error", "Value invalid.");
      return;
    }
    fs.writeFileSync(
      path.join(__dirname, "../../configs/manifest.config"),
      fs
        .readFileSync(
          path.join(__dirname, "../../configs/manifest.config"),
          "utf-8"
        )
        .replace(
          fs
            .readFileSync(
              path.join(__dirname, "../../configs/manifest.config"),
              "utf-8"
            )
            .match(/\$min_engine_version:.*\$/)![0],
          `$min_engine_version: ${version}$`
        )
    );
  },
  minecraft_server: async () => {
    const { version } = await inquirer.prompt([
      {
        type: "input",
        name: "version",
        message: "@minecraft/server version:",
      },
    ]);
    if (!version.match(/\d\.\d{1,2}\.\d/)) {
      event("error", "Value invalid.");
      return;
    }
    fs.writeFileSync(
      path.join(__dirname, "../../configs/manifest.config"),
      fs
        .readFileSync(
          path.join(__dirname, "../../configs/manifest.config"),
          "utf-8"
        )
        .replace(
          fs
            .readFileSync(
              path.join(__dirname, "../../configs/manifest.config"),
              "utf-8"
            )
            .match(/\$@minecraft\/server:.*\$/)![0],
          `$@minecraft/server: ${version}$`
        )
    );
  },
  minecraft_server_ui: async () => {
    const { version } = await inquirer.prompt([
      {
        type: "input",
        name: "version",
        message: "@minecraft/server-ui version:",
      },
    ]);
    if (!version.match(/\d\.\d{1,2}\.\d/)) {
      event("error", "Value invalid.");
      return;
    }
    fs.writeFileSync(
      path.join(__dirname, "../../configs/manifest.config"),
      fs
        .readFileSync(
          path.join(__dirname, "../../configs/manifest.config"),
          "utf-8"
        )
        .replace(
          fs
            .readFileSync(
              path.join(__dirname, "../../configs/manifest.config"),
              "utf-8"
            )
            .match(/\$@minecraft\/server-ui:.*\$/)![0],
          `$@minecraft/server-ui: ${version}$`
        )
    );
  },
};

export class Settings {
  Paths(pathName: string) {
    if (pathName.includes("Minecraft")) paths.minecraft();
    else if (pathName.includes("Folder Path")) paths.folderPath();
    else paths.folderName();
  }
  Manifest(manifestOption: string) {
    if (manifestOption.includes("min_engine_version"))
      manifestOptions.min_engine_version();
    else if (manifestOption.includes("@minecraft/server version"))
      manifestOptions.minecraft_server();
    else manifestOptions.minecraft_server_ui();
  }
}

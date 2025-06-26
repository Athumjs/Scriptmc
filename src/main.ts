#!/usr/bin/env node

import { message_help } from "./commands/help.js";
import { validArgs } from "./validArgs.js";
import { new_addon } from "./commands/new-addon.js";
import { delete_addon } from "./commands/delete-addon.js";
import { build_addon } from "./commands/build-addon.js";
import { template } from "./commands/template.js";
import inquirer from "inquirer";
import { start } from "./commands/start.js";
import colors from "yoctocolors-cjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { build_world } from "./commands/build-world.js";
import { event } from "./event.js";
import { Settings } from "./commands/settings.js";

async function main(): Promise<void> {
  if (validArgs().length <= 0) return;
  const args: string[] = validArgs() as string[];
  const arg: string = args.filter((value) => value !== "").join("");
  const pathMine: string[] = await getFolder();
  if (arg.startsWith("-v") || arg.startsWith("--version")) {
    console.log("\x1b[34mVersion: \x1b[0m1.1.3");
  } else if (arg.startsWith("-h") || arg.startsWith("--help")) {
    message_help();
  } else if (arg.startsWith("-n") || arg.startsWith("--new")) {
    const { name, description } = await inquirer.prompt([
      {
        type: "search",
        name: "name",
        message: "Addon name:",
        source: (term) => {
          const addons: string[] = [];
          if (term) addons.push(term);
          if (pathMine[0]) {
            return addons.filter(
              (addon) => !fs.readdirSync(pathMine[0])?.includes(addon)
            );
          }
          return addons;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Addon description:",
      },
    ]);
    const { script, language } = await inquirer.prompt([
      {
        type: "confirm",
        name: "script",
        message: "Script?",
      },
      {
        default: "Javascript",
        when: (data) => data.script === true,
        type: "list",
        name: "language",
        message: "Language:",
        choices: [
          colors.cyan(`Typescript ${colors.black("(recomended)")}`),
          colors.blueBright("Typescript empty"),
          colors.yellow("Javascript"),
          colors.redBright("Javascript empty"),
        ],
        theme: {
          icon: {
            cursor: "–→",
          },
          style: {
            highlight: (text: string) => colors.bold(` ${text}`),
          },
        },
      },
    ]);
    new_addon(name, description, script, language);
  } else if (arg.startsWith("-b") || arg.startsWith("--build")) {
    if (pathMine.length <= 0) {
      event("error", "No addons found.");
      return;
    }
    const behaviors: string[] = fs
      .readdirSync(pathMine[0])
      .filter((behavior) =>
        fs.existsSync(path.join(pathMine[0], behavior, "manifest.json"))
      );
    const resources: string[] = fs
      .readdirSync(pathMine[1])
      .filter((resource) =>
        fs.existsSync(path.join(pathMine[1], resource, "manifest.json"))
      );
    if (behaviors.length <= 0 || resources.length <= 0) {
      event("error", "No addons found.");
      return;
    }
    const { compile } = await inquirer.prompt([
      {
        type: "list",
        name: "compile",
        message: "Compile addon or world:",
        choices: [colors.yellow("Addon"), colors.red("World")],
        theme: {
          icon: {
            cursor: "–→",
          },
          style: {
            highlight: (text: string) => colors.bold(` ${text}`),
          },
        },
      },
    ]);
    if (compile.includes("Addon")) {
      const { nameB, nameR, namePack } = await inquirer.prompt([
        {
          type: "search",
          name: "nameB",
          message: "Behavior name:",
          source: (term) => {
            return behaviors.filter((behavior) =>
              behavior.includes(term || "")
            );
          },
        },
        {
          type: "search",
          name: "nameR",
          message: "Resource name:",
          source: (term) => {
            return resources.filter((resource) =>
              resource.includes(term || "")
            );
          },
        },
        {
          type: "input",
          name: "namePack",
          message: "Addon compilated name:",
          required: true,
        },
      ]);
      build_addon(nameB, nameR, namePack);
    } else {
      if (pathMine.length <= 0 || !pathMine[2]) {
        event("error", "No addons/worlds found.");
        return;
      }
      const worlds: string[] = fs.readdirSync(pathMine[2]);
      if (worlds.length <= 0) {
        event("error", "No worlds found.");
        return;
      }
      const { nameW, nameB, nameR, namePack } = await inquirer.prompt([
        {
          type: "confirm",
          name: "addon",
          message: "Would you want to import the world with the addons?",
        },
        {
          type: "search",
          name: "nameW",
          message: "World name:",
          source: (term) => {
            return worlds.filter((world) => world.includes(term || ""));
          },
        },
        {
          when: (data) => {
            const behaviors: string[] = fs
              .readdirSync(pathMine[0])
              .filter((behavior) =>
                fs.existsSync(path.join(pathMine[0], behavior, "manifest.json"))
              );
            const resources: string[] = fs
              .readdirSync(pathMine[1])
              .filter((resource) =>
                fs.existsSync(path.join(pathMine[1], resource, "manifest.json"))
              );
            if (behaviors.length <= 0 || resources.length <= 0) {
              event("error", "No addons found.");
              return false;
            }
            return data.addon;
          },
          type: "search",
          name: "nameB",
          message: "Behavior name:",
          source: (term) => {
            return behaviors.filter((behavior) =>
              behavior.includes(term || "")
            );
          },
        },
        {
          when: (data) => {
            const behaviors: string[] = fs
              .readdirSync(pathMine[0])
              .filter((behavior) =>
                fs.existsSync(path.join(pathMine[0], behavior, "manifest.json"))
              );
            const resources: string[] = fs
              .readdirSync(pathMine[1])
              .filter((resource) =>
                fs.existsSync(path.join(pathMine[1], resource, "manifest.json"))
              );
            if (behaviors.length <= 0 || resources.length <= 0) {
              event("error", "No addons found.");
              return false;
            }
            return data.addon;
          },
          type: "search",
          name: "nameR",
          message: "Resource name:",
          source: (term) => {
            return resources.filter((resource) =>
              resource.includes(term || "")
            );
          },
        },
        {
          type: "input",
          name: "namePack",
          message: "World compilated name:",
        },
      ]);
      build_world(nameW, nameB, nameR, namePack);
    }
  } else if (arg.startsWith("-d") || arg.startsWith("--delete")) {
    if (pathMine.length <= 0) {
      event("error", "No addons found.");
      return;
    }
    const behaviors: string[] = fs
      .readdirSync(pathMine[0])
      .filter((behavior) =>
        fs.existsSync(path.join(pathMine[0], behavior, "manifest.json"))
      );
    const resources: string[] = fs
      .readdirSync(pathMine[1])
      .filter((resource) =>
        fs.existsSync(path.join(pathMine[1], resource, "manifest.json"))
      );
    if (behaviors.length <= 0 || resources.length <= 0) {
      event("error", "No addons found.");
      return;
    }
    const { nameB, nameR } = await inquirer.prompt([
      {
        type: "search",
        name: "nameB",
        message: "Behavior name:",
        source: (term) => {
          return behaviors.filter((behavior) => behavior.includes(term || ""));
        },
      },
      {
        type: "search",
        name: "nameR",
        message: "Resource name:",
        source: (term) => {
          return resources.filter((resource) => resource.includes(term || ""));
        },
      },
    ]);
    delete_addon(nameB, nameR);
  } else if (arg.startsWith("-s") || arg.startsWith("--settings")) {
    const { setting } = await inquirer.prompt([
      {
        type: "list",
        name: "setting",
        message: "Settings:",
        choices: [
          colors.green("Paths"),
          colors.red("Manifest Json"),
          colors.cyan("Build"),
        ],
        theme: {
          icon: {
            cursor: "–→",
          },
          style: {
            highlight: (text: string) => colors.bold(` ${text}`),
          },
        },
      },
    ]);
    if (setting.includes("Paths")) {
      const { pathName } = await inquirer.prompt([
        {
          type: "list",
          name: "pathName",
          message: "Change Path:",
          choices: [
            colors.green(`Minecraft ${colors.gray("(com.mojang)")}`),
            colors.red("Exports Folder Path"),
            colors.cyan("Exports Folder Name"),
          ],
          theme: {
            icon: {
              cursor: "–→",
            },
            style: {
              highlight: (text: string) => colors.bold(` ${text}`),
            },
          },
        },
      ]);
      new Settings().Paths(pathName);
    } else if (setting.includes("Manifest")) {
      const { manifestOption } = await inquirer.prompt([
        {
          type: "list",
          name: "manifestOption",
          message: "Change Manifest Option:",
          choices: [
            colors.green("min_engine_version"),
            colors.red("@minecraft/server version"),
            colors.cyan("@minecraft/server-ui version"),
          ],
          theme: {
            icon: {
              cursor: "–→",
            },
            style: {
              highlight: (text: string) => colors.bold(` ${text}`),
            },
          },
        },
      ]);
      new Settings().Manifest(manifestOption);
    } else {
      const { buildType } = await inquirer.prompt([
        {
          type: "list",
          name: "buildType",
          message:
            "Would you like to export the essential addon folders (like blocks, items and scripts)?",
          choices: [
            colors.green("Only essential"),
            colors.red("Specify folder"),
            colors.cyan("All folders"),
          ],
          theme: {
            icon: {
              cursor: "–→",
            },
            style: {
              highlight: (text: string) => colors.bold(` ${text}`),
            },
          },
        },
      ]);
      new Settings().Build(buildType);
    }
  } else if (arg.startsWith("-t") || arg.startsWith("--template")) {
    if (pathMine.length <= 0) {
      event("error", "No addons found.");
      return;
    }
    const behaviors: string[] = fs
      .readdirSync(pathMine[0])
      .filter((behavior) =>
        fs.existsSync(path.join(pathMine[0], behavior, "manifest.json"))
      );
    if (behaviors.length <= 0) {
      event("error", "No behaviors found.");
      return;
    }
    const { templat, name } = await inquirer.prompt([
      {
        type: "list",
        name: "templat",
        message: "Select a template:",
        choices: [
          colors.green("item"),
          colors.red("block"),
          colors.magenta("entity"),
        ],
        theme: {
          icon: {
            cursor: "–→",
          },
          style: {
            highlight: (text: string) => colors.bold(` ${text}`),
          },
        },
      },
      {
        type: "search",
        name: "name",
        message: "Behavior name:",
        source: (term) => {
          return behaviors.filter((behavior) => behavior.includes(term || ""));
        },
      },
    ]);
    template(templat, name);
  } else if (arg.startsWith("start")) {
    const behaviors: string[] = fs
      .readdirSync(pathMine[0])
      .filter((behavior) =>
        fs.existsSync(path.join(pathMine[0], behavior, "manifest.json"))
      );
    if (pathMine.length <= 0 || behaviors.length <= 0) {
      event("error", "No behaviors found.");
      return;
    }
    const { name } = await inquirer.prompt([
      {
        type: "search",
        name: "name",
        message: "Behavior name:",
        source: (term) => {
          return behaviors.filter((behavior) => behavior.includes(term || ""));
        },
      },
    ]);
    start(name);
  }
}

async function getFolder(): Promise<string[]> {
  const pathMine: string = fs
    .readFileSync(path.join(__dirname, "../configs/path.config"), "utf-8")
    .match(/\$mojang:.*\$/)![0]
    .replace(/\$mojang:\s(.*)\$/, "$1");
  let pathWorld: string = "";
  if (
    fs.readdirSync(
      path.join(os.homedir(), pathMine, "development_behavior_packs")
    ).length <= 0 ||
    fs.readdirSync(
      path.join(os.homedir(), pathMine, "development_resource_packs")
    ).length <= 0
  ) {
    return [];
  }
  if (
    fs.readdirSync(path.join(os.homedir(), pathMine, "minecraftWorlds"))
      .length > 0
  ) {
    pathWorld = path.join(os.homedir(), pathMine, "minecraftWorlds");
  }
  return [
    path.join(os.homedir(), pathMine, "development_behavior_packs"),
    path.join(os.homedir(), pathMine, "development_resource_packs"),
    pathWorld,
  ];
}

main();

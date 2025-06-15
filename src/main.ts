#!/usr/bin/env node

import { message_error } from "./message-error.js";
import { message_help } from "./commands/help.js";
import { validArgs } from "./validArgs.js";
import { new_addon } from "./commands/new-addon.js";
import { delete_addon } from "./commands/delete-addon.js";
import { build_addon } from "./commands/build-addon.js";
import { path_config } from "./commands/path-config.js";
import inquirer from "inquirer";
import { start } from "./commands/start.js";
import colors from "yoctocolors-cjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { rejects } from "node:assert";

async function main(): Promise<void> {
  if (validArgs().event === "sucess") {
    const args: string[] = validArgs().value as string[];
    const arg: string = args.filter((value) => value !== "").join("");
    const pathMine: string[] = getFolder();
    if (arg.startsWith("-v") || arg.startsWith("--version")) {
      console.log("\x1b[34mVersion: \x1b[0m1.0.5");
    } else if (arg.startsWith("-h") || arg.startsWith("--help")) {
      message_help();
    } else if (arg.startsWith("-n") || arg.startsWith("--new")) {
      const { name, description } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Addon name:",
          required: true,
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
          message: "Script:",
        },
        {
          default: "Javascript",
          when: (data) => data.script === true,
          type: "list",
          name: "language",
          message: "Language:",
          choices: [
            colors.cyan(`Typescript ${colors.black("(recomended)")}`),
            colors.yellow("Javascript"),
          ],
          theme: {
            icon: {
              cursor: "-→",
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
        console.log("\x1b[1;31mNo addons found.\x1b[0m");
        return;
      }
      const { nameB, nameR, namePack } = await inquirer.prompt([
        {
          type: "search",
          name: "nameB",
          message: "Behavior name:",
          source: (term) => {
            const behaviors: string[] = fs.readdirSync(pathMine[0]);
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
            const resources: string[] = fs.readdirSync(pathMine[1]);
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
    } else if (arg.startsWith("-d") || arg.startsWith("--delete")) {
      if (pathMine.length <= 0) {
        console.log("\x1b[1;31mNo addons found.\x1b[0m");
        return;
      }
      const { nameB, nameR } = await inquirer.prompt([
        {
          type: "search",
          name: "nameB",
          message: "Behavior name:",
          source: (term) => {
            const behaviors: string[] = fs.readdirSync(pathMine[0]);
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
            const resources: string[] = fs.readdirSync(pathMine[1]);
            return resources.filter((resource) =>
              resource.includes(term || "")
            );
          },
        },
      ]);
      delete_addon(nameB, nameR);
    } else if (arg.startsWith("-p") || arg.startsWith("--path")) {
      const { path } = await inquirer.prompt([
        {
          type: "input",
          name: "path",
          message: "Path:",
          required: true,
        },
      ]);
      path_config(path);
    } else if (arg.startsWith("start")) {
      if (pathMine.length <= 0) {
        console.log("\x1b[1;31mNo behaviors found.\x1b[0m");
        return;
      }
      const { name } = await inquirer.prompt([
        {
          type: "search",
          name: "name",
          message: "Behavior name:",
          source: (term) => {
            const behaviors: string[] = fs.readdirSync(pathMine[0]);
            return behaviors.filter((behavior) =>
              behavior.includes(term || "")
            );
          },
        },
      ]);
      start(name);
    }
  } else {
    message_error();
  }
}

function getFolder(): string[] {
  const pathMine: string = fs.readFileSync(
    path.join(__dirname, "../path.config"),
    "utf-8"
  );
  if (
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "development_behavior_packs")
    ) &&
    !fs.existsSync(
      path.join(os.homedir(), pathMine, "development_resource_packs")
    )
  ) {
    return [];
  }
  return [
    path.join(os.homedir(), pathMine, "development_behavior_packs"),
    path.join(os.homedir(), pathMine, "development_resource_packs"),
  ];
}

main();

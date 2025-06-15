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

async function main(): Promise<void> {
  if (validArgs().event === "sucess") {
    const args: string[] = validArgs().value as string[];
    const arg: string = args.filter((value) => value !== "").join("");
    if (arg.startsWith("-v") || arg.startsWith("--version")) {
      console.log("\x1b[34mVersion: \x1b[0m1.0.4");
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
          type: "list",
          name: "script",
          message: "Script:",
          choices: [
            colors.green(`Yes ${colors.black("(recomended)")}`),
            colors.red("No"),
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
        {
          default: "Typescript",
          when: (data) => data.script.includes("Yes"),
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
      const { name, nameB, nameR, namePack } = await inquirer.prompt([
        {
          type: "list",
          name: "nameEquals",
          message: `Your addon equals name: ${colors.black(
            "(behavior, resource)"
          )}`,
          choices: [colors.green("Yes"), colors.red("No")],
          theme: {
            icon: {
              cursor: "-→",
            },
            style: {
              highlight: (text: string) => colors.bold(` ${text}`),
            },
          },
        },
        {
          when: (data) => data.nameEquals.includes("Yes"),
          type: "input",
          name: "name",
          message: "Addon name:",
          required: true,
        },
        {
          when: (data) => data.nameEquals.includes("No"),
          type: "input",
          name: "nameB",
          message: "Behavior addon name:",
          required: true,
        },
        {
          when: (data) => data.nameEquals.includes("No"),
          type: "input",
          name: "nameR",
          message: "Resource addon name:",
          required: true,
        },
        {
          when: (data) => data.nameEquals.includes("No"),
          type: "input",
          name: "namePack",
          message: "Addon compilated name:",
          required: true,
        },
      ]);
      build_addon(nameB || name, nameR || name, namePack || name);
    } else if (arg.startsWith("-d") || arg.startsWith("--delete")) {
      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Addon name:",
          required: true,
        },
      ]);
      delete_addon(name);
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
      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Addon name:",
          required: true,
        },
      ]);
      start(name);
    }
  } else {
    message_error();
  }
}

main();

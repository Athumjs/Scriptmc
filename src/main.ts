#!/usr/bin/env node

import Readline from "node:readline";
import { message_error } from "./message-error.js";
import { message_help } from "./commands/help.js";
import { validArgs } from "./validArgs.js";
import { new_addon } from "./commands/new-addon.js";
import { delete_addon } from "./commands/delete-addon.js";
import { build_addon } from "./commands/build-addon.js";
import { path_config } from "./commands/path-config.js";

let readline: Readline.Interface;

if (validArgs().event === "sucess") {
  const args: string[] = validArgs().value as string[];
  const arg: string = args.filter((value) => value !== "").join("");
  if (arg.startsWith("-v") || arg.startsWith("--version")) {
    console.log("\x1b[34mVersion: \x1b[0m0.0.1");
  } else if (arg.startsWith("-h") || arg.startsWith("--help")) {
    message_help();
  } else if (arg.startsWith("-n") || arg.startsWith("--new")) {
    readline = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Addon name: ", (name) => {
      readline.question("Addon description: ", (description) => {
        readline.question("Script? (Y, n) ", (res) => {
          if (res.toLowerCase() !== "y" && res.toLowerCase() !== "n") res = "y";
          new_addon(name, description, res);
          readline.close();
        });
      });
    });
  } else if (arg.startsWith("-b") || arg.startsWith("--build")) {
    readline = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Addon name: ", (name) => {
      build_addon(name);
      readline.close();
    });
  } else if (arg.startsWith("-d") || arg.startsWith("--delete")) {
    readline = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Addon name: ", (name) => {
      delete_addon(name);
      readline.close();
    });
  } else if (arg.startsWith("-p") || arg.startsWith("--path")) {
    readline = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Path: ", (path) => {
      path_config(path);
      readline.close();
    });
  }
} else {
  message_error();
}

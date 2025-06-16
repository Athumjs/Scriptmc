import { list } from "./cli-list.js";
import { event } from "./event.js";

function validArgs(): string[] {
  const args_cli: string[] = process.argv.slice(2);
  const args_valid: string[] = [];
  let arg_error: string = "";

  for (let i: number = 0; i < list.length; i++) {
    args_valid.push(
      args_cli
        .filter((value) => list[i].name === value || list[i].flag === value)
        .join("")
    );
    args_cli.forEach((arg) => {
      if (args_valid.includes(arg)) return;
      arg_error = arg;
    });
  }

  if (args_cli.length !== args_valid.filter((value) => value !== "").length) {
    event("error", `Invalid argument not expected: ${arg_error}`);
    return [];
  }

  return args_valid;
}

export { validArgs };

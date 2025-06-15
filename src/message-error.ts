import { validArgs } from "./validArgs.js";

export function message_error(): void {
  if (validArgs().value.length <= 56) {
    console.log("\x1b[1;31m");
    console.log(
      "┌" +
        "─".repeat((process.stdout.columns / 2 - " Warning ".length) / 2 - 1) +
        " \x1b[33mWarning\x1b[31m " +
        "─".repeat((process.stdout.columns / 2 - " Warning ".length) / 2 - 1) +
        "┐"
    );
    console.log(
      "│" +
        " ".repeat(
          (process.stdout.columns / 2 -
            ` Error: ${validArgs().value} `.length) /
            2 -
            1
        ) +
        ` Error: ${validArgs().value} ` +
        " ".repeat(
          (process.stdout.columns / 2 -
            ` Error: ${validArgs().value} `.length) /
            2 -
            1
        ) +
        "│"
    );
    console.log("│" + " ".repeat(process.stdout.columns / 2 - 3) + "│");
    console.log(
      "│" +
        " \x1b[32mShow commands: \x1b[0msmc --help\x1b[1;31m" +
        " ".repeat(
          process.stdout.columns / 2 -
            " Show commands: smc --help".length -
            "Scriptmc version: 1.0.4 ".length -
            3
        ) +
        "\x1b[34mScriptmc version: \x1b[0m1.0.4\x1b[1;31m " +
        "│"
    );
    console.log("└" + "─".repeat(process.stdout.columns / 2 - 3) + "┘");
    console.log("\x1b[0m");
  } else {
    console.log("\x1b[1;31m");
    console.log(
      "┌" +
        "─".repeat((process.stdout.columns / 2 - " Warning ".length) / 2 - 1) +
        " \x1b[33mWarning\x1b[31m " +
        "─".repeat((process.stdout.columns / 2 - " Warning ".length) / 2 - 1) +
        "┐"
    );
    console.log(
      "│" +
        " ".repeat(
          (process.stdout.columns / 2 -
            ` Error: Argument length exceeded limit. `.length) /
            2 -
            2
        ) +
        ` Error: Argument length exceeded limit. ` +
        " ".repeat(
          (process.stdout.columns / 2 -
            ` Error: Argument length exceeded limit. `.length) /
            2 -
            1
        ) +
        "│"
    );
    console.log("│" + " ".repeat(process.stdout.columns / 2 - 3) + "│");
    console.log(
      "│" +
        " \x1b[32mShow commands: \x1b[0msmc --help\x1b[1;31m" +
        " ".repeat(
          process.stdout.columns / 2 -
            " Show commands: smc --help".length -
            "Scriptmc version: 1.0.4 ".length -
            3
        ) +
        "\x1b[34mScriptmc version: \x1b[0m1.0.4\x1b[1;31m " +
        "│"
    );
    console.log("└" + "─".repeat(process.stdout.columns / 2 - 3) + "┘");
    console.log("\x1b[0m");
  }
}

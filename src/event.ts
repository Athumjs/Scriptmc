import colors from "yoctocolors-cjs";

export function event(event: "sucess" | "error", value: string): void {
  if (event === "error") {
    console.log(
      `${colors.yellow(colors.bold(" Error –→ "))} ${colors.red(
        colors.bold(value)
      )}`
    );
    console.log(
      `${colors.cyan(colors.italic("  smc --help"))} ${colors.blue(
        colors.bold(" ←– Show commands list")
      )}`
    );
    process.exit(0);
  } else {
    console.log(
      `${colors.yellow(colors.bold(" Sucess –→ "))} ${colors.green(
        colors.bold(value)
      )}`
    );
    process.exit(1);
  }
}

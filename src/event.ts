import colors from "yoctocolors-cjs";

export function event(event: "sucess" | "error", value: string): void {
  if (event === "error") {
    console.log(
      `${colors.yellow(colors.bold(" Error -→ "))} ${colors.red(
        colors.bold(value)
      )}`
    );
  } else {
    console.log(
      `${colors.yellow(colors.bold(" Sucess -→ "))} ${colors.green(
        colors.bold(value)
      )}`
    );
  }
}

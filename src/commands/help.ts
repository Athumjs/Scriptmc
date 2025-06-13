export function message_help(): void {
  console.log("\x1b[1;33m");
  console.log(" " + " ".repeat(10) + "┌ Commands list ┐");
  console.log("\x1b[1;34m");
  console.log(" →" + " help (-h) - show commands list.");
  console.log(" →" + " version (-v) - show scriptmc version.");
  console.log(" →" + " new (-n) - create new addon.");
  console.log(" →" + " build (-b) - build addon.");
  console.log(" →" + " delete (-d) - delete a addon.");
  console.log(" →" + " path (-p) - change minecraft folder path.");
  console.log("\x1b[0m");
}

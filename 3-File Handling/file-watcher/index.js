import * as fs from "node:fs/promises";

async function watch(file) {
  const watcher = fs.watch(file);
  for await (const event of watcher) {
    if (event.eventType === "change") {
      console.log("The file was changed.");
    }
  }
}
watch("./command.txt");

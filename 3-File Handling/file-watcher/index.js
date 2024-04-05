import * as fs from "node:fs/promises";
import { Buffer } from "node:buffer";

async function watch(path) {
  const fileWrapper = await fs.open(path);

  const watcher = fs.watch(path);

  for await (const event of watcher) {
    if (event.eventType === "change") {
      // The file was changed
      console.log("The file was changed.");

      // Set up config variables.
      const { size } = await fileWrapper.stat();
      const buffer = Buffer.alloc(size);
      const offset = 0;
      const pos = 0;
      const length = size;

      // Read file
      const fileContent = await fileWrapper.read(buffer, offset, length, pos);
      console.log(fileContent);
    }
  }
}

watch("./command.txt");

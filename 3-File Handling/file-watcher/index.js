import * as fs from "node:fs/promises";
import { EventEmitter } from "node:events";
import { Buffer } from "node:buffer";

const emitter = new EventEmitter();

emitter.on("change", async (fileWrapper) => {
  // Set up config variables.
  const { size } = await fileWrapper.stat();
  const buffer = Buffer.alloc(size);
  const offset = 0;
  const pos = 0;
  const length = size;

  // Read file
  const { buffer: fileBuffer } = await fileWrapper.read(
    buffer,
    offset,
    length,
    pos
  );

  // Decode the buffer
  const fileContent = fileBuffer.toString("utf-8");
  console.log(fileContent);
});

async function watch(path) {
  const fileWrapper = await fs.open(path);

  const watcher = fs.watch(path);

  for await (const event of watcher) {
    if (event.eventType === "change") {
      // Emit change event
      emitter.emit("change", fileWrapper);
    }
  }
}

watch("./command.txt");

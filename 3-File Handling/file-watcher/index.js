import * as fs from "node:fs/promises";
import { EventEmitter } from "node:events";
import { Buffer } from "node:buffer";

import { getCommandData } from "./utils/get-command-data.js";

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
  const { method, file, payload } = getCommandData(fileContent);

  if (
    method !== "create" &&
    method !== "add" &&
    method !== "rename" &&
    method !== "delete"
  )
    emitter.emit("error", method);
  else emitter.emit(method, file, payload);
});

emitter.on("create", async (file, payload) => {
  console.log("Created a file");
});

emitter.on("delete", async (file, payload) => {
  console.log("Deleted a file");
});

emitter.on("add", async (file, payload) => {
  console.log("Appended to a file");
});

emitter.on("rename", async (file, payload) => {
  console.log("Renamed a file");
});

emitter.on("error", async () => {
  console.log("Caught an error");
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

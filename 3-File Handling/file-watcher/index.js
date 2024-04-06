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

emitter.on("create", async (filepath, payload) => {
  let fileInfo;
  try {
    fileInfo = await fs.open(filepath, "ax");
    console.log("File created successfully.");
  } catch (e) {
    console.log("The file already exists.");
  } finally {
    if (fileInfo) await fileInfo.close();
  }
});

emitter.on("delete", async (filepath, payload) => {
  try {
    await fs.unlink(filepath);
    console.log("File deleted successfully");
  } catch (e) {
    console.log("Unable to delete the file as file does not exist.");
  }
});

emitter.on("add", async (filepath, payload) => {
  console.log("Appended to a file");
});

emitter.on("rename", async (filepath, payload) => {
  let payloadExists = true;
  try {
    await fs.access(payload);
  } catch (e) {
    payloadExists = false;
  }
  if (!payloadExists) {
    try {
      await fs.rename(filepath, payload);
      console.log("File renamed successfully");
    } catch (e) {
      console.log("Unable to rename.");
    }
  } else console.log("A file already exists with the same name.");
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

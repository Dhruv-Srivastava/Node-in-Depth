import * as fs from "node:fs/promises";
import { Buffer } from "node:buffer";
import { writeUsingStreamsEfficient } from "../background/index.js";
import { write } from "node:fs";

// Create a large file
// writeUsingStreamsEfficient("../read-streams/src.txt",10_000_000)

async function readUsingStreams(readFilePath, writeFilePath) {
  let readFileHandler, writeFileHandler;
  console.time("duration");

  try {
    readFileHandler = await fs.open(readFilePath, "r");
    writeFileHandler = await fs.open(writeFilePath, "w+");
    const readStream = readFileHandler.createReadStream();
    const writeStream = writeFileHandler.createWriteStream();

    readStream.on("data", (chunk) => {
      if (!writeStream.write(chunk)) readStream.pause();
    });

    writeStream.on("drain", () => {
      readStream.resume();
    });

    writeStream.on("finish", async () => {
      if (readFileHandler) await readFileHandler.close();

      if (writeFileHandler) await writeFileHandler.close();

      console.timeEnd("duration");
    });
  } catch (e) {
    console.log("Some error occured!");
  }
}

readUsingStreams("./src.txt", "./dest.txt");

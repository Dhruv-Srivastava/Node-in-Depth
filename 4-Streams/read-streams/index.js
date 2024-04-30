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

    readStream.on("end", async () => {
      if (readFileHandler) await readFileHandler.close();

      if (writeFileHandler) await writeFileHandler.close();

      console.log("Hello!");

      console.timeEnd("duration");
    });
  } catch (e) {
    console.log("Some error occured!");
  }
}

// Create a large file
// writeUsingStreamsEfficient("../read-streams/new-src.txt", 100_000)
async function readAndWriteEven(readFilePath, writeFilePath) {
  let readFileHandler, writeFileHandler;
  console.time("duration");

  try {
    readFileHandler = await fs.open(readFilePath, "r");
    writeFileHandler = await fs.open(writeFilePath, "w+");

    const readStream = readFileHandler.createReadStream();
    const writeStream = writeFileHandler.createWriteStream();
    
    let adjustment = "";

    readStream.on("data", (chunk) => {
      const numbers = chunk.toString("utf-8").split("\n");

      const n = numbers.length;
      // TODO: Santiize the data. Some data is missing.
      if (Number(numbers[0]) + 1 !== Number(numbers[1]))
        numbers[0] = adjustment + numbers[0];

      if (Number(numbers[n - 1]) !== Number(numbers[n - 2]) + 1)
        adjustment = numbers.pop();

      const evenNumbers = numbers.filter(number => Number(number)%2===0)
      evenNumbers.forEach(num=>{
        if(!writeStream.write(num+"\n"))
          readStream.pause()
      })
    });

    readStream.on("end", async () => {
      console.timeEnd("duration");

      await readFileHandler.close();
      await writeFileHandler.close();
    });

    writeStream.on("drain",()=>{
      readStream.resume()
    })
  } catch (e) {
    console.log("Unable to process right now.");
  }
}
readAndWriteEven("./new-src.txt", "./dest-even.txt");

// readUsingStreams("./src.txt", "./dest.txt");

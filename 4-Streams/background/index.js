import * as fsPromise from "node:fs/promises";
import * as fsCallback from "node:fs";
import { Buffer } from "node:buffer";

// This code took 1m7s to run, 40ish MB in the memory and 34% of the CPU
async function writeUsingPromise(filepath) {
  console.time("duration");
  let fileHandler;
  try {
    fileHandler = await fsPromise.open(filepath, "a");
    for (let i = 1; i <= 1000_000; i++) {
      await fileHandler.appendFile(i + "\n");
    }
  } catch (e) {
    console.log("Unable to open the file");
  } finally {
    if (fileHandler) await fileHandler.close();
    console.timeEnd("duration");
  }
}

// This code took 8.5s to run, 25ish MB in the memory and 25% of the CPU
function writeUsingCallback(filepath) {
  console.time("duration");
  fsCallback.open(filepath, "w", (err, fd) => {
    if (err) {
      console.log("Unable to write to file.");
      return;
    }
    for (let i = 1; i <= 1000_000; i++) {
      fsCallback.writeSync(fd, i + "\n");
    }
    console.timeEnd("duration");
  });
}

// This code took 1.1ish to run, 250ish MB in the memory and 22% of the CPU
// This is a naive implementation which is not so memory efficient.
async function writeUsingStreams(filepath) {
  let fileHandler;
  console.time("duration");
  try {
    fileHandler = await fsPromise.open(filepath, "w");
    const writeStream = fileHandler.createWriteStream();
    for (let i = 1; i <= 1000_000; i++) {
      writeStream.write(i + "\n");
    }
  } catch (e) {
    console.log("Unable to write to file.");
  } finally {
    if (fileHandler) fileHandler.close();

    console.timeEnd("duration");
  }
}

// This code took 6.1ish to run, 26ish MB in the memory and 26% of the CPU
export async function writeUsingStreamsEfficient(filepath, numOfWrites) {
  let fileHandler;
  console.time("duration");
  let start = 1;
  try {
    fileHandler = await fsPromise.open(filepath, "w");
    const writeStream = fileHandler.createWriteStream();

    function writeToStream(toWriteFrom) {
      for (let i = toWriteFrom; i <= numOfWrites; i++) {
        const myBuffer = Buffer.from(i + "\n");
        const canWrite = writeStream.write(myBuffer);
        start = i + 1;
        if(i === numOfWrites) writeStream.end()
        if (!canWrite) break;
      }
    }

    writeToStream(start);

    writeStream.on("drain", () => {
      writeToStream(start);
    });

    writeStream.on("finish",async ()=>{
      await fileHandler.close()
      console.timeEnd("duration")
    })

  } catch (e) {
    console.log("Unable to write to file.");
  } 
}

// writeUsingPromise("./test.txt");
// writeUsingCallback("./test.txt");
// writeUsingStreams("./test.txt")
// writeUsingStreamsEfficient("./test.txt", 1_000_000);

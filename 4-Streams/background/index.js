import * as fsPromise from "node:fs/promises";
import * as fsCallback from "node:fs";

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

// This code took 8.5s to run, 25ish MB in the memory and 2% of the CPU
function writeUsingCallback(filepath) {
  console.time("duration");
  fsCallback.open(filepath, "w", (err, fd) => {
    if (err) {
      console.log("Unable to write to file.");
      return;
    }
    for (let i = 1; i <= 1000_000; i++) {
      fsCallback.writeSync(fd,i + "\n");
    }
    console.timeEnd("duration")
  });
}

// writeUsingPromise("./test.txt");
// writeUsingCallback("./test.txt");

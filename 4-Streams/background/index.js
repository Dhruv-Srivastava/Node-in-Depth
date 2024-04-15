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

// This code took 8.5s to run, 25ish MB in the memory and 25% of the CPU
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


// This code took 1.1ish to run, 250ish MB in the memory and 22% of the 
// This is a naive implementation which is not so memory efficient.
async function writeUsingStreams(filepath){
  let fileHandler;
  console.time("duration")
  try{
    fileHandler = await fsPromise.open(filepath,"w");
    const writeStream = fileHandler.createWriteStream()
    for(let i = 1; i<=1000_000; i++){
        await writeStream.write(i+"\n")
    }
  }catch(e){
    console.log("Unable to write to file.")
  }finally{
    if(fileHandler)
      fileHandler.close()

    console.timeEnd("duration")
  }
}

// writeUsingPromise("./test.txt");
// writeUsingCallback("./test.txt");
// writeUsingStreams("./test.txt")


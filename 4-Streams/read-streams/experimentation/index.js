import { read } from "fs";
import * as fs from "fs/promises";

async function copyWithoutStreamsEfficient(src, dest) {
  let readFileHandle, writeFileHandle;
  console.time("duration")
  try {
    readFileHandle = await fs.open(src, "r");
    writeFileHandle = await fs.open(dest, "w");

    const srcSize = (await readFileHandle.stat()).size;
    let totalBytesRead = 0;

    while (true) {
      if (totalBytesRead >= srcSize) break;
      const lengthToRead = Math.min(16*1024, srcSize-totalBytesRead)
      const { bytesRead, buffer } = await readFileHandle.read({length:lengthToRead});
      totalBytesRead += bytesRead;
      await writeFileHandle.appendFile(buffer.slice(0, bytesRead));
    }
  } catch (e) {
    console.log(e)
    console.log("Sorry, something went wrong");
  }finally{
    console.timeEnd("duration")
    if(readFileHandle) await readFileHandle.close()
    if(writeFileHandle) await writeFileHandle.close()
  }
}

copyWithoutStreamsEfficient("./src.txt", "./dest.txt");

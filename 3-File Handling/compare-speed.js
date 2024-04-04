import * as fsPromise from "node:fs/promises"
import * as fs from "node:fs";


async function readUsingPromise(filename){
    try{
        const now = Date.now()
        const file = await fsPromise.readFile(filename)
        console.log(file.toString("utf-8"))
        console.log(Date.now() - now) // 12
    }catch(e){
        console.log(e)
        process.exit(1)
    }
}

readUsingPromise("notes.txt")

async function readUsingCallback(filename){
    const now = Date.now()
    fs.readFile(filename,(e,data)=>{
        if(e){
            console.log(e)
            process.exit(1);
        }
        console.log(data.toString("utf-8"))
        console.log(Date.now() - now)
    })
}

readUsingCallback("notes.txt")

function readFileSynchronously(filename){
    try{
        const now = Date.now()
        const file = fs.readFileSync(filename)
        console.log(file.toString("utf-8"))
        console.log(Date.now() - now)
    }catch(e){
        console.log(e)
        process.exit(1)
    }
}

readFileSynchronously("notes.txt")



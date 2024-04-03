import {EventEmitter} from "node:events"

const emitter = new EventEmitter()

// Subscriber
emitter.on("run",()=>{
    console.log("Subscriber 1 of run event")
})

emitter.on("run",()=>{
    console.log("Subscriber 2 of run event")
})

emitter.once("run",()=>{
    console.log("Subscriber 3 of run event")
})


// Publisher
emitter.emit("run")
emitter.emit("run")
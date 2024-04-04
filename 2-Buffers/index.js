import {Buffer} from "node:buffer"

const myBuffer1 = Buffer.alloc(4) // Create a buffer of 4 bytes in memory and fill all bits with zero

myBuffer1[0] = 0xFF;
myBuffer1[1] = 0x1D;
myBuffer1[2] = 22;
myBuffer1[3] = 33;


for(const element of myBuffer1)
    console.log(element)

myBuffer1.fill("cat")

console.log(myBuffer1[0].toString(2))
console.log(myBuffer1[1].toString(2))
console.log(myBuffer1[2].toString(2))
console.log(myBuffer1[3].toString(2))


const myBuffer2 = Buffer.from([0x11,0xff])

console.log(myBuffer2)

const myBuffer3 = Buffer.from("🍊 🍎")

console.log(myBuffer3)


function bufferInBinary(buffer){
    return Object.values(buffer).map(element=>element.toString(2)).join(" ")
}

console.log(bufferInBinary(myBuffer1))



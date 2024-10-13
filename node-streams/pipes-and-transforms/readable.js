const fs = require('fs')

// readable stream
const readable = fs.createReadStream('./file.txt', 
    { highWaterMark: 20 } // buffer size, e.g. 20 bytes at a time
)

let chunkCount = 0

// receive chunk from the buffer
// buffer is binary so have to convert to string
readable.on("data", chunk => {
    if (chunkCount === 2) {
        readable.pause()
        console.log("...hold up, pause the stream...\n")
        setTimeout(() => {
            readable.resume()
        }, 3000)
    }

    console.log("New chunk: ", chunk.length, chunk.toString())
    chunkCount++
})

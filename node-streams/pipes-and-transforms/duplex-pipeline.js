const fs = require('fs')
const { Transform, pipeline } = require('stream')

const readable = fs.createReadStream('file.txt', {
    highWaterMark: 20
})
const writable = fs.createWriteStream('out3.txt')

const uppercase = new Transform({
    transform(chunk, encoding, callback) {
        // callback for operation we want to do
        callback(null, chunk.toString().toUpperCase())
    }
})

// read from stream, transform it, then write it as a stream
// readable.pipe(uppercase).pipe(writable)

pipeline(readable, uppercase, writable, (error) => {
    if (error) {
        console.error(error)
    }
})
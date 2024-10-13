// node video upload using streams

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const CHUNK_SIZE = 10 * 1024 * 1024 // 10MB

app.post('/upload', (req, res) => {
    const fileName = Data.now() + '.mp4'
    const filePath = path.join(__dirname, 'uploads', fileName)

    const writeStream = fs.createWriteStream(filePath)
    
    let bytesReceived = 0
    
    // with streams, we don't know/care how big the file is
    // we just take it a chunk at a time until it we stop receiving
    req.on('data', chunk => {
        bytesReceived += chunk.length

        // write chunk to writeStream 10MB at a time
        if (chunk.length > CHUNK_SIZE) {
            console.log(`Received chunk ${chunk.length / (1024 * 1024)} MB`)

            // e.g. 105MB / 10MB = 11 chunks
            const chunksToWrite = Math.ceil(chunk.length / CHUNK_SIZE)

            // e.g. 0 to 9
            for (let i=0; i < chunksToWrite; i++) {
                // 0 -> 10MB; (10MB + 1 byte) -> 20MB; 
                // .... (100MB + 1 byte) -> 105MB
                const start = i * CHUNK_SIZE
                const end = Math.min(start + CHUNK_SIZE, chunk.length)
                const partialChunk = chunk.slice(start, end)

                writeStream.write(partialChunk)
            }
        } else {
            // if input file 10MB or less, write directly
            writeStream.write(chunk)
        }

        console.log(`Total bytes received: ${(bytesReceived / (1024 * 1024)).toFixed(2)} MB`)
    })

    // handle errors
    req.on('error', (err) => {
        console.error('Error receiving files: ', err)
        res.status(500).send('Error uploading file')
    })

    writeStream.on('error', err=> {
        console.error('Error writing file: ', err)
        res.status(500).send('Error saving file')
    })
})

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads')
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})



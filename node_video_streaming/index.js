const express = require('express')
const app = express()
const fs = require('fs')

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/video", (req, res) => {
    // send a range of the video

    const range = req.headers.range

    if (!range) {
        res.status(400).send("Requires Range header")
    }

    const videoPath = "bigbuck.mp4"
    const videoSize = fs.statSync(videoPath).size

    // parse range
    // e.g. "bytes=32324-"

    const CHUNK_SIZE = 10**6 // 1MB
    // take number out of range
    const start = Number(range.replace(/\D/g, ""))
    // get range, but if out of range, return entire video
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

     const contentLength = end - start + 1
     const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Content-Length": contentLength,
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4"
     }

     res.writeHead(206, headers)

     // stream video, pipe to response
     const videoStream = fs.createReadStream(videoPath, { start, end })
     videoStream.pipe(res)
})

app.listen(8000, () => {
    console.log("Listening on port 8000!")
})
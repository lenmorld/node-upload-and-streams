const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

const PORT = 3000

// store file in memory for streaming
// good for small to medium file sizes, limited by memory
const memStorage = multer.memoryStorage()
const memUpload = multer({ storage: memStorage })

// with diskStorage, file will stream directly to the disk
// as it's being uploaded
// more efficient for large files
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const newFileName = `${Date.now()}-${file.originalname}`
        cb(null, newFileName)
    }
})
const diskUpload = multer({ storage: diskStorage })


app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

// app.post('/upload', memUpload.single('video'), (req, res) => {
    // --- memory, no streams, regular writeFileSync ---
    // works for files less than 2GB which is Node's max buffer size
    // const fileBuffer = req.file.buffer;
    // const filePath = path.join(__dirname, 'uploads', `${Date.now()}-${req.file.originalname}`);
    // fs.writeFileSync(filePath, fileBuffer); 

    // res.status(200).send('File uploaded successfully and stored in memory.');

    // --- using memory + stream ---
    // still won't work for files more than 2GB
    // memory storage always uses memory as a buffer
    // but max buffer size is 2GB on Node
    // Multer stores the file in memory, 
    // so we need to write the buffer to disk
    // using a writeable stream
    
    // const fileStream = req.file.buffer  
    // const filePath = path.join(__dirname, 'uploads', `${Date.now()}-${req.file.originalname}`)
    // const writeStream = fs.createWriteStream(filePath)

    // // writeable stream to store video
    // writeStream.write(fileStream)

    // // end stream after video fully uploaded
    // writeStream.end()

    // writeStream.on('finish', () => {
    //     res.status(200).send('File uploaded successfully')
    // })

    // writeStream.on('error', (err) => {
    //     console.error('Error writing file:', err)
    //     res.status(500).send('Error uploading file')
    // })
    // -----------------------------
// })


app.post('/upload', diskUpload.single('video'), (req, res) => {
    // ---- using diskStorage ----
    // file directly written to disk
    // multer manages the stream internally

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Multer has already stored the file on disk by this point
    // const filePath = req.file.path; // Path to the file stored on disk

    res.status(200).send('File uploaded successfully')  
    // -----------------------------
})

// chunked upload
// temporarily store 10MB chunks in memory
// then append to file using a stream (don't keep entire file in memory)
app.post('/upload-chunk', memUpload.single('chunk'), (req, res) => {
    console.log("YESH!")
    const { originalname, chunkIndex, totalChunks } = req.body
    const filePath = path.join(__dirname, 'uploads', originalname)

    if (!req.file || !originalname || !chunkIndex || !totalChunks) {
        return res.status(400).send('Invalid request')
    }

    // stream to file in append mode
    const writeStream = fs.createWriteStream(filePath, { flags: 'a' })

    console.log("chunk req.file.size: ", req.file.size)
    console.log("chunk req.file.buffer.length: ", req.file.buffer.length)

    writeStream.write(req.file.buffer)

    writeStream.end(() => {
        console.log(`Chunk ${chunkIndex} of ${totalChunks} uploaded`)

        // form data is string, need to parse
        if (parseInt(chunkIndex) + 1 === parseInt(totalChunks)) {
            console.log(`All chunks uploaded successfully`)
            res.status(200).send('File uploaded successfully');
        } else {
            res.status(200).send(`Chunk ${chunkIndex} uploaded`)
        }
    })

    writeStream.on('error', (err) => {
        console.error('Error writing chunk: ', err)
        res.status(500).send('Error writing chunk')
    })
})

// create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
}

app.listen(PORT, () => {
    console.log("Server started on http://localhost:3000")
});

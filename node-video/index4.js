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

// create uploads folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'))
}

app.listen(PORT, () => {
    console.log("Server started on http://localhost:3000")
});
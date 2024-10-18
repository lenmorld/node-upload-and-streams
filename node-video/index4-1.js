const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

const PORT = 3000

// store file in memory for streaming
// good for small to medium file sizes, limited by memory
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index2.html'));
})

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // ---- using streams ---
    // multer file buffer
    // const fileStream = req.file.buffer  

    // const filePath = path.join(__dirname, 'uploads', `${Date.now()}-${req.file.originalname}`)

    // const writeStream = fs.createWriteStream(filePath)

    // // writeable stream to store video
    // writeStream.write(fileStream)

    // // end stream after video fully uploaded
    // writeStream.end()

    // writeStream.on('finish', () => {})
    // res.status(200).send('File uploaded successfully')

    // writeStream.on('error', (err) => {
    //     console.error('Error writing file:', err)
    //     res.status(500).send('Error uploading file')
    // })
    // -----------------

    // --- no streams, regular writeFileSync ---
    const fileBuffer = req.file.buffer;
    const filePath = path.join(__dirname, 'uploads', `${Date.now()}-${req.file.originalname}`);
    fs.writeFileSync(filePath, fileBuffer); 

    res.status(200).send('File uploaded successfully and stored in memory.');
})

// create uploads folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'))
}

app.listen(PORT, () => {
    console.log("Server started on http://localhost:3000")
});
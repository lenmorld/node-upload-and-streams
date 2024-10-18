const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'))

// Ensure 'uploads' folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

// Route to handle chunked video upload
app.post('/upload', (req, res) => {
  let fileName = 'bigfile.mp4'; // We'll append all chunks to this file
  const filePath = path.join(__dirname, 'uploads', fileName);

  const writeStream = fs.createWriteStream(filePath, { flags: 'a' }); // 'a' to append to file

  let bytesReceived = 0;

  req.on('data', (chunk) => {
    bytesReceived += chunk.length;
    console.log(`Received chunk of size: ${chunk.length / (1024 * 1024)} MB`);

    writeStream.write(chunk); // Write incoming chunk to the file

});

req.on('end', () => {
    writeStream.end();
    console.log(`Total bytes received: ${(bytesReceived / (1024 * 1024)).toFixed(2)} MB`);
    res.status(200).send('Chunk received and written successfully');
  });

  req.on('error', (err) => {
    console.error('Error during chunk upload:', err);
    res.status(500).send('Error during chunk upload');
  });
});

app.listen(PORT, () => {
  console.log(`Server3 is running on http://localhost:${PORT}`);
});

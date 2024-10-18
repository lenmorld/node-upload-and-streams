const express = require('express');
const { PassThrough } = require('stream')
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Set a limit of 10MB chunks
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

// Route to handle video upload
app.post('/upload', (req, res) => {
  const fileName = Date.now() + '.mp4';
//   const fileName = Date.now() + '.mov';
  const filePath = path.join(__dirname, 'uploads', fileName);

  // Create write stream to store the video file
  const writeStream = fs.createWriteStream(filePath);

  let bytesReceived = 0;

  req.on('data', (chunk) => {
    bytesReceived += chunk.length;

    console.log(`Received chunk of size: ${chunk.length} > ${CHUNK_SIZE}  ${chunk.length / (1024 * 1024)} MB`);
    
    // Write the chunk to the writeStream (process 10MB at a time)
    if (chunk.length > CHUNK_SIZE) {
      console.log(`Received chunk of size: ${chunk.length / (1024 * 1024)} MB`);
      const chunksToWrite = Math.ceil(chunk.length / CHUNK_SIZE);
      
      for (let i = 0; i < chunksToWrite; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, chunk.length);
        const partialChunk = chunk.slice(start, end);
        
        writeStream.write(partialChunk);
      }
    } else {
      writeStream.write(chunk);
    }
    
    console.log(`Total bytes received: ${(bytesReceived / (1024 * 1024)).toFixed(2)} MB`);
  });

  // Handle when the upload is complete
  req.on('end', () => {
    writeStream.end(); // Close the write stream
    console.log('File upload complete');
    res.send(`File uploaded successfully as ${fileName}`);
  });

  // Handle errors during the upload process
  req.on('error', (err) => {
    console.error('Error receiving file:', err);
    res.status(500).send('Error uploading file');
  });

  writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
    res.status(500).send('Error saving file');
  });
});

// Ensure 'uploads' folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

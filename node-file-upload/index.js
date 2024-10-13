const path = require('path')
const express = require('express')
const app = express()

const multer = require('multer')

// NOTE: this must match the key submitted from HTML form or JS fetch
const MULTER_FILE_KEY = 'file'
const MULTER_VIDEO_KEY = 'video'

// TODO: another option is to use multer.memoryStorage
// which we can use as a buffer to upload somewhere
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        console.log("Multer storage -> file: ", file)
      /*
      Can use all info from file
      original name, extension, type

      {
        fieldname: 'file',
        originalname: 'duck.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg'
      }
      */

      // unique name
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, file.fieldname + '-' + uniqueSuffix)

      const newFilename = `${Date.now()}-${file.originalname}`
      cb(null, newFilename)
    }
})

// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })


const videoFormatFilter = (req, file, callback) => {
  const fileTypes = /.mp4|.avi|.mkv/
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())

  if (extName) {
    return callback(null, true)
  } else {
    callback("Video upload error: unrecognized extension", false)
    // throw new Error("Video upload error: unrecognized extension")
    // callback(new Error("Video upload error: unrecognized extension"))
  }
}

const uploadVideo = multer({
  storage,
  fileFilter: videoFormatFilter,
  limits: {
    fileSize: 1e8 // limit to 100MB, i.e. 100 000 000
  }
})

app.use(express.static('public'))

app.get('/', (req, res) => {
    // res.send('Hello world')
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/api/upload', upload.single(MULTER_FILE_KEY), (req, res) => {
    console.log("file: ", req.file)
    console.log("body: ", req.body)
    res.json({
      message: "Successfully uploaded files",
      file: req.file
    })
})

app.post('/api/upload-video', uploadVideo.single(MULTER_VIDEO_KEY), (req, res) => {
  console.log("results")
  if (req.file) {
    res.json({
      message: "video uploaded successfully",
      video: req.file
    })
  } else {
    res.status(400).json({
      message: "no video uploaded"
    })
  }
}, (err) => {
  console.log("ERR!")
})

app.listen(3000, () => {
    console.log("listening")
})

curl --location 'http://localhost:3000/api/upload' --data 'file=@"/Users/lenny/Downloads/duck.jpg"'


multer middleware: `upload.single('file')`

`file` is the key of the upload
e.g. key=value
`file=@"/Users/lenny/Downloads/duck.jpg`
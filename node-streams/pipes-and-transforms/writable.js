const fs = require('fs')

const writable = fs.createWriteStream("./out.txt")

writable.write("hello, ")
writable.end("world!")
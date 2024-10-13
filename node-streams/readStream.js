const fs = require('fs')

const readStream = fs.createReadStream('out-stream.csv')

let sum = 0
let unprocessed = ''

// can change chunk size here
readStream.on('data', chunk => {
    // take chunk which is a buffer, convert to string
    
    // if unprocessed defined, that is an incomplete row from previous chunk
    // concatenate here to get full row
    let chunkString = unprocessed + chunk.toString()
    unprocessed = ''

    // loop over the chunk string
    // to see where the \n 
    let startIndex = 0
    for (let i = startIndex; i < chunkString.length; i++) {
        if (chunkString[i] === '\n') {
            const line = chunkString.slice(startIndex, i)
            // split line to get CSV parts
            const comma = line.indexOf(',')
            const cost = line.slice(comma + 1)
            sum += parseFloat(cost)
            // go to next line
            startIndex = i + 1
        }
    }

    // the chunk may not be a complete row
    // i.e. if last char is not a new line
    // keep them in unprocessed, so we can concatenate to chunkString above
    // on next chunk
    if (chunkString[chunkString.length - 1] !== '\n') {
        unprocessed = chunkString.slice(startIndex)
    }
})

readStream.on('end', () => {
    console.log('sum', sum)
})
const fs = require('fs')

const file = fs.readFileSync('out-stream.csv', 'utf-8')

const lines = file.trim('\n').split('\n')
// remove header row
lines.shift()

const sum = lines.reduce((acc, line) => {
    return acc + parseFloat(line.split(',')[1])
}, 0)

console.log('sum', sum)

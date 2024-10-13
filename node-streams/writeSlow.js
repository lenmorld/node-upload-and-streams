const fs = require('fs')

const data = ['name,cost']

// 100 000 000  -> 1GB
for (let i = 0; i < 1e8; i++) {
    data.push(`${i},1`)
}

// CRASHES AFTER A FEW MINUTES
// FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
fs.writeFileSync('out.csv', data.join('\n'))

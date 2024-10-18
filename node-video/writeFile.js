const fs = require('fs');

(async () => {
        const writeStream = fs.createWriteStream('out2GB.csv')

        // 100 000 000  -> 1GB
        for (let i = 0; i < 2e8; i++) {
            // returns true if not full yet, i.e. you can keep on writing
            // false if full, i.e. cannot write until 'drained', 
            // i.e. wait until Node flushes the buffer, or writes all that to the file
            const overWatermark = writeStream.write(`${i},1\n`)

            // if buffer full, pause writing
            // wait for it to drain, then resume writing
            if (!overWatermark) {
                await new Promise(resolve => {
                    writeStream.once('drain', resolve)
                })
            }
        }
    }
)()

// 2GB took 
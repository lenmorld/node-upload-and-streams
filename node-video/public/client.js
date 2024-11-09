
// chunkSize in bytes
const uploadChunks = async (file, chunkSize) => {
    // e.g. 1GB file upload 10MB chunks at a time
    
    // split file into chunks based on chunkSize
    // 1GB / 10MB = 102.4 -> 103 chunks
    const totalChunks = Math.ceil(file.size / chunkSize)

    console.time("upload")

    console.log(`Uploading file with size ${file.size} ${totalChunks} chunks`)

    const uniqueFilename = `${Date.now()}-${file.name}`
    // debugger

    // 0-> 102 chunks
    for (let i = 0; i < totalChunks; i++) {
        // chunk 0: 0               -> 10 485 759 (10MB - 1 byte) 
        // chunk 1: 10485760(10MB)  -> 20MB - 1 byte
        // ...
        // chunk 102: 0.4MB leftover (419430.4)
        
        // debugger
        const start = i * chunkSize
        const end = Math.min(
            start + chunkSize, 
            file.size // if leftover smaller than chunkSize
        )

        // slice excludes end index
        // File becomes a Blob after slicing
        const chunk = file.slice(start, end)

        const formData = new FormData()
        formData.append('chunk', chunk)
        // formData.append('originalname', file.name)
        formData.append('originalname', uniqueFilename)
        // pass range to server
        formData.append('chunkIndex', i)
        formData.append('totalChunks', totalChunks)

        const response = await fetch('/upload-chunk', {
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            console.log(`Chunk ${i + 1} of ${totalChunks} uploaded successfully with size ${chunkSize}`)
        } else {
            console.error(`Error uploading chunk ${i + 1}`)
        }
    }
}

// uploadChunks()

// 1MB = 1024 * 1024 = 1 048 576
// 10MB = 10 485 760

// document.querySelector('#video2').addEventListener('change',
document.querySelector('#uploadChunks').addEventListener('submit', 
    async (event) => {
        // get file from the upload
        // debugger
        event.preventDefault()

        const file = document.querySelector('#video2').files[0]
        const chunkSize = 10 * (1024 * 1024) // 10MB
        
        // debugger
        await uploadChunks(file, chunkSize)

        console.log("File uploaded successfully")

        console.timeEnd('upload')

        document.body.innerHTML = "File uploaded succefully"
})
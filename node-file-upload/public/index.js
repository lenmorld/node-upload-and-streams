const form = document.querySelector('#form')
const formVideo = document.querySelector('#form-video')

form.addEventListener("submit", (e) => {
    // debugger
    e.preventDefault()

    const file = document.querySelector('#file-input')
    const formData = new FormData() // multipart/form-data

    console.log("files: ", file)

    // files array contains the files
    // can loop through files if `multiple` enabled in input
    // NOTE that this has to match MULTER_FILE_KEY
    formData.append("file", file.files[0])

    fetch("/api/upload", {
        method: 'POST',
        body: formData
    }).then(res => console.log(res))
        .catch(err => console.log("file upload err: ", err))
})

formVideo.addEventListener("submit", (e) => {
    // debugger
    e.preventDefault()
    const video = document.querySelector("#video-input")

    const formData = new FormData()

    // NOTE: must match MULTER_VIDEO_KEY
    formData.append("video", video.files[0])

    fetch("/api/upload-video", {
        method: 'POST',
        body: formData
    }).then(res => console.log(res))
    .catch(err => console.log("video upload err: ", err))
})
const express = require('express')
const request = require('request')

const app = express()

// pipe response to downstream request's response
app.get('/', async (req, res) => {
    const proxy = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    // res.send('hello world')

    // send a response header to request
    res.writeHead(proxy.res.statusCode)
    proxy.res.pipe(res)
})


app.listen(3000, () => {
    console.log("listening")
})
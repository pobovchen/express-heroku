const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/hi', function (req, res) {
  res.send('HI World!')
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
const express = require('express')
require('dotenv').config()

const app = express()
const version = require('../package.json').version

console.log(`\x1b[0;36m EpyTodo API | v${version}\x1b[0;37m`)

app.listen(process.env.PORT)
console.log(`The API is listening on port ${process.env.PORT}`)

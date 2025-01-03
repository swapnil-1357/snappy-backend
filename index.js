require('./db/conn')
require('dotenv').config()


const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/conn')
const cors = require('cors')

const app = express()

const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

const userRouter = require('./router/user-router')
const postsRouter = require('./router/posts-router')


app.use('/api/post', postsRouter)
app.use('/api/user', userRouter)


db().then(() => {
    app.listen(port, () => {
        console.log('server is up and running on port', port)
    })
})


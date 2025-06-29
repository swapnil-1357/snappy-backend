require('./db/conn')
require('dotenv').config()


const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/conn')
const cors = require('cors')
const startCronJobs = require('./utils/cronjobs')


const app = express()

const port = process.env.PORT || 3000


const corsOptions = {
    origin: ['http://localhost:5173','https://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}

app.use(cors(corsOptions))
// app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

const userRouter = require('./router/user-router')
const postsRouter = require('./router/posts-router')
const storyRouter = require('./router/stories-router')


app.use('/api/post', postsRouter)
app.use('/api/user', userRouter)
app.use('/api/story', storyRouter)

// cron jobs started here
startCronJobs()



db().then(() => {
    app.listen(port, () => {
        console.log('server is up and running on port', port)
    })
})


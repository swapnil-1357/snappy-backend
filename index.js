require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db/conn')
const startCronJobs = require('./utils/cronjobs')

const userRouter = require('./router/user-router')
const postsRouter = require('./router/posts-router')
const storyRouter = require('./router/stories-router')

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173', 'https://localhost:5173', 'https://snappy1357.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/post', postsRouter)
app.use('/api/user', userRouter)
app.use('/api/story', storyRouter)

// Only run cron jobs if not testing
if ((process.env.NODE_ENV || 'development') !== 'test') {
    startCronJobs()
}

// Only start server if not being tested
if (require.main === module) {
    const port = process.env.PORT || 3000
    db().then(() => {
        app.listen(port, () => {
            console.log('Server is up and running on port', port)
        })
    })
}

// Export app for Supertest
module.exports = app

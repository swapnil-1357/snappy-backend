require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/conn');
const http = require('http');
const { Server } = require('socket.io');
const startCronJobs = require('./utils/cronjobs');

// Routers
const userRouter = require('./router/user-router');
const postsRouter = require('./router/posts-router');
const storyRouter = require('./router/stories-router');
const notificationRouter = require('./router/notification-router');

const app = express();
const server = http.createServer(app);

// CORS setup
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://localhost:5173',
        'https://snappy1357.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- SOCKET.IO Setup ---
const io = new Server(server, {
    cors: corsOptions
});

const connectedUsers = new Map(); // uid -> socket.id

io.on('connection', (socket) => {
    console.log('🔌 A user connected:', socket.id);

    socket.on('register', (uid) => {
        connectedUsers.set(uid, socket.id);
        console.log(`✅ Registered UID ${uid} with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        for (const [uid, sid] of connectedUsers.entries()) {
            if (sid === socket.id) {
                connectedUsers.delete(uid);
                console.log(`❌ Disconnected user ${uid}`);
                break;
            }
        }
    });
});

// Make io + connectedUsers accessible in controllers
app.set('io', io);
app.set('connectedUsers', connectedUsers);

// API Routes
app.use('/api/post', postsRouter);
app.use('/api/user', userRouter);
app.use('/api/story', storyRouter);
app.use('/api/notifications', notificationRouter);

// Run cron jobs only if not testing
if ((process.env.NODE_ENV || 'development') !== 'test') {
    startCronJobs();
}

// Start server unless being tested
if (require.main === module) {
    const port = process.env.PORT || 3000;
    db().then(() => {
        server.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    });
}

// Export app for testing
module.exports = app;

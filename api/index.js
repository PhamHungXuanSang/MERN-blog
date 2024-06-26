import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import blogRoutes from './routes/blog.route.js';
import searchRoutes from './routes/search.route.js';
import commentRoutes from './routes/comment.route.js';
import transactionRoutes from './routes/transaction.route.js';
import packageRoutes from './routes/package.route.js';
import statisticalRoutes from './routes/statistical.route.js';
import emailRoutes from './routes/email.route.js';
import notificationRoutes from './routes/noti.route.js';
import usersFolderRoutes from './routes/usersFolder.route.js';
import scheduleBlogRoutes from './routes/scheduleBlog.route.js';
import categoryRoutes from './routes/category.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import { jobEveryFiveMinutes } from './services/nodeCron.js';
import path from 'path';

dotenv.config();
mongoose
    .connect(process.env.DATABASE)
    .then(() => {})
    .catch(() => console.log('Mongodb has not been connected'));
const __dirname = path.resolve();
const app = express();
app.use(
    cors({
        origin: 'https://mern-blog-csov.onrender.com',
        credentials: true,
    }),
);
const httpServer = createServer(app);

export let userOnline = new Map();
export const getUser = (userId) => {
    return userOnline.find((user) => user.userId === userId);
};
const addOnlineUser = (userId, socketId) => {
    if (!userOnline.get(userId.toString())) {
        userOnline.set(userId.toString(), socketId);
    }
};
const removeOnlineUser = (userId, socketId) => {
    if (userId != null) {
        userOnline.delete(userId.toString());
    } else {
        userOnline.delete(socketId);
    }
};
export const io = new Server(httpServer, {
    cors: {
        origin: 'https://mern-blog-csov.onrender.com',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    // socket.on('newUserLogin', (userId) => {
    //     addOnlineUser(userId, socket.id);
    //     console.log(userOnline);
    // });

    socket.on('refreshBrower', (userId) => {
        removeOnlineUser(userId, null);
        addOnlineUser(userId, socket.id);
        console.log(userOnline);
        io.emit('getOnlineUsers', [...userOnline.keys()]);
    });

    socket.on('disconnect', () => {
        removeOnlineUser(null, socket.id);
        console.log(userOnline);
        io.emit('getOnlineUsers', [...userOnline.keys()]);
    });

    socket.on('signOut', (userId, socketId = null) => {
        removeOnlineUser(userId, null);
        console.log(userOnline);
        io.emit('getOnlineUsers', [...userOnline.keys()]);
    });
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/statistical', statisticalRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/usersFolder', usersFolderRoutes);
app.use('/api/scheduleBlog', scheduleBlogRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/messages', messageRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// jobAtStartOfHour.start();
jobEveryFiveMinutes.start();

httpServer.listen(3000, () => {
    //console.log('Server is running at port 3000');
});

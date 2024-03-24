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
import emailRoutes from './routes/email.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();
mongoose
    .connect(process.env.DATABASE)
    .then(() => {})
    .catch(() => console.log('Mongodb has not been connected'));
const app = express();
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    }),
);
const httpServer = createServer(app);

export let userOnline = new Map();
export const getUser = (userId) => {
    return userOnline.find((user) => user.userId === userId);
};
const addOnlineUser = (userId, socketId) => {
    // if (
    //     !userOnline.some((user) => {
    //         user.userId === userId;
    //     })
    // ) {
    //     userOnline.push({ userId, socketId });
    // }
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
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('newUserLogin', (userId) => {
        addOnlineUser(userId, socket.id);
        console.log(userOnline);
    });

    //io.emit('testEvent', 'Hello refresh brower bro');

    socket.on('refreshBrower', (userId) => {
        console.log(`Người dùng ${userId} refresh trình duyệt`);
        removeOnlineUser(userId, null);
        addOnlineUser(userId, socket.id);
        console.log(userOnline);
    });

    socket.on('disconnect', () => {
        console.log('Some one disconnect');
        removeOnlineUser(null, socket.id);
        console.log(userOnline);
    });

    socket.on('signOut', (userId, socketId = null) => {
        console.log('Some one sign out');
        removeOnlineUser(userId, null);
        console.log(userOnline);
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
app.use('/api/email', emailRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

httpServer.listen(3000, () => {
    //console.log('Server is running at port 3000');
});

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import blogRoutes from './routes/blog.route.js';
import searchRoutes from './routes/search.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();
mongoose
    .connect(process.env.DATABASE)
    .then
    //() =>
    //console.log('Mongodb connected');
    ()
    .catch(() => console.log('Mongodb has not been connected'));
const app = express();
app.use(
    cors({
        // Một cách tiếp cận khác bạn có thể chấp nhận mọi origin nếu đó là môi trường phát triển
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        // Chấp nhận cookies và credentials từ client
        credentials: true,
    }),
);
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        // Cho phép origin mà client của bạn đang sử dụng để truy cập server
        origin: 'http://localhost:5173',
        // Cấu hình thêm nếu bạn cần các header hoặc phương thức HTTP khác
        methods: ['GET', 'POST'],
    },
});

export const userSockets = new Map();
io.on('connection', (socket) => {
    socket.on('user-login', (userId) => {
        userSockets.set(userId.toString(), socket.id); // Lưu dưới dạng string
        socket.userId = userId.toString(); // Lưu userId vào socket để sử dụng khi disconnect
        console.log(userSockets);
    });

    // socket.on('disconnect', () => {
    //     console.log('Vô disconnect: ');
    //     console.log(userSockets);
    //     if (socket.userId) {
    //         userSockets.delete(socket.userId);
    //         console.log('Đã xóa userId');
    //         console.log(userSockets);
    //     }
    // });

    socket.on('sign-out', (userId) => {
        userSockets.delete(userId.toString());
        console.log(userSockets);
    });
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comment', commentRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

server.listen(3000, () => {
    //console.log('Server is running at port 3000');
});

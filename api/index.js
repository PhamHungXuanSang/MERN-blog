import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import blogRoutes from './routes/blog.route.js';
import searchRoutes from './routes/search.route.js';
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

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    //console.log('Server is running at port 3000');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/search', searchRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

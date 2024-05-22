import { io, userOnline } from '../index.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const authenToken = async (req, res, next) => {
    const userId = req.params.userId || req.body.userId || req.body._id;
    const token = req.cookies.access_token;
    const user = await User.findById(userId).select('-password');
    if (!user) {
        return next(errorHandler(404, 'User not found'));
    }
    if (user.isBlocked) {
        const socketId = userOnline.get(userId.toString());
        if (socketId) {
            io.to(socketId).emit('forcedLogout', 'Forced Logout');
            userOnline.delete(userId.toString());
        }
    }
    
    if (!token) {
        res.clearCookie('access_token');
        userOnline.delete(userId?.toString());
        return next(errorHandler(403, 'No access token provided.'));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { iat, exp, ...rest } = decodedToken;
        req.user = rest;
        return next();
    } catch (err) {
        res.clearCookie('access_token');
        userOnline.delete(userId?.toString());
        return next(errorHandler(403, 'Invalid access token.'));
    }
};

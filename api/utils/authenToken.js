import { userOnline } from '../index.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const authenToken = async (req, res, next) => {
    const userId = req.params.userId || req.body.userId || req.body._id;
    const token = req.cookies.access_token;
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

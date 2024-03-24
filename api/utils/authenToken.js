import RefreshToken from '../models/refreshToken.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const authenToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(403, 'No access token provided.'));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { iat, exp, ...rest } = decodedToken;
        req.user = rest;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            const prevRefreshToken = req.cookies.refresh_token;
            if (!prevRefreshToken) {
                return next(errorHandler(403, 'No refresh token provided.'));
            }

            try {
                const refreshTokenDoc = await RefreshToken.findOne({ refreshToken: prevRefreshToken });
                if (!refreshTokenDoc) {
                    return next(errorHandler(403, 'Refresh token not found in database.'));
                }

                const decodedRefreshToken = jwt.verify(prevRefreshToken, process.env.JWT_REFRESH_SECRET);
                const { iat, exp, ...rest } = decodedRefreshToken;
                const newAccessToken = jwt.sign(rest, process.env.JWT_SECRET, { expiresIn: 1 * 60 });
                const newRefreshToken = jwt.sign(rest, process.env.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 1440 });

                await RefreshToken.deleteOne({ refreshToken: prevRefreshToken });
                await new RefreshToken({ refreshToken: newRefreshToken }).save();

                res.cookie('access_token', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });

                req.user = rest;
                next();
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return next(errorHandler(403, 'Refresh token expired.'));
                } else {
                    return next(errorHandler(403, 'Error while refreshing tokens.'));
                }
            }
        } else {
            return next(errorHandler(403, 'Invalid access token.'));
        }
    }
};

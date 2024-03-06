import RefreshToken from '../models/refreshToken.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const authenToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
        if (err) {
            const prevRefreshToken = req.cookies.refresh_token;

            const refreshToken = await RefreshToken.findOne({ refreshToken: prevRefreshToken });
            if (refreshToken === null) {
                return next(errorHandler(403, 'Not found refresh token in database'));
                //return res.redirect('/');
            }
            await RefreshToken.deleteOne({ refreshToken: prevRefreshToken });

            jwt.verify(prevRefreshToken, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
                if (err) {
                    return next(errorHandler(403, 'Refresh token not accepted'));
                    //return res.redirect('/');
                }
                const { iat, exp, ...rest } = decodedToken;
                const newToken = jwt.sign(rest, process.env.JWT_SECRET, { expiresIn: 1 * 60 });

                //res.cookie('access_token', token, { httpOnly: true });
                const refToken = jwt.sign(rest, process.env.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 1440 });
                const newRefreshToken = new RefreshToken({
                    refreshToken: refToken,
                });
                try {
                    newRefreshToken.save();
                } catch (error) {
                    return next(errorHandler(500, 'Can not save refresh token'));
                }
                //res.cookie('refresh_token', refToken, { httpOnly: true });
                return res.status(201).json({ newToken, refToken });
            });
        } else {
            req.user = userData;
            next();
        }
    });
};

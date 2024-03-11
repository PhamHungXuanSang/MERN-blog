import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.model.js';
import { io, userSockets } from '../index.js';
import { socket } from '../../client/src/utils/socket.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, 'Please enter all fields'));
    }

    // Thêm đoạn kiểm tra nếu username trùng vs csdl thì báo duplicate
    const un = await User.findOne({ username });
    if (un) {
        return next(errorHandler(500, 'Username already exists, please choose another name'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.json('Dang ky thanh cong');
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'Please enter all fields'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'Not found email'));
        }

        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Wrong password'));
        }

        // Authenticate user with jwt
        // Mục đích cũng tương tự như hash password, làm các giá trị đăng nhập không xem được để bảo mật
        // Sau khi encrypt xong thì lưu vào cookies của trình duyệt
        const payload = {
            _id: validUser._id,
            username: validUser.username,
            email: validUser.email,
            isAdmin: validUser.isAdmin,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30s' });

        const { password: secretPassword, ...rest } = validUser._doc; // Tách phần password ra để díu không res trả về để đảm bảo ko lộ password

        res.status(200).cookie('access_token', token).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    // kiem tra neu nguoi dung da ton taji thif ddangw nhaajp vaof co jwt
    // neu chua thif tajo tk mois luu o user va dangw nhaap vao cos jwt
    const { email, username, googleAvatar } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            if (userSockets.get(user._id.toString())) {
                return res.status(400).json({ message: 'Account is in use' });
            }
            const payload = {
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 1 * 60 });
            const refToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 1440 });
            const refreshToken = new RefreshToken({
                refreshToken: refToken,
            });
            try {
                await refreshToken.save();
            } catch (error) {
                next(error);
            }
            res.cookie('refresh_token', refToken);

            const { password: secret, ...rest } = user._doc;
            res.status(200).cookie('access_token', token).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: username.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                userAvatar: googleAvatar,
            });

            try {
                await newUser.save();
                const payload = {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    isAdmin: newUser.isAdmin,
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 1 * 60 });
                const refToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 1440 });
                const refreshToken = new RefreshToken({
                    refreshToken: refToken,
                });
                try {
                    await refreshToken.save();
                } catch (error) {
                    next(error);
                }
                res.cookie('refresh_token', refToken);

                const { password: secret, ...rest } = newUser._doc;
                res.status(200).cookie('access_token', token).json(rest);
            } catch (error) {
                next(error);
            }
        }
    } catch (error) {
        next(error);
    }
};

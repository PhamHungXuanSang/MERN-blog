import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.model.js';
import { userOnline } from '../index.js';
import Transaction from '../models/transaction.model.js';
import { sendEmailServices } from '../services/emailService.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, 'Please enter all fields'));
    }

    const un = await User.findOne({ username });
    if (un) {
        return next(errorHandler(500, 'Username already exists, please choose another'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username: username.split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
    });

    try {
        let user = await newUser.save();
        const transaction = new Transaction({
            userId: user._id,
        });
        const userTransaction = await transaction.save();
        await User.findOneAndUpdate({ _id: user._id }, { $push: { transaction: userTransaction._id } }, { new: true });
        // Mã hóa email để send đế email acc người dùng
        const hashedEmail = bcryptjs.hashSync(user.email, 10);
        sendEmailServices(
            user.email,
            'MERN Blog email verify',
            `<a href="http://localhost:3000/api/email/verify?email=${user.email}&&token=${hashedEmail}">Click here to verify your email</a>`,
        );
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

        if (userOnline.get(validUser._id.toString())) {
            return res.status(400).json({ message: 'Account is in use' });
        }

        // Kiểm tra nếu email chưa được verified thì không cho đăng nhập, báo lỗi email chưa được xác thực
        if (!validUser.emailVerified.verifiedAt) {
            return next(errorHandler(400, 'Email not verified'));
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

        const { password: secret, ...rest } = validUser._doc; // Tách phần password ra để díu không res trả về để đảm bảo ko lộ password

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
            if (userOnline.get(user._id.toString())) {
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
            //const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            //const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            let newUser = new User({
                username: username.split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                //password: hashedPassword,
                userAvatar: googleAvatar,
                emailVerified: { method: 'google', verifiedAt: new Date() },
            });

            try {
                const user = await newUser.save();
                const transaction = new Transaction({
                    userId: user._id,
                });
                const userTransaction = await transaction.save();
                newUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $push: { transaction: userTransaction._id } },
                    { new: true },
                );

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

export const signout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        await RefreshToken.deleteOne({ refreshToken });
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json('User has been signed out');
    } catch (error) {
        next(error);
    }
};

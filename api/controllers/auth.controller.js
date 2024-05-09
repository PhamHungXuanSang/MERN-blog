import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
// import RefreshToken from '../models/refreshToken.model.js';
import { userOnline } from '../index.js';
import Transaction from '../models/transaction.model.js';
import { sendEmailServices } from '../services/emailService.js';
import UsersFolder from '../models/usersFolder.model.js';
import Noti from '../models/noti.model.js';

const validateHuman = async (token) => {
    const secret = process.env.GG_RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
        method: 'POST',
    });
    const data = await response.json();
    return data.success;
};

export const signup = async (req, res, next) => {
    const { username, email, password, token } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, 'Please enter all fields'));
    }

    if (!token || token === '') {
        return next(errorHandler(400, 'Please verify you are not a bot'));
    }

    const human = await validateHuman(token);
    if (!human) {
        return next(errorHandler(400, 'Detect bot actions'));
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
        const userF = new UsersFolder({
            userId: user._id,
        });
        const [userTransaction, userFolder] = await Promise.all([transaction.save(), userF.save()]);
        await User.findOneAndUpdate({ _id: user._id }, { $push: { transaction: userTransaction._id } }, { new: true });
        // Mã hóa email để send đến email acc người dùng
        const hashedEmail = bcryptjs.hashSync(user.email, 10);
        sendEmailServices(
            user.email,
            'MERN Blog email verify',
            `<!DOCTYPE html>
            <html>
            <head>
                <style>
                .email-container {
                    background-color: #f8f8f8;
                    padding: 20px;
                    text-align: center;
                }

                .verify-button {
                    padding: 15px 25px;
                    background-color: #3498db; /* Thay đổi màu nền */
                    color: white; /* Màu chữ */
                    border: none; /* Vô hiệu hóa viền */
                    border-radius: 4px; /* Bán kính viền */
                    text-decoration: none; /* Loại bỏ gạch chân */
                    font-weight: bold; /* Độ đậm của chữ */
                    font-size: 16px; /* Kích thước chữ */
                    transition: all 0.3s ease; /* Hiệu ứng chuyển đổi mượt */
                    cursor: pointer; /* Loại con trỏ */
                    margin-top: 10px; /* Khoảng cách từ đỉnh */
                    display: inline-block; /* Hiển thị nút ngang */
                    box-shadow: 0px 2px 3px #ccc; /* Bóng đổ */
                }

                .verify-button:hover {
                    background-color: #2e86c1; /* Màu nền khi hover */
                    box-shadow: 0px 0px 8px #666; /* Bóng đổ khi hover */
                }

                .email-message {
                    font-size: 18px; /* Kích thước chữ thông điệp */
                }
                </style>
            </head>
            <body>
                <div class="email-container">
                <div class="email-message">
                    <p>Please click the button below to verify your email address.</p>
                </div>
                <!-- Đường dẫn phải là một link thực tế từ server của bạn -->
                <a href="http://localhost:3000/api/email/verify?email=${user.email}&token=${hashedEmail}" class="verify-button">
                    Verify Email
                </a>
                </div>
            </body>
            </html>`,
        );
        res.json('Register success');
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password, token } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'Please enter all fields'));
    }

    if (!token || token === '') {
        return next(errorHandler(400, 'Please verify you are not a bot'));
    }

    const human = await validateHuman(token);
    if (!human) {
        return next(errorHandler(400, 'Detect bot actions'));
    }

    try {
        let validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'Not found email'));
        }

        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Wrong password'));
        }

        if (validUser.isBlocked) {
            return res.status(400).json({ message: 'Account has been blocked by Admin' });
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

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 1 * 60 * 1440 });
        // const refToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 1440 });
        // const refreshToken = new RefreshToken({
        //     refreshToken: refToken,
        // });
        try {
            // await refreshToken.save();
            const newNoti = await Noti.find({ recipient: validUser._id, read: false });
            if (newNoti.length > 0) {
                validUser._doc.newNotification = true;
            }
        } catch (error) {
            next(error);
        }
        res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        // res.cookie('refresh_token', refToken, { httpOnly: true, secure: true, sameSite: 'strict' });

        const { password: secret, ...rest } = validUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    // kiem tra neu nguoi dung da ton taji thif ddangw nhaajp vaof co jwt
    // neu chua thif tajo tk mois luu o user va dangw nhaap vao cos jwt
    const { email, username, googleAvatar } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            if (user.isBlocked) {
                return res.status(400).json({ message: 'Account has been blocked by Admin' });
            }

            if (userOnline.get(user._id.toString())) {
                return res.status(400).json({ message: 'Account is in use' });
            }
            const payload = {
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 1 * 60 * 1440 });
            // const refToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 1440 });
            // const refreshToken = new RefreshToken({
            //     refreshToken: refToken,
            // });
            try {
                // await refreshToken.save();
                const newNoti = await Noti.find({ recipient: user._id, read: false });
                if (newNoti.length > 0) {
                    user._doc.newNotification = true;
                }
            } catch (error) {
                next(error);
            }
            res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
            // res.cookie('refresh_token', refToken, {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'strict',
            // });

            const { password: secret, ...rest } = user._doc;
            res.status(200).json(rest);
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
                const userF = new UsersFolder({
                    userId: user._id,
                });
                const [userTransaction, userFolder] = await Promise.all([transaction.save(), userF.save()]);
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

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 1 * 60 * 1440 });
                // const refToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 1440 });
                // const refreshToken = new RefreshToken({
                //     refreshToken: refToken,
                // });
                // try {
                //     await refreshToken.save();
                // } catch (error) {
                //     next(error);
                // }
                res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
                // res.cookie('refresh_token', refToken, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: 'strict',
                // });

                const { password: secret, ...rest } = newUser._doc;
                res.status(200).json(rest);
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
        // const refreshToken = req.cookies.refresh_token;
        // await RefreshToken.deleteOne({ refreshToken });
        res.clearCookie('access_token');
        // res.clearCookie('refresh_token');
        res.status(200).json('User has been signed out');
    } catch (error) {
        next(error);
    }
};

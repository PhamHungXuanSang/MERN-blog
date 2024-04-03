import User from '../models/user.model.js';
import UserOTP from '../models/userOTP.model.js';
import { sendEmailServices } from '../services/emailService.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const sendEmail = async (req, res, next) => {
    try {
        const { recipientEmail, content } = req.body;
        if (recipientEmail) {
            const response = await sendEmailServices(recipientEmail, content);
            return res.json(response);
        }
        return next(errorHandler(400, 'The email is required'));
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const validEmail = await bcryptjs.compare(req.query.email, req.query.token);
        if (validEmail) {
            // Lưu lại thời gian verify
            await User.findOneAndUpdate(
                { email: req.query.email },
                { $set: { 'emailVerified.verifiedAt': new Date() } },
                { new: true },
            );

            res.redirect('http://localhost:5173/sign-in');
        } else {
            // Thông báo lỗi
            return res.status(400).json('Email verification failed.');
        }
    } catch (error) {
        next(error);
    }
};

export const sendEmailOTP = async (req, res, next) => {
    try {
        const { userId, email: recipientEmail } = req.body;
        if (req.user._id !== userId) {
            return next(errorHandler(403, 'Unauthorized'));
        }
        // Kiểm tra và xóa tất cả OTP của người dùng userId
        await UserOTP.deleteMany({ userId });
        const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

        const hashedOTP = await bcryptjs.hashSync(OTP, 10);
        const newOTP = new UserOTP({
            userId,
            OTP: hashedOTP,
            expiresAt: Date.now() + 300000,
        });
        await newOTP.save();
        sendEmailServices(
            recipientEmail,
            'MERN Blog authenticate by OTP',
            `<p>Enter <b>${OTP}</b> in the app to verify your email address.</p><p>This code <b>expires in 5 minute.</b>.</p>`,
        );
        return res.status(200).json('OTP has been send');
    } catch (error) {
        next(error);
    }
};

export const verifyEmailOTP = async (req, res, next) => {
    try {
        const { userId, OTP } = req.body;
        if (!userId || !OTP) {
            return next(errorHandler(400, 'Please enter OTP'));
        } else {
            const userOTP = await UserOTP.findOne({ userId });
            if (!userOTP) {
                return next(errorHandler(404, "User OTP doesn't exist or has been verified already."));
            } else {
                const { expiresAt } = userOTP;
                const hashedOTP = userOTP.OTP;
                if (expiresAt < Date.now()) {
                    await UserOTP.deleteMany({ userId });
                    return next(errorHandler(401, 'Code has expired. Please request again.'));
                } else {
                    const validOTP = await bcryptjs.compare(OTP, hashedOTP);
                    if (!validOTP) {
                        return next(errorHandler(401, 'Invalid OTP'));
                    } else {
                        await UserOTP.deleteMany({ userId });
                        return res.status(200).json('OTP has been verified successfully.');
                    }
                }
            }
        }
    } catch (error) {
        next(error);
    }
};
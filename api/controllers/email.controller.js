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
            await User.findOneAndUpdate(
                { email: req.query.email },
                { $set: { 'emailVerified.verifiedAt': new Date() } },
                { new: true },
            );

            res.redirect('http://localhost:5173/sign-in');
        } else {
            return res.status(400).json('Email verification failed.');
        }
    } catch (error) {
        next(error);
    }
};

export const sendEmailOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            await UserOTP.deleteMany({ email });
            const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

            const hashedOTP = await bcryptjs.hashSync(OTP, 10);
            const newOTP = new UserOTP({
                email,
                OTP: hashedOTP,
                //expiresAt: Date.now() + 300000,
            });
            await newOTP.save();
            sendEmailServices(
                email,
                'MERN Blog authenticate by OTP',
                `<!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .otp-message {
          margin: 20px 0;
          color: #333;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }
        .expires {
          font-size: 16px;
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="otp-message">
        Enter <span class="otp-code">${OTP}</span> in the app to verify your email address.
      </div>
      <p class="expires">This code <b>expires in 5 minutes.</b></p>
    </body>
  </html>`,
            );
            return res.status(200).json('OTP has been send');
        } else {
            return next(errorHandler(401, 'Please enter the email you registered with'));
        }
    } catch (error) {
        next(error);
    }
};

export const verifyEmailOTP = async (req, res, next) => {
    try {
        const { email, OTP } = req.body;
        if (!email || !OTP) {
            return next(errorHandler(400, 'Please enter OTP'));
        } else {
            const userOTP = await UserOTP.findOne({ email });
            if (!userOTP) {
                return next(errorHandler(404, 'User OTP does not exist or has expired.'));
            } else {
                const { expiresAt } = userOTP;
                const hashedOTP = userOTP.OTP;
                if (expiresAt < Date.now()) {
                    await UserOTP.deleteMany({ email });
                    return next(errorHandler(401, 'Code has expired. Please request again.'));
                } else {
                    const validOTP = await bcryptjs.compare(OTP, hashedOTP);
                    if (!validOTP) {
                        return next(errorHandler(401, 'Invalid OTP'));
                    } else {
                        await UserOTP.deleteMany({ email });
                        return res.status(200).json('OTP has been verified successfully.');
                    }
                }
            }
        }
    } catch (error) {
        next(error);
    }
};

export const sendContactUsEmail = async (req, res, next) => {
    const { name, email, phoneNumber, message } = req.body.formData;
    if (!name || !email || !phoneNumber || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        sendEmailServices(
            '20t1020536@husc.edu.vn',
            'Message from MERN blog. New user contact message',
            `<div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
            <div style="width: 100%; background-color: #00efbc; padding: 20px 0">
                <a href='http://localhost:5173/' style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: #ffffff !important; background-color: #007BFF; border-radius: 5px; text-decoration: none"></a>
                <div>
                    <div style="width: 100%;gap:10px;padding: 30px 0; display: grid">
                        <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">From MERN blog</p>
                        <div style="font-size: .8rem; margin: 0 30px">
                            <p>FullName: <b>${name}</b></p>
                            <p>Email: <b>${email}</b></p>
                            <p>Phone Number: <b>${phoneNumber}</b></p>
                            <p>Message: <i>${message}</i></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
        );
        return res.status(200).json({ message: 'The email has been sent to the administrator' });
    } catch (error) {
        next(error);
    }
};

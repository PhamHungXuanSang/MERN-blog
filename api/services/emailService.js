import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmailServices = async (recipient, subject, content) => {
    const transporter = nodemailer.createTransport({
        // host: 'smtp.gmail.com',
        // port: 587,
        // secure: false, // Use `true` for port 465, `false` for all other ports
        // auth: {
        //     user: process.env.EMAIL,
        //     pass: process.env.EMAIL_PASSWORD,
        // },
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: 'tinvan.hue@gmail.com',
            pass: 'CUBjZ0XyOHMF7P82',
        },
    });

    const info = await transporter.sendMail({
        // from: `"MERN Blog" <${process.env.EMAIL}>`,
        from: `"MERN Blog" <no-reply@mernblog.com>`,
        to: recipient, // danh sách các email nhận, cách nhau bởi dấu ,
        subject: subject || 'MERN Blog', // Subject line
        text: 'Plaintext version of the message', // plain text body
        html: content,
    });

    return info;
};

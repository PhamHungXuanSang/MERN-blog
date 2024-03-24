import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmailServices = async (recipient) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"MERN Blog" <${process.env.EMAIL}>`, // sender address
        to: recipient, // danh sách các email nhận, cách nhau bởi dấu ,
        subject: 'MERN Blog', // Subject line
        text: 'Cái này gửi từ tài khoản admin xem có được không', // plain text body
        html: '<p>Hello world?</p>', // html body nội dung email
        // Xem thêm cách gửi email với các định dạng nội dung khác: https://www.nodemailer.com/message/
    });

    return info;
};

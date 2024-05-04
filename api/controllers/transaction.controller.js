import PaymentHistory from '../models/paymentHistory.model.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import { sendEmailServices } from '../services/emailService.js';
import { errorHandler } from '../utils/error.js';
import PayOS from '@payos/node';

const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECK_SUM);

export const checkFreeTrial = async (req, res, next) => {
    if (req.user._id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const userId = req.params.userId;
    try {
        const userTransaction = await Transaction.findOne({ userId });
        if (!userTransaction) {
            return next(errorHandler(404, 'User not found'));
        }
        return res.status(200).json(userTransaction);
    } catch (error) {
        next(error);
    }
};

export const getFreeTrial = async (req, res, next) => {
    if (req.user._id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const userId = req.params.userId;
    try {
        const currentDate = new Date();
        const userTransaction = await Transaction.findOneAndUpdate(
            { userId },
            {
                $set: {
                    isTrialed: true,
                    createPermission: true,
                    expirationDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                }, // set ở phần Transaction
            },
            { new: true },
        );
        if (!userTransaction) {
            return next(errorHandler(404, 'User not found'));
        }
        const currentUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { createPermission: true } }, // set ở phần User
            { new: true },
        ).select('-password');
        // Thêm code gửi email thông báo đã đăng ký dùng thử 7 ngày thành công
        return res.status(200).json(currentUser);
    } catch (error) {
        next(error);
    }
};

export const checkCreatePermission = async (req, res, next) => {
    const { userId } = req.params;
    try {
        let [user, userTransaction] = await Promise.all([
            User.findOne({ _id: userId }).select('-password'),
            Transaction.findOne({ userId }),
        ]);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        } else if (!userTransaction) {
            return next(errorHandler(404, 'User Transaction not found'));
        }
        if (user.isAdmin) {
            if (user.createPermission == false)
                await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: { createPermission: true } },
                    { new: true },
                ).select('-password');
            return res.status(200).json({ ...user.toObject(), createPermission: true });
        }

        if (
            (!user.isAdmin && !userTransaction.expirationDate) ||
            (!user.isAdmin && userTransaction.expirationDate < new Date())
        ) {
            if (userTransaction.createPermission == true) {
                await Promise.all([
                    User.findOneAndUpdate({ _id: userId }, { $set: { createPermission: false } }, { new: true }).select(
                        '-password',
                    ),
                    Transaction.findOneAndUpdate({ userId }, { $set: { createPermission: false } }, { new: true }),
                ]);
            }
            return res.status(200).json({ ...user.toObject(), createPermission: false });
        } else if (
            (!user.isAdmin && userTransaction.expirationDate > new Date()) ||
            (!user.isAdmin && userTransaction.createPermission == true)
        ) {
            if (user.createPermission == false) {
                await Promise.all([
                    User.findOneAndUpdate({ _id: userId }, { $set: { createPermission: true } }, { new: true }).select(
                        '-password',
                    ),
                    Transaction.findOneAndUpdate({ userId }, { $set: { createPermission: true } }, { new: true }),
                ]);
            }
            return res.status(200).json({ ...user.toObject(), createPermission: true });
        }

        if (!userTransaction.expirationDate) {
            return res.status(200).json(user);
        } else {
            if (userTransaction.expirationDate < new Date()) {
                if (userTransaction.createPermission == true) {
                    await Promise.all([
                        User.findOneAndUpdate(
                            { _id: userId },
                            { $set: { createPermission: false } },
                            { new: true },
                        ).select('-password'),
                        Transaction.findOneAndUpdate({ userId }, { $set: { createPermission: false } }, { new: true }),
                    ]);
                }
                return res.status(200).json({ ...user.toObject(), createPermission: false });
            } else {
                if (userTransaction.createPermission == false) {
                    await Promise.all([
                        User.findOneAndUpdate(
                            { _id: userId },
                            { $set: { createPermission: true } },
                            { new: true },
                        ).select('-password'),
                        Transaction.findOneAndUpdate({ userId }, { $set: { createPermission: true } }, { new: true }),
                    ]);
                }
                return res.status(200).json({ ...user.toObject(), createPermission: true });
            }
        }
    } catch (error) {
        next(error);
    }
};

export const paypalPayment = async (req, res, next) => {
    const userId = req.user._id;
    const { _id: packageId, packageName, packagePrice, packageExpiry } = req.body; // Giả sử packageExpiry là số ngày
    let currentDate = new Date();
    try {
        const userTransaction = await Transaction.findOne({ userId }).exec();
        if (!userTransaction) {
            return next(errorHandler(404, 'User transaction not found'));
        }

        let transactionType;
        // Bây giờ packageExpiry là số ngày, ta sẽ cộng trực tiếp vào currentDate hoặc expirationDate
        if (!userTransaction.expirationDate || userTransaction.expirationDate < currentDate) {
            currentDate.setDate(currentDate.getDate() + packageExpiry);
            transactionType = 'buy package';
        } else {
            const expirationDate = new Date(userTransaction.expirationDate);
            expirationDate.setDate(expirationDate.getDate() + packageExpiry);
            currentDate = expirationDate;
            transactionType = 'package renewal';
        }
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { userId },
            {
                $set: {
                    createPermission: true,
                    packageId,
                    expirationDate: currentDate,
                },
            },
            { new: true },
        ).exec();
        if (!updatedTransaction) {
            return next(errorHandler(404, 'User transaction not found'));
        }

        const paymentHistory = new PaymentHistory({
            userId,
            packageId,
            packageName,
            packageExpiry,
            packagePrice,
            transactionType,
            paymentDate: new Date(),
        });
        await paymentHistory.save();

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: { createPermission: true } }, { new: true })
            .select('-password')
            .exec();
        sendEmailServices(
            updatedUser.email,
            'MERN Blog thanks for joining us on Create Blog',
            `<!DOCTYPE html>
<html lang="en">
<head>
<title>Email Confirmation</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<style type="text/css">
    /* Add your styling here */
    .email-content {
        font-family: 'Arial', sans-serif;
        color: #333;
        margin: 0;
        padding: 20px;
    }
    .header, .footer {
        font-size: 16px;
    }
    .footer {
        margin-top: 12px;
        border-top: 1px solid #CCC;
        padding-top: 5px;
    }
    .main-content {
        margin-top: 12px;
    }
    .button {
        display: inline-block;
        margin-top: 12px;
        padding: 10px 20px;
        color: #ffffff !important;
        background-color: #007BFF;
        border-radius: 5px;
        text-decoration: none;
    }
    .link, .support-email {
        color: #007BFF;
        text-decoration: none;
    }
    .package-info {
        font-size: 14px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .package-info p {
        margin-top: 1px;
        margin-bottom: 1px;
    }
</style>
</head>
<body>
    <div class="email-content">
        <p class="header">
            Hello, ${updatedUser.username},
        </p>
        <p class="main-content">
            You have ${transactionType} successfully for the Create Blog feature on our platform. We're thrilled to have you onboard and can't wait to see the amazing content you'll create.
        </p>
        <div class="package-info">
            <p><strong>Package Information:</strong></p>
            <p>Name: ${packageName}</p>
            <p>Price: ${packagePrice}$</p>
            <p>Number of days valid: ${packageExpiry <= 365 ? packageExpiry + 'days' : 'Lifetime'}</p>
            <p>Estimated expiration date: ${currentDate}</p>
            <p>Purchase date: ${new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Ho_Chi_Minh',
            })}</p>
        </div>
        <a href="http://localhost:5173/dash-board?tab=create-blog" class="button">Create your blog here</a>
        <p class="main-content">
            If you have any questions, feel free to contact our support team at <a href="mailto:20t1020536@husc.edu.vn" class="support-email">20t1020536@husc.edu.vn</a>. We're here to help!
        </p>
        <div class="footer">
            Best regards,<br/>
            The MERN Blog Team
        </div>
        <div class="footer">
            © MERN Blog. All rights reserved.
        </div>
    </div>
</body>
</html>`,
        );
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const getTransactionHistory = async (req, res, next) => {
    const userId = req.params.userId;
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 2);
    try {
        if (!req.user.isAdmin) {
            const user = await User.findById(userId, '_id').exec();
            if (!user) {
                return next(errorHandler(400, 'User not found'));
            }
            if (user._id.toString() !== userId.toString()) {
                return next(errorHandler(400, 'You are not allowed to get this user transaction'));
            }
        }
        const [allUserTransactionHistorys, userTransactionInfo] = await Promise.all([
            PaymentHistory.find({ userId }).sort({ paymentDate: -1 }), // Giả sử bạn muốn sắp xếp theo ngày tạo giảm dần
            Transaction.findOne({ userId }).populate('userId', 'username userAvatar email createdAt'),
        ]);
        const userTransactionHistorys = allUserTransactionHistorys.slice(startIndex, startIndex + limit);
        return res.status(200).json({ allUserTransactionHistorys, userTransactionHistorys, userTransactionInfo });
    } catch (error) {
        next(error);
    }
};

export const createPaymentLink = async (req, res, next) => {
    const userId = req.user._id;
    const { _id: packageId, packageName, packagePrice, packageExpiry } = req.body;
    console.log(userId, packageName, packagePrice);
    //let currentDate = new Date();
    const order = {
        amount: packagePrice,
        description: `Pay ${packageName}`,
        orderCode: Math.floor(Math.random() * (99 - 10 + 1)) + 10,
        returnUrl: `http://localhost:5173/order-status-success`,
        cancelUrl: `http://localhost:5173/order-status-cancel`,
    };
    const paymentLink = await payos.createPaymentLink(order);
    res.status(200).json({ checkoutUrl: paymentLink.checkoutUrl });
};

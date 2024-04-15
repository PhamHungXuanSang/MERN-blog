import PaymentHistory from '../models/paymentHistory.model.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import { sendEmailServices } from '../services/emailService.js';
import { errorHandler } from '../utils/error.js';

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

export const choosePlan = async (req, res, next) => {
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
        // Thêm code gửi email đến người dùng
        sendEmailServices(
            updatedUser.email,
            `<b>Hello, ${updatedUser.username}</b><p>You have successfully registered for the Create Blog feature on our platform.</p><p>We're thrilled to have you onboard and can't wait to see the amazing content you'll create. Get started by clicking the button below!</p><div><a href="http://localhost:5173/dash-board?tab=create-blog">Create your blog here</a></div><p>If you have any questions, feel free to <a href="mailto:support@yourwebsite.com">contact our support team</a>. We're here to help!</p><p>&copy; MERN Blog. All rights reserved.</p>`,
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
            const user = await User.findById(userId, '_id').exec(); // Chỉ lấy trường cần thiết
            if (!user) {
                return next(errorHandler(400, 'User not found'));
            }
            if (user._id.toString() !== userId.toString()) {
                return next(errorHandler(400, 'You are not allowed to get this user transaction'));
            }
        }
        // const [allUserTransactionHistorys, userTransactionHistorys, userTransactionInfo] = await Promise.all([
        //     PaymentHistory.find({ userId }),
        //     PaymentHistory.find({ userId }).skip(startIndex).limit(limit),
        //     Transaction.findOne({ userId }).populate('userId', 'username userAvatar email createdAt'),
        // ]);
        // return res.status(200).json({ allUserTransactionHistorys, userTransactionHistorys, userTransactionInfo });

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

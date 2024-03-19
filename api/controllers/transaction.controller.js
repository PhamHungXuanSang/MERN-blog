import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
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
        );
        return res.status(200).json(currentUser);
    } catch (error) {
        next(error);
    }
};

export const checkCreatePermission = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        let user = await User.findOne({ _id: userId });
        // if (!user) {
        //     return next(errorHandler(404, 'User not found'));
        // }
        if (user.isAdmin) {
            if (user.createPermission == false)
                await User.findOneAndUpdate({ _id: userId }, { $set: { createPermission: true } }, { new: true });
            return res.status(200).json({ ...user.toObject(), createPermission: true });
        }
        const userTransaction = await Transaction.findOne({ userId });
        // if (!userTransaction) {
        //     return next(errorHandler(404, 'User not found'));
        // }
        if (!userTransaction.expirationDate) {
            return res.status(200).json(user);
        } else {
            if (userTransaction.expirationDate < new Date()) {
                if (userTransaction.createPermission == true) {
                    // Thay đổi sang sử dụng promise.all để tăng hiệu năng
                    await User.findOneAndUpdate({ _id: userId }, { $set: { createPermission: false } }, { new: true });
                    await Transaction.findOneAndUpdate(
                        { userId },
                        { $set: { createPermission: false } },
                        { new: true },
                    );
                }
                return res.status(200).json({ ...user.toObject(), createPermission: false });
            } else {
                if (userTransaction.createPermission == false) {
                    await User.findOneAndUpdate({ _id: userId }, { $set: { createPermission: true } }, { new: true });
                    await Transaction.findOneAndUpdate({ userId }, { $set: { createPermission: true } }, { new: true });
                }
                return res.status(200).json({ ...user.toObject(), createPermission: true });
            }
        }
    } catch (error) {
        next(error);
    }
};

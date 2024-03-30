import Noti from '../models/noti.model.js';
import { errorHandler } from '../utils/error.js';

export const newNotification = async (req, res, next) => {
    if (req.user._id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    try {
        const userId = req.params.userId;
        const newNoti = await Noti.find({ recipient: userId, read: false });
        return res.status(200).json(newNoti);
    } catch (error) {
        next(error);
    }
};

export const getNotifications = async (req, res, next) => {
    const userId = req.params.userId;
    let { page, filter, deletedDocCount } = req.body;
    let maxLimit = 10;
    let findQuery = { recipient: userId };
    let skipDocs = (page - 1) * maxLimit;
    if (filter != 'all') {
        findQuery.type = filter;
    }
    if (deletedDocCount) {
        skip -= deletedDocCount;
    }

    try {
        console.log(findQuery);
        const notifications = await Noti.find(findQuery)
            .populate('blogId')
            .populate('recipient')
            .populate('sender')
            .populate('commentId')
            .populate('repliedOnComment')
            .sort({ createdAt: -1 })
            .skip(skipDocs)
            .limit(maxLimit);

        return res.status(200).json({ notifications });
    } catch (error) {
        next(error);
    }
};

export const allNotificationCount = async (req, res, next) => {
    const userId = req.params.userId;
    let { filter } = req.body;
    let findQuery = { recipient: userId };
    if (filter != 'all') {
        findQuery.type = filter;
    }
    try {
        console.log(findQuery);
        const [notifications, notiCount] = await Promise.all([
            Noti.find(findQuery)
                .populate('blogId')
                .populate('recipient')
                .populate('sender')
                .populate('commentId')
                .populate('repliedOnComment')
                .sort({ createdAt: -1 }),
            Noti.countDocuments(findQuery),
        ]);
        return res.status(200).json({ notifications, totalDocs: notiCount });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    const notificationId = req.params.notificationId;
    try {
        const noti = await Noti.findOneAndDelete({ _id: notificationId });
        if (noti) {
            return res.status(200).json('Noti deleted');
        } else {
            return res.status(400, 'Can not find notification to delete');
        }
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    const notificationId = req.params.notificationId;
    try {
        const notification = await Noti.findOneAndUpdate({ _id: notificationId }, { $set: { read: true } });
        if (notification) {
            return res.status(200).json('Noti mark as read successfully');
        } else {
            return res.status(400, 'Can not find notification to mark as read');
        }
    } catch (error) {
        console.log(error);
    }
};

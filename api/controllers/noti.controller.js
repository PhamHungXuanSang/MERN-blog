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
    // Lấy ra trả về kiểu mảng, mỗi phần tử mảng là một loại (reply, comment, rate, ...) và nó chứa nội dung thông báo của loại, số lượng thông báo chưa đọc
    const allNotiType = ['system', 'like', 'comment', 'reply', 'rate', 'subscriber', 'new blog'];
    const userId = req.params.userId;
    try {
        // Tạo một Promise để đếm số thông báo chưa đọc cho mỗi loại
        const unReadCountPromises = allNotiType.map((type) =>
            Noti.countDocuments({ recipient: userId, type: type, read: false }),
        );

        // Tạo Promise để đếm số thông báo chưa đọc cho 'all'
        const unReadCountAllPromise = Noti.countDocuments({ recipient: userId, read: false });

        // const allNotificationsPromise = allNotiType.map((type) =>
        //     Noti.find({ recipient: userId, type: type })
        //         .populate('blogId')
        //         .populate('recipient')
        //         .populate('sender')
        //         .populate('commentId')
        //         .populate('repliedOnComment')
        //         .sort({ createdAt: -1 }),
        // );

        const allNotifications = await Noti.find({ recipient: userId })
            .populate({
                path: 'blogId',
            })
            .populate({
                path: 'recipient',
                select: '-password',
            })
            .populate({
                path: 'sender',
                select: '-password',
            })
            .populate('commentId')
            .populate('repliedOnComment')
            .sort({ createdAt: -1 });

        // Chờ tất cả Promise thực thi
        const unReadCounts = await Promise.all(unReadCountPromises);
        const unReadCountAll = await unReadCountAllPromise;

        // Tạo đối tượng cho 'all' và chèn vào đầu mảng kết quả
        const result = [
            {
                type: 'all',
                notifications: allNotifications, // Đã là một mảng đầy đủ, không cần nối mảng
                unReadCount: unReadCountAll,
            },
        ];

        // Thêm thông tin cho các loại còn lại
        allNotiType.forEach((type, index) => {
            result.push({
                type: type,
                notifications: allNotifications.filter((nt) => nt.type === type), // Lọc các thông báo theo loại từ mảng 'allNotifications'
                unReadCount: unReadCounts[index],
            });
        });

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }

    // let { page, filter, deletedDocCount } = req.body;
    // let maxLimit = 10;
    // let findQuery = { recipient: userId };
    // let skipDocs = (page - 1) * maxLimit;
    // if (filter != 'all') {
    //     findQuery.type = filter;
    // }
    // if (deletedDocCount) {
    //     skip -= deletedDocCount;
    // }

    // try {
    //     const [allNotifications, unReadNotifications] = await Promise.all([
    //         Noti.find({ recipient: userId })
    //             .populate('blogId')
    //             .populate('recipient')
    //             .populate('sender')
    //             .populate('commentId')
    //             .populate('repliedOnComment')
    //             .sort({ createdAt: -1 }),
    //         Noti.find({ recipient: userId, read: false })
    //             .populate('blogId')
    //             .populate('recipient')
    //             .populate('sender')
    //             .populate('commentId')
    //             .populate('repliedOnComment')
    //             .sort({ createdAt: -1 }),
    //     ]);

    //     return res.status(200).json({ allNotifications, unReadNotifications });
    // } catch (error) {
    //     next(error);
    // }
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

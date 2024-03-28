import Noti from '../models/noti.model.js';

export const newNotification = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const newNoti = Noti.find({ recipient: userId, read: false });
        return res.status(200).json(newNoti);
    } catch (error) {
        next(error);
    }
};

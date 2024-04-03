import Noti from '../models/noti.model.js';

export default function createNoti(type, recipient, sender = null, message, newNotificationOtherInfor) {
    let newNotification = {
        type,
        recipient,
        sender,
        message,
        ...newNotificationOtherInfor,
    };
    new Noti(newNotification)
        .save()
        .then(() => {})
        .catch((error) => {
            console.log(error);
        });
}

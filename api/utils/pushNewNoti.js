import { io } from '../index.js';

export default function pushNewNoti(socketId, thumb, title, userAvatar, username, message, type) {
    io.to(socketId).emit('newNotification', {
        thumb: thumb != '' ? thumb : null,
        title: title != '' ? title : null,
        userAvatar: userAvatar != '' ? userAvatar : null,
        username: username != '' ? username : null,
        message: message != '' ? message : null,
        type: type != '' ? type : 'all',
    });
}

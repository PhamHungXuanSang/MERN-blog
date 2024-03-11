import io from 'socket.io-client';
var connectOptions = {
    transports: ['websocket'],
};

export const socket = io.connect('http://localhost:3000', connectOptions);

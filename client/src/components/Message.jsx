/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import useConversation from '../zustand/useConversation';
import { extractTime } from '../utils/extractTime';

export default function Message({ message }) {
    const authUser = useSelector((state) => state.user.currentUser);
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    const userAvatar = fromMe ? authUser.userAvatar : selectedConversation?.userAvatar;
    const bubbleBgColor = fromMe ? 'bg-blue-500' : '';
    const formattedTime = extractTime(message.createdAt);

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={userAvatar} alt="Tailwindcss chat bubble component" />
                </div>
            </div>

            <div className={`chat-bubble ${bubbleBgColor} text-white`}>{message.message}</div>
            <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
        </div>
    );
}

import { useEffect } from 'react';
import useGetMessages from '../hooks/useGetMessages/useGetMessages';
import Message from './Message';
import MessageSkeleton from './MessageSkeleton';

export default function Messages() {
    const { messages, loading } = useGetMessages();

    useEffect(() => {
        const scrollElement = document.querySelector('#scrollElement');
        if (messages.length > 0) {
            setTimeout(() => {
                scrollElement.scrollTo({
                    top: scrollElement.scrollHeight,
                    behavior: 'smooth',
                });
            }, 500);
        }
    }, [messages]);

    return (
        <div className="px-4 flex-1 overflow-auto" id="scrollElement">
            {!loading &&
                messages.map((message) => (
                    <div key={message._id}>
                        <Message message={message} />
                    </div>
                ))}
            {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
            {!loading && messages.length === 0 && (
                <p className="text-center">Send a message to start the conversation</p>
            )}
        </div>
    );
}

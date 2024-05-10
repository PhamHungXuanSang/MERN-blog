import { useEffect } from 'react';
import useConversation from '../zustand/useConversation';
import MessageInput from './MessageInput';
import Messages from './Messages';
import { TiMessages } from 'react-icons/ti';

export default function MessageContainer() {
    const { selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        // cleanup function (unmounts)
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    return (
        <div className="max-sm:max-h-[450px] md:min-w-[450px] flex flex-col">
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    {/* Hearder chat */}
                    <div className="dark:bg-slate-500 bg-slate-200 px-4 py-2 mb-2">
                        <span className="label-text">To: </span>
                        <span className="font-bold">{selectedConversation.username}</span>
                    </div>
                    {/* Messages */}
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
}

const NoChatSelected = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-xl font-semibold flex flex-col items-center gap-2">
                <p>Welcome 👏 Sang</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className="text-3xl md:text-6xl text-center" />
            </div>
        </div>
    );
};

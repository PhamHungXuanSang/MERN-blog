import { useState } from 'react';
import { BsSendFill } from 'react-icons/bs';
import useSendMessage from '../hooks/useSendMessage/useSendMessage';
import { Spinner } from 'flowbite-react';

export default function MessageInput() {
    const [message, setMessage] = useState('');
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage('');
    };

    return (
        <form className="px-4 my-4" onSubmit={handleSubmit}>
            <div className="w-full relative">
                <input
                    type="text"
                    className="border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 border-gray-600"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
                    {loading ? (
                        <Spinner aria-label="Spinner button example" size="sm" className="mx-auto block" />
                    ) : (
                        <BsSendFill />
                    )}
                </button>
            </div>
        </form>
    );
}

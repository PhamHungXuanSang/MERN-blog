import { Spinner } from 'flowbite-react';
import useGetConversations from '../hooks/useGetConversations/useGetConversations';
import Conversation from './Conversation';
import { getRandomEmoji } from '../utils/emoji';

export default function Conversations() {
    const { loading, conversations } = useGetConversations();
    
    return (
        <div className="py-2 flex flex-col overflow-auto">
            {conversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    emoji={getRandomEmoji()}
                    lastIdx={idx === conversations.length - 1}
                />
            ))}
            {loading ? <Spinner aria-label="Spinner button example" size="sm" className="mx-auto block" /> : null}
        </div>
    );
}

/* eslint-disable react/prop-types */
import { Button } from 'flowbite-react';
import Conversations from '../components/Conversations';
import MessageContainer from '../components/MessageContainer';
import { BiLogOut } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useConversation from '../zustand/useConversation';
import useGetConversations from '../hooks/useGetConversations/useGetConversations';
import toast from 'react-hot-toast';

export default function Chat({ onlineUsers }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error('Search term must be at least 3 characters long');
        }

        const conversation = conversations.find((c) => c.username.toLowerCase().includes(search.toLowerCase()));

        if (conversation) {
            setSelectedConversation(conversation);
            setSearch('');
        } else {
            toast.error('No search user found');
        }
    };

    return (
        <div className="flex flex-col md:flex-row sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 container mx-auto py-4">
            <div className="border-r border-slate-500 p-4 flex flex-col">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search User"
                        className="input input-bordered rounded-full bg-slate-200 text-black"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-circle bg-sky-500 dark:hover:bg-slate-200">
                        <FaSearch className="w-6 h-6 outline-none" />
                    </button>
                </form>
                <div className="divider px-3"></div>
                <Conversations onlineUsers={onlineUsers} />
                <Button className="mt-auto" outline gradientDuoTone={'greenToBlue'} onClick={() => navigate('/')}>
                    <BiLogOut className="w-6 h-6 cursor-pointer" />
                    Back to home
                </Button>
            </div>
            <MessageContainer />
        </div>
    );
}

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import formatDate from '../utils/formatDate';
import toast from 'react-hot-toast';
import { useState } from 'react';
import CommentField from './CommentField';

export default function CommentCard({ index, leftVal, commentData }) {
    const currentUser = useSelector((state) => state.user.currentUser);
    let {
        commentedBy: { username, userAvatar },
        updatedAt,
        content,
        _id,
    } = commentData;

    const [isReplying, setIsReplying] = useState(false);

    const handleReplyClick = () => {
        if (!currentUser) {
            return toast.error('Please sign in to reply');
        }

        setIsReplying((preVal) => !preVal);
    };

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-gray-300">
                <div className="flex gap-3 items-center mb-8 text-sm">
                    <img className="w-6 h-6 object-cover rounded-full" src={userAvatar} alt="avatar" />
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(updatedAt)}</p>
                </div>
                <p className="text-xl">{content}</p>

                <div className="flex gap-4 items-center mt-4">
                    <button className="underline" onClick={handleReplyClick}>
                        Reply
                    </button>
                </div>

                {isReplying ? (
                    <div className="mt-4">
                        <CommentField action="reply" index={index} replyingTo={_id} setIsReplying={setIsReplying} />
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}

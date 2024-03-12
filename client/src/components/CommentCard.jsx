/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import formatDate from '../utils/formatDate';

export default function CommentCard({ index, leftVal, commentData }) {
    let {
        commentedBy: { username, userAvatar },
        updatedAt,
        content,
    } = commentData;

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-gray-300">
                <div className="flex gap-3 items-center mb-8 text-sm">
                    <img className="w-6 h-6 object-cover rounded-full" src={userAvatar} alt="avatar" />
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(updatedAt)}</p>
                </div>
                <p className='text-xl'>{content}</p>
            </div>
        </div>
    );
}

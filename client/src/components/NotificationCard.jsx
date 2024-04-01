/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';
import { useState } from 'react';
import NotificationCommentField from './NotificationCommentField.jsx';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

export default function NotificationCard({ data, index, notificationState }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isReplying, setIsReplying] = useState(false);
    let { notifications, setNotifications } = notificationState;

    const handleMarkAsRead = async (data) => {
        if (data.read == false) {
            try {
                const res = await fetch(`/api/notification/mark-as-read/${data._id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                const resMes = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                }
                if (res.status === 200) {
                    notifications = notifications.map((nt) => {
                        // So sánh ID của blog trong thông báo với notificationId
                        if (nt._id === data._id) {
                            return { ...nt, read: true };
                        }
                        return nt;
                    });
                    setNotifications([...notifications]);
                    return;
                } else {
                    return toast.error(resMes.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            const res = await fetch(`/api/notification/delete-notification/${notificationId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status == 200) {
                setNotifications(notifications.filter((nt) => nt._id !== notificationId));
                return toast.success('Notification deleted');
            } else {
                return toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            onClick={() => handleMarkAsRead(data)}
            className={
                'p-4 border-b border-gray-300 ' +
                `${data.read ? '' : 'dark:bg-gray-700 bg-gray-200 cursor-pointer hover:opacity-80'}`
            }
        >
            <div className="flex gap-4 mb-3">
                <Link to={`/user/${data.sender.username}`}>
                    <img src={data.sender.userAvatar} className="w-12 h-12 flex-none rounded-full" />
                </Link>
                <div className="w-full">
                    {data.type === 'reply' ? (
                        <>
                            <Link to={`/blog/${data.blogId.slug}`} className="font-medium hover:underline line-clamp-1">
                                {data.blogId.title}
                            </Link>
                            {/* xem lại cách hiển thị nội dung */}
                            <div className="py-2 px-4 mt-2 rounded-md bg-gray-100 dark:bg-slate-600">
                                <p className="text-sm">Your comment: {data.repliedOnComment.content}</p>
                            </div>
                        </>
                    ) : (
                        <Link to={`/blog/${data.blogId.slug}`} className="font-medium hover:underline line-clamp-1">
                            {data.blogId.title}
                        </Link>
                    )}
                    <h1 className="font-medium text-xl">
                        <span className="pl-4 font-normal line-clamp-2 text-sm">{data.message}</span>
                    </h1>
                </div>
            </div>
            {data.type != 'like' && data.type != 'system' && data.type != 'rating' ? (
                <p className="ml-14 pl-5 text-xl">{data.commentId.content}</p>
            ) : (
                ''
            )}
            <div className="ml-14 pl-5 mt-1 text-gray-500 flex items-center gap-8">
                <p className="text-sm">{dateToDateAndTime(data.createdAt)}</p>
                {data.type != 'like' && data.type != 'system' && data.type != 'rating' ? (
                    <>
                        <button
                            className="underline hover:cursor-pointer"
                            onClick={() => setIsReplying((prev) => !prev)}
                        >
                            Reply
                        </button>
                        <button className="underline hover:cursor-pointer" onClick={() => handleDelete(data._id)}>
                            Delete
                        </button>
                    </>
                ) : (
                    ''
                )}
            </div>
            {isReplying ? (
                <div className="mt-8">
                    <NotificationCommentField
                        _id={data.blogId._id}
                        blogAuthor={data.sender}
                        index={index}
                        replyingTo={data.commentId._id}
                        setIsReplying={setIsReplying}
                        notificationId={data._id}
                        notificationData={notificationState}
                    />
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

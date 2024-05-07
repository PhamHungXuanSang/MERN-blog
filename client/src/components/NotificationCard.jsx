/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';
import { useState } from 'react';
import NotificationCommentField from './NotificationCommentField.jsx';
import { setCurrentUser, signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaArrowRight } from 'react-icons/fa';

export default function NotificationCard({ data, index, notificationState, unReadCount }) {
    const currentUser = useSelector((state) => state.user.currentUser);
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
                            unReadCount.forEach((notiType, i) => {
                                if (notiType.type == nt.type) {
                                    unReadCount[0].unReadCount = unReadCount[0].unReadCount - 1;
                                    unReadCount[i].unReadCount = unReadCount[i].unReadCount - 1;
                                }
                            });
                            return { ...nt, read: true };
                        }
                        return nt;
                    });
                    setNotifications([...notifications]);
                    const hasUnreadNotification = notifications.some((noti) => noti.read == false);
                    return dispatch(setCurrentUser({ ...currentUser, newNotification: hasUnreadNotification }));
                } else {
                    return toast.error(resMes.message, { duration: 6000 });
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
                notifications = notifications.map((nt) => {
                    // So sánh ID của blog trong thông báo với notificationId
                    if (nt._id === notificationId) {
                        unReadCount.forEach((notiType, i) => {
                            if (notiType.type == nt.type) {
                                unReadCount[0].unReadCount = unReadCount[0].unReadCount - 1;
                                unReadCount[i].unReadCount = unReadCount[i].unReadCount - 1;
                            }
                        });
                        return nt;
                    }
                    return nt;
                });
                setNotifications(notifications.filter((noti) => noti._id != notificationId));
                return toast.success('Notification deleted', { duration: 3000 });
            } else {
                return toast.error(data.message, { duration: 6000 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="relative group">
            <div
                onClick={() => handleMarkAsRead(data)}
                className={
                    'p-4 border-b border-gray-300 ' +
                    `${data.read ? '' : 'dark:bg-gray-700 bg-gray-200 cursor-pointer hover:opacity-80'}`
                }
            >
                <div className="flex gap-4 mb-3">
                    {data.sender ? (
                        <Link to={`/user/${data.sender.username}`}>
                            <img src={data.sender.userAvatar} className="w-12 h-12 flex-none rounded-full" />
                        </Link>
                    ) : null}
                    <div className="w-full">
                        {data.type === 'reply' ? (
                            <>
                                <Link
                                    to={`/blog/${data.blogId.slug}`}
                                    className="font-medium hover:underline line-clamp-1"
                                >
                                    {data.blogId.title}
                                </Link>
                                <div className="py-2 px-4 mt-2 rounded-md bg-gray-200 dark:bg-slate-600">
                                    <p className="text-sm">Your comment: {data.repliedOnComment.content}</p>
                                </div>
                            </>
                        ) : data.blogId?.slug ? (
                            <Link to={`/blog/${data.blogId.slug}`} className="font-medium hover:underline line-clamp-1">
                                {data.blogId.title}
                            </Link>
                        ) : (
                            ''
                        )}
                        <h1 className="font-medium text-xl">
                            <span className="pl-4 font-normal line-clamp-2 text-sm">{data.message}</span>
                        </h1>
                    </div>
                </div>
                {data.type == 'comment' || data.type == 'reply' ? (
                    <p className="ml-14 pl-5 text-xl">{data.commentId.content}</p>
                ) : (
                    ''
                )}
                <div className="ml-14 pl-5 mt-1 text-gray-500 flex items-center gap-8">
                    <p className="text-sm">{dateToDateAndTime(data.createdAt)}</p>
                    <>
                        {data.type == 'comment' || data.type == 'reply' ? (
                            <button
                                className="underline hover:cursor-pointer"
                                onClick={() => setIsReplying((prev) => !prev)}
                            >
                                Reply
                            </button>
                        ) : (
                            ''
                        )}
                    </>
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
            <div
                onClick={() => handleDelete(data._id)}
                className="absolute hidden group-hover:block hover:scale-125 duration-300 cursor-pointer z-20 top-[-4px] right-[-2px] rounded-full px-2 bg-red-600"
            >
                x
            </div>
            {data?.username || data?.slug ? (
                <Link
                    to={data?.username ? `/user/${data?.username}` : `/blog/${data?.slug}`}
                    className="absolute hidden group-hover:block hover:scale-125 duration-300 cursor-pointer h-full top-0 right-2 hover:right-[-2px] rounded-full px-2"
                >
                    <FaArrowRight className="h-full" />
                </Link>
            ) : null}
        </div>
    );
}

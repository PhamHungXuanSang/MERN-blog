/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';

export default function NotificationCommentField({
    _id,
    blogAuthor,
    index = undefined,
    replyingTo = undefined,
    setIsReplying,
    notificationId,
    notificationData,
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const [comment, setComment] = useState('');
    let { _id: userId } = blogAuthor;
    let {
        notifications,
        notifications: { results },
        setNotifications,
    } = notificationData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.length) {
            return toast.error('Please enter comment');
        }

        try {
            let body = {
                _id,
                comment,
                blogAuthor: userId,
                userId: currentUser._id,
                username: currentUser.username,
                replyingTo: replyingTo,
                notificationId,
            };
            const res = await fetch(`/api/comment/add-comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            let data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            data = data._doc;
            setIsReplying(false);
            toast.success('Reply sent successfully');
            // setComment('');
            // data.commentedBy = { username, userAvatar, _id: userId };

            // let newCommentArr;
            // if (replyingTo) {
            //     commentsArr[index].children.push(data._id);
            //     data.childrenLevel = commentsArr[index].childrenLevel + 1;
            //     data.parentIndex = index;

            //     commentsArr[index].isReplyLoaded = true;
            //     commentsArr.splice(index + 1, 0, data);
            //     newCommentArr = commentsArr;
            //     setIsReplying(false);
            // } else {
            //     data.childrenLevel = 0;
            //     newCommentArr = [data, ...commentsArr];
            // }
            // blog.commentCount = blog.commentCount + 1;
            // setBlog({ ...blog, comments: { ...comments, results: newCommentArr } });
            //setTotalParentCommentsLoaded((preVal) => preVal + 1);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Toaster />
            {currentUser && (
                <form onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Add reply..."
                        rows={3}
                        maxLength={200}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
                        <Button outline gradientDuoTone="greenToBlue" type="submit">
                            Reply
                        </Button>
                    </div>
                </form>
            )}
        </>
    );
}

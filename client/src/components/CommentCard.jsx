/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import formatDate from '../utils/formatDate';
import toast from 'react-hot-toast';
import { useContext, useState } from 'react';
import CommentField from './CommentField';
import { BlogContext } from '../pages/ReadBlog';
import { MdDelete } from 'react-icons/md';
import ModalConfirm from './ModalConfirm';

export default function CommentCard({ index, leftVal, commentData }) {
    const [showModal, setShowModal] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);
    let {
        commentedBy: { username, userAvatar },
        updatedAt,
        content,
        _id,
        children,
    } = commentData;

    let {
        blog,
        blog: {
            comments,
            comments: { results: commentsArr },
        },
        setBlog,
    } = useContext(BlogContext);

    const [isReplying, setIsReplying] = useState(false);

    const handleReplyClick = () => {
        if (!currentUser) {
            return toast.error('Please sign in to reply');
        }

        setIsReplying((preVal) => !preVal);
    };

    const removeCommentsCards = (startingPoint) => {
        if (commentsArr[startingPoint]) {
            while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {
                commentsArr.splice(startingPoint, 1);
                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }

        setBlog({ ...blog, comments: { results: commentsArr } });
    };

    const loadReplies = async ({ skip = 0 }) => {
        if (children.length) {
            hideReplies();

            try {
                const data = await fetch('/api/comment/get-blog-replies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id, skip }),
                });

                let rs = await data.json();
                let replies = rs.replies;
                commentData.isReplyLoaded = true;
                for (let i = 0; i < replies.length; i++) {
                    replies[i].childrenLevel = commentData.childrenLevel + 1;
                    commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
                }

                setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const hideReplies = () => {
        commentData.isReplyLoaded = false;

        removeCommentsCards(index + 1);
    };

    const handleDeleteComment = async () => {};

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
                    {commentData.isReplyLoaded ? (
                        <button
                            onClick={hideReplies}
                            className="text-gray-400 p-1 hover:bg-gray-300 rounded-md flex items-center gap-2"
                        >
                            Hide replies
                        </button>
                    ) : (
                        <button
                            onClick={loadReplies}
                            className="text-gray-400 p-1 hover:bg-gray-300 rounded-md flex items-center gap-2"
                        >
                            Load {children.length} replies
                        </button>
                    )}
                    <button className="underline" onClick={handleReplyClick}>
                        Reply
                    </button>

                    {currentUser.isAdmin == true ||
                    currentUser.username == blog.authorId.username ||
                    currentUser.username == username ? (
                        <button
                            onClick={() => {
                                setShowModal(!showModal);
                            }}
                            className="p-1 rounded-md border border-gray-300 ml-auto hover:bg-red hover:opacity-30 hover:text-red-500 flex items-center"
                        >
                            <MdDelete />
                        </button>
                    ) : (
                        ''
                    )}
                </div>

                {isReplying ? (
                    <div className="mt-4">
                        <CommentField action="reply" index={index} replyingTo={_id} setIsReplying={setIsReplying} />
                    </div>
                ) : (
                    ''
                )}
            </div>
            {showModal && (
                <ModalConfirm
                    showModal={showModal}
                    setShowModal={setShowModal} // Giả định rằng setShowModal là một hàm setState từ component cha
                    title={`You definitely want to delete this comment ?`}
                    onConfirm={handleDeleteComment}
                    onNoConfirm={() => setShowModal(false)}
                    confirm={`Yes I am sure`}
                    noConfirm="No, I'm not sure"
                />
            )}
        </div>
    );
}

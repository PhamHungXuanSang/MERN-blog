/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '../utils/formatDate';
import toast from 'react-hot-toast';
import { useContext, useState } from 'react';
import CommentField from './CommentField';
import { BlogContext } from '../pages/ReadBlog';
import { MdDelete } from 'react-icons/md';
import ModalConfirm from './ModalConfirm';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';

export default function CommentCard({ index, leftVal, commentData }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    const getParentIndex = () => {
        let startingPoint = index - 1;
        try {
            // Dùng lặp while để lấy được thằng cmt parent của thằng reply
            while (commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--;
            }
        } catch {
            startingPoint = undefined;
        }

        return startingPoint;
    };

    let count = 0;
    const removeCommentsCards = (startingPoint, isDelete = false) => {
        if (commentsArr[startingPoint]) {
            while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {
                count++;
                commentsArr.splice(startingPoint, 1);
                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }

        // Nếu hành động này là xóa cmt
        if (isDelete) {
            let parentIndex = getParentIndex();
            // Nếu reply có cmt parent
            if (parentIndex != undefined) {
                // Cập nhật lại danh sách children của cmt parent sẽ loại đi thằng cmt có _id vừa bị xóa
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter((child) => child != _id);

                // Nếu sau khi cập nhật mà cmt parent ko còn bất kỳ cmt reply nào nữa thì sẽ set lại isReplyLoaded = false để khỏi hiện cái nút hide reply vì có reply đâu nữa mà hide
                if (!commentsArr[parentIndex].children.length) {
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }

            commentsArr.splice(index, 1);
            blog.commentCount = blog.commentCount - (count + 1);
        }

        // Nếu cmt delete là cmt cha ngoài cùng
        // if (commentData.childrenLevel == 0 && isDelete == true) {
        //     blog.commentCount = blog.commentCount - 1;
        // }

        setBlog({ ...blog, comments: { results: commentsArr } });
    };

    const loadReplies = async ({ skip = 0, currentIndex = index }) => {
        if (commentsArr[currentIndex].children.length) {
            hideReplies();

            try {
                const data = await fetch('/api/comment/get-blog-replies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: commentsArr[currentIndex]._id, skip }),
                });

                let rs = await data.json();
                let replies = rs.replies;
                commentsArr[currentIndex].isReplyLoaded = true;
                for (let i = 0; i < replies.length; i++) {
                    replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel + 1;
                    commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
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

    const handleDeleteComment = async () => {
        setShowModal(!showModal);
        try {
            const res = await fetch('/api/comment/delete-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id }),
            });
            const rs = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }

            removeCommentsCards(index + 1, true);
        } catch (error) {
            console.log(error);
        }
    };

    const LoadMoreReplies = () => {
        let parentIndex = getParentIndex();
        if (commentsArr[index + 1]) {
            if (commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel) {
                if (index - parentIndex < commentsArr[parentIndex].children.length) {
                    return (
                        <button
                            onClick={() => loadReplies({ skip: index - parentIndex, currentIndex: parentIndex })}
                            className="p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2"
                        >
                            Load More Replies
                        </button>
                    );
                }
            }
        } else {
            if (parentIndex || parentIndex == 0) {
                if (index - parentIndex < commentsArr[parentIndex].children.length) {
                    return (
                        <button
                            onClick={() => loadReplies({ skip: index - parentIndex, currentIndex: parentIndex })}
                            className="p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2"
                        >
                            Load More Replies
                        </button>
                    );
                }
            }
        }
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
                            {children.length} replies
                        </button>
                    )}
                    <button className="underline" onClick={handleReplyClick}>
                        Reply
                    </button>

                    {currentUser?.isAdmin == true ||
                    currentUser?.username == blog.authorId.username ||
                    currentUser?.username == username ? (
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
            <LoadMoreReplies />

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

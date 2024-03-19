import { Button, Textarea } from 'flowbite-react';
import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { BlogContext } from '../pages/ReadBlog';
import { signOutSuccess } from '../redux/user/userSlice.js';

export default function CommentField({ action, index = undefined, replyingTo = undefined, setIsReplying }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    if (currentUser) {
        var { username, userAvatar, _id: userId } = currentUser;
    }
    const [comment, setComment] = useState('');

    let {
        blog,
        blog: {
            _id,
            authorId,
            comments,
            comments: { results: commentsArr },
        },
        setBlog,
        //setTotalParentCommentsLoaded,
    } = useContext(BlogContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.length) {
            return toast.error('Please enter comment');
        }

        try {
            let body = {
                _id,
                comment,
                blogAuthor: authorId._id,
                userId: currentUser._id,
                username: currentUser.username,
                replyingTo: replyingTo,
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
            setComment('');
            data.commentedBy = { username, userAvatar, _id: userId };

            let newCommentArr;
            if (replyingTo) {
                commentsArr[index].children.push(data._id);
                data.childrenLevel = commentsArr[index].childrenLevel + 1;
                data.parentIndex = index;

                commentsArr[index].isReplyLoaded = true;
                commentsArr.splice(index + 1, 0, data);
                newCommentArr = commentsArr;
                setIsReplying(false);
            } else {
                data.childrenLevel = 0;
                newCommentArr = [data, ...commentsArr];
            }
            blog.commentCount = blog.commentCount + 1;
            setBlog({ ...blog, comments: { ...comments, results: newCommentArr } });
            //setTotalParentCommentsLoaded((preVal) => preVal + 1);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Toaster />
            <div className="max-w-2xl w-full mx-auto p-3 border border-teal-500 rounded-md">
                {currentUser ? (
                    <div className="flex items-center gap-1 mb-4 text-gay-500 text-sm">
                        <p>Signed in at: </p>
                        <img
                            className="ml-4 mr-1 w-5 h-5 object-cover rounedd-full"
                            src={currentUser.userAvatar}
                            alt="User avatar"
                        />
                        <Link to={'/dash-board?tab=profile'} className="text-xs text-cyan-600 hover:underline">
                            @{currentUser.username}
                        </Link>
                    </div>
                ) : (
                    <div className="text-sm text-teal-500 my-5 flex gap-1">
                        You must be sign in to comment.
                        <Link className="text-blue-500 hover:underline" to={'/sign-in'}>
                            Sign in
                        </Link>
                    </div>
                )}
                {currentUser && (
                    <form onSubmit={handleSubmit}>
                        <Textarea
                            placeholder="Add a comment..."
                            rows={3}
                            maxLength={200}
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        />
                        <div className="flex justify-between items-center mt-5">
                            <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
                            <Button outline gradientDuoTone="greenToBlue" type="submit">
                                Submit
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

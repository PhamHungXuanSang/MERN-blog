import { useContext } from 'react';
import { BlogContext } from '../pages/ReadBlog';
import { IoClose } from 'react-icons/io5';
import CommentField from './CommentField';
import NotFound from './NotFound';
import CommentCard from './CommentCard';

export const fetchComments = async ({ skip = 0, blogId, commentArr = null }) => {
    let res;
    const rs = await fetch('/api/comment/get-blog-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId, skip }),
    });
    const data = await rs.json();
    data.map((comment) => {
        comment.childrenLevel = 0;
    });
    //setParentCommentCountFun((preValue) => preValue + data.length); // Mới xóa setParentCommentCountFun trong props
    if (commentArr == null) {
        res = { results: data };
    } else {
        res = { results: [...commentArr, ...data] };
    }
    return res;
};

export default function CommentsContainer() {
    let {
        blog: {
            title,
            comments: { results: commentsArr },
        },
        commentsWrapper,
        setCommentsWrapper,
    } = useContext(BlogContext);

    return (
        <div
            className={
                'dark:bg-[#242f4b] max-sm:w-full fixed ' +
                (commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]') +
                ' duration-700 max-sm:right-0 sm:top-0 w-[50%] min-w-[500px] h-full z-50 bg-white shadow-2xl p-8 overflow-y-auto overflow-x-hidden'
            }
        >
            <div className="relative">
                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-lg mt-2 w-[70%] line-clamp-1">{title}</p>
                <button
                    onClick={() => setCommentsWrapper((preValue) => !preValue)}
                    className="absolute top-0 right-0 flex justify-center items-center w-10 h-10 rounded-full bg-gray-200"
                >
                    <IoClose size={24} className="dark:fill-black" />
                </button>
            </div>
            <hr className="border-1 my-4 w-[120%] -ml-10" />
            <CommentField />

            {commentsArr && commentsArr.length ? (
                commentsArr.map((comment, i) => {
                    return <CommentCard key={i} index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />;
                })
            ) : (
                <NotFound object={'No comments found'} />
            )}
        </div>
    );
}

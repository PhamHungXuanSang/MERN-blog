import { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../pages/ReadBlog';
import { FaRegHeart, FaHeart, FaCommentDots } from 'react-icons/fa';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

export default function BlogAction() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let { blog, setBlog, setCommentsWrapper } = useContext(BlogContext);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        if (currentUser && blog.likes.length > 0) {
            let isUserHasLiked = blog.likes.some((like) => like == currentUser._id);
            setLiked(isUserHasLiked);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const handleLikeBlog = async () => {
        if (!currentUser) {
            return navigate('/sign-in');
        }
        setLiked(!liked);
        // gọi hàm cập nhật lại đã like hoặc dislike và setBlog bằng dữ liệu mới
        try {
            const res = await fetch(`/api/blog/update-like-blog/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blog),
            });
            const result = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                setBlog(result.blog);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return !loading ? (
        <>
            <hr className="border-gray-300 my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-6">
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={handleLikeBlog}
                            className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700 bg-gray-300"
                        >
                            {liked ? <FaHeart color="#ed1a1a" /> : <FaRegHeart />}
                        </button>
                        <p className="text-xl">{blog.likeCount}</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => setCommentsWrapper((preValue) => !preValue)}
                            className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700 bg-gray-300"
                        >
                            <FaCommentDots />
                        </button>
                        <p className="text-xl">{blog.comments?.results?.length}</p>
                    </div>

                    {blog.authorId._id == currentUser?._id && (
                        <Link to={`/editor/${blog.slug}`}>
                            <Button gradientDuoTone="greenToBlue" outline>
                                Edit blog
                            </Button>
                        </Link>
                    )}
                </div>

                <FacebookShareButton url={location.href}>
                    <FacebookIcon size={40} round={true} />
                </FacebookShareButton>
            </div>
            <hr className="border-gray-300 my-2" />
        </>
    ) : (
        <Spinner aria-label="Spinner button example" size="sm" />
    );
}

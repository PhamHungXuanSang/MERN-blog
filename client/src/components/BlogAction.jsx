import { useContext } from 'react';
import { BlogContext } from '../pages/ReadBlog';
import { FaRegHeart, FaHeart, FaCommentDots } from 'react-icons/fa';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function BlogAction() {
    let { blog, setBlog } = useContext(BlogContext);
    const currentUser = useSelector((state) => state.user.currentUser);

    return (
        <>
            <hr className="border-gray-300 my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-6">
                    <div className="flex gap-3 items-center">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700 bg-gray-300">
                            <FaRegHeart />
                        </button>
                        <p className="text-xl">{blog.liked}</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700 bg-gray-300">
                            <FaCommentDots />
                        </button>
                        {/* <p className="text-xl">{blog.liked}</p> */}
                    </div>

                    {blog.authorId._id == currentUser._id && (
                        <Link to={`/editor/${blog._id}`}>
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
    );
}

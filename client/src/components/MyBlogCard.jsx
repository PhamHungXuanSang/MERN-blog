/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import dateToDateAndTime from '../utils/dateToDateAndTime';
import { useState } from 'react';
import ModalConfirm from './ModalConfirm';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice.js';
import toast from 'react-hot-toast';

const BlogStat = ({ likes, comments, viewed }) => {
    return (
        <div className="flex gap-2 max-lg:mb-6 max-lgpb-6 max-lg:border-b">
            <div className="flex items-center w-full h-full justify-center p-4 px-6 text-center">
                <div className="px-4">
                    <p className="text-xl lg:text-2xl">{likes}</p>{' '}
                    <p className="max-lg:text-gray-500 capitalize">likes</p>
                </div>
                <div className="border-l-2 px-4">
                    <p className="text-xl lg:text-2xl">{comments}</p>{' '}
                    <p className="max-lg:text-gray-500 capitalize">comments</p>
                </div>
                <div className="border-l-2 px-4">
                    <p className="text-xl lg:text-2xl">{viewed}</p>{' '}
                    <p className="max-lg:text-gray-500 capitalize">viewed</p>
                </div>
            </div>
        </div>
    );
};

export default function MyBlogCard({ blog, setBlogs }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showStat, setShowStat] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState('');
    const [blogIdToBlock, setBlogIdToBlock] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);

    const handleDeleteBlog = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/blog/delete-blog/${blogIdToDelete}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (!res.ok) {
                toast.error(data.message, { duration: 6000 });
            } else {
                toast.success('Blog has been deleted', { duration: 3000 });
                setBlogs((prev) => prev.filter((blog) => blog._id !== blogIdToDelete));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlockBlog = async () => {
        setShowBlockModal(false);
        try {
            const res = await fetch(`/api/blog/block-blog/${currentUser._id}`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blogId: blogIdToBlock }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (!res.ok) {
                toast.error(data.message, { duration: 6000 });
            } else {
                toast.success(data.message, { duration: 6000 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="flex gap-10 border-b max-md:px-4 border-gray-300 pb-4 px-4 items-center">
                <img
                    src={blog.thumb}
                    alt="blog thumb"
                    className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-gray-300 object-cover"
                />
                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link
                            to={`/blog/${blog.slug}`}
                            className="mb-4 hover:underline text-xl font-semibold max-w-[90%] overflow-x-hidden block"
                        >
                            {blog.title}
                        </Link>
                        <p className="line-clamp-1">
                            Published on{' '}
                            {blog.isUpdated ? dateToDateAndTime(blog.updatedAt) : dateToDateAndTime(blog.createdAt)}
                        </p>
                    </div>
                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog.slug}`} className="pr-4 py-2 underline">
                            Edit
                        </Link>
                        <button className="lg:hidden pr-4 py-2 underline" onClick={() => setShowStat((prev) => !prev)}>
                            Stats
                        </button>
                        <button
                            onClick={() => {
                                setShowModal(true);
                                setBlogIdToDelete(blog._id);
                            }}
                            className="pr-4 py-2 underline text-red-600"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                setShowBlockModal(true);
                                setBlogIdToBlock(blog._id);
                            }}
                            className="pr-4 py-2 underline text-teal-600"
                        >
                            {blog.isBlocked.status ? 'Unlock' : 'Block'}
                        </button>
                    </div>
                </div>
                <div className="max-lg:hidden">
                    <BlogStat likes={blog.likes.length} comments={blog.comments.length} viewed={blog.viewed}></BlogStat>
                </div>
            </div>
            {showStat ? (
                <div className="lg:hidden">
                    <BlogStat likes={blog.likes.length} comments={blog.comments.length} viewed={blog.viewed} />
                </div>
            ) : (
                ''
            )}
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal}
                title={`You definitely want to delete this blog ?`}
                onConfirm={handleDeleteBlog}
                onNoConfirm={() => setShowModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
            <ModalConfirm
                showModal={showBlockModal}
                setShowModal={setShowBlockModal}
                title={
                    blog.isBlocked.status
                        ? `You definitely want to unblock this blog ?`
                        : `You definitely want to block this blog ?`
                }
                onConfirm={handleBlockBlog}
                onNoConfirm={() => setShowBlockModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
        </>
    );
}

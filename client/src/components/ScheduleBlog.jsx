/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import dateToDateAndTime from '../utils/dateToDateAndTime';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import ModalConfirm from './ModalConfirm';
import { signOutSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

export default function ScheduleBlog({ blog, setScheduleBlogs }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [scheduleBlogIdToDelete, setScheduleBlogIdToDelete] = useState('');

    const handleDeleteScheduleBlog = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/scheduleBlog/delete-schedule-blog/${scheduleBlogIdToDelete}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (!res.ok) {
                toast.error(data.message);
            } else {
                toast.success('Schedule blog has been deleted');
                setScheduleBlogs((prev) => prev.filter((blog) => blog._id !== scheduleBlogIdToDelete));
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
                        <p className="line-clamp-1">Blog will be posted on {dateToDateAndTime(blog.postingTime)}</p>
                    </div>
                    <div className="flex gap-6 mt-3">
                        <Link to={`/schedule-editor/${blog.slug}`} className="pr-4 py-2 underline">
                            Edit
                        </Link>
                        <button
                            onClick={() => {
                                setShowModal(true);
                                setScheduleBlogIdToDelete(blog._id);
                            }}
                            className="pr-4 py-2 underline text-red-600"
                        >
                            Delete from schedule
                        </button>
                    </div>
                </div>
            </div>
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal}
                title={`You definitely want to delete this schedule blog ?`}
                onConfirm={handleDeleteScheduleBlog}
                onNoConfirm={() => setShowModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
        </>
    );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import NotFound from './NotFound';
import { Spinner } from 'flowbite-react';
import OneByOneAppearEffect from './OneByOneAppearEffect';
import dateToDateAndTime from '../utils/dateToDateAndTime';

export default function DashRecentlyViewed() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [recentlyBlogs, setRecentlyBlogs] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const getViewedBlogsHistory = async () => {
            setRecentlyBlogs(null);
            try {
                const res = await fetch(`/api/user/get-viewed-blogs-history/${currentUser._id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    navigate('/sign-in');
                }
                if (res.ok) {
                    setRecentlyBlogs(data.viewedBlogsHistory);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getViewedBlogsHistory();
    }, []);

    const handleShowMore = async () => {
        const startIndex = recentlyBlogs.length;
        try {
            const res = await fetch(`/api/user/get-viewed-blogs-history/${currentUser._id}?startIndex=${startIndex}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setRecentlyBlogs((prev) => [...prev, ...data.viewedBlogsHistory]);
                if (recentlyBlogs.length + data.viewedBlogsHistory.length >= data.total) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="py-12 px-4">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">Recently Viewed Blogs</p>
            </div>
            {recentlyBlogs != null ? (
                recentlyBlogs.length == 0 ? (
                    <NotFound object={`You don't have any blog`} />
                ) : (
                    <>
                        {recentlyBlogs.map((blog, i) => (
                            <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                <Link to={`/blog/${blog.blog?.slug}`}>
                                    <div className="border-b p-4 flex gap-4 items-center hover:bg-slate-100 dark:hover:bg-gray-600">
                                        <img src={blog.blog?.thumb} className="w-20 aspect-auto rounded" />
                                        <div className="flex flex-col">
                                            <p>{blog.blog?.title}</p>
                                            <p>Last seen on: {dateToDateAndTime(blog.viewedAt)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </OneByOneAppearEffect>
                        ))}
                        {showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                                Show more
                            </button>
                        )}
                    </>
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
        </div>
    );
}

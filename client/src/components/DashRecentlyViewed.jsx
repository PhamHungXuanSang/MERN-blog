import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import NotFound from './NotFound';
import { Spinner } from 'flowbite-react';
import OneByOneAppearEffect from './OneByOneAppearEffect';
import dateToDateAndTime from '../utils/dateToDateAndTime';
import BackToTopButton from './BackToTopButton.jsx';

export default function DashRecentlyViewed() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [recentlyBlogs, setRecentlyBlogs] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [showMore, setShowMore] = useState(true);
    const [totalBlog, setTotalBlog] = useState(0);

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
                    setTotalBlog(data.total);
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
        <div className="py-8 px-4">
            <div className="flex items-center justify-between w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">Recently Viewed Blogs</p>
                <p>
                    Rows <b>{recentlyBlogs?.length}</b> of <b>{totalBlog}</b>
                </p>
            </div>
            {recentlyBlogs != null ? (
                recentlyBlogs.length == 0 ? (
                    <NotFound object={`You don't have any blog`} />
                ) : (
                    <>
                        {recentlyBlogs.map((blog, i) => (
                            <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                <Link to={`/blog/${blog.blog?.slug}`} className="group">
                                    <div className="border-b p-4 flex gap-8 items-center hover:bg-slate-100 dark:hover:bg-gray-800">
                                        <img
                                            src={blog.blog?.thumb}
                                            className="w-20 aspect-auto rounded group-hover:scale-110 duration-300"
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-xl font-semibold line-clamp-2 break-words duration-100 group-hover:scale-100 w-fit relative before:content-[''] before:absolute before:top-[6%] before:right-[-1px] before:w-0 before:h-[93%] before:rounded-sm before:bg-gradient-to-r before:from-indigo-500 before:from-10% before:via-sky-500 before:via-30% before:to-emerald-500 before:to-90% before:-z-10 before:transition-[0.5s] group-hover:before:left-[1px] group-hover:before:right-auto group-hover:before:w-full">
                                                {blog.blog?.title}
                                            </p>
                                            <p className="text-sm">Last seen on: {dateToDateAndTime(blog.viewedAt)}</p>
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
            <BackToTopButton />
        </div>
    );
}

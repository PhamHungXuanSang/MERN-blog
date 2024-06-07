/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Pagination, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AboutUser from '../components/AboutUser';
import NotFound from '../components/NotFound';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import Blog from '../components/Blog';
import { FaStarHalfAlt, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import InPageNavigation from '../components/InPageNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

export default function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState(null);
    let { username } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [dashProfile, setDashProfile] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleGetUserProfile = async () => {
        try {
            const res = await fetch(`/api/user/profile/${username}?page=${currentPage}&&limit=2`, {
                method: 'GET',
            });
            if (res.status == 404) {
                return navigate('*');
            }
            const userProfile = await res.json();
            setBlogs(userProfile.blogs);
            setDashProfile(userProfile);
        } catch (error) {
            console.log(error);
        }
    };

    const getSubscribedStatus = async () => {
        try {
            const res = await fetch(`/api/user/get-subscribed-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id, authorName: username }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status == 200) {
                setIsSubscribed(data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetUserProfile();
        if (currentUser) {
            getSubscribedStatus();
        }
    }, [currentPage]);

    const onPageChange = (page) => {
        if (currentPage != page) {
            setBlogs(null);
            setCurrentPage(page);
        }
    };

    let totalLike = 0;
    dashProfile?.allBlogs?.forEach((blog) => {
        totalLike += blog.likes.length;
    });

    let allAverageRating = 0;
    let numberBlogsReviewed = 0;
    dashProfile?.allBlogs?.forEach((blog) => {
        if (blog.averageRating > 0) {
            numberBlogsReviewed++;
            allAverageRating += blog.averageRating;
        }
    });
    allAverageRating = allAverageRating / numberBlogsReviewed;

    const handleToggleSubscribe = async () => {
        isSubscribed
            ? toast.success('Unsubscribed', { duration: 1000 })
            : toast.success('Subscribed', { duration: 1000 });
        setIsSubscribed((prev) => !prev);
        try {
            const res = await fetch(`/api/user/toggle-subscribe/${dashProfile?.user._id}/${currentUser._id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status !== 200) {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-cover flex justify-center gap-4 container mx-auto py-8">
            <div className="w-full md:max-w-[68%]">
                <InPageNavigation routes={[`${username} blogs`, 'user profile']} defaultHidden={[`user profile`]}>
                    <>
                        {blogs != null ? (
                            blogs.length == 0 ? (
                                <NotFound object={`Not found blog written by ${username}`} />
                            ) : (
                                <>
                                    {blogs.map((blog, i) => (
                                        <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.12 }} key={i}>
                                            <Blog key={i} content={blog} author={blog.authorId} />
                                        </OneByOneAppearEffect>
                                    ))}
                                    <Pagination
                                        className="text-center mt-4"
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(dashProfile?.allBlogs.length / 2)}
                                        onPageChange={onPageChange}
                                        previousLabel=""
                                        nextLabel=""
                                        showIcons
                                    />
                                </>
                            )
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="xl" />
                        )}
                    </>

                    <div className="text-center">
                        {dashProfile?.user == null ? (
                            <Spinner className="block mx-auto mt-4" size="xl" />
                        ) : (
                            <>
                                <img
                                    src={dashProfile?.user.userAvatar}
                                    alt="Ảnh profile"
                                    className="rounded-full w-32 h-32 object-cover block mx-auto"
                                />
                                <b className="text-xl font-medium break-words">@{dashProfile?.user.username}</b>
                                <span className="block mb-4 leading-2 line-clamp-3 break-words">
                                    {dashProfile?.user.email}
                                </span>
                                <AboutUser
                                    className="max-md:text-center"
                                    userDesc={dashProfile?.user.userDesc}
                                    youtubeLink={dashProfile?.user.youtubeLink}
                                    facebookLink={dashProfile?.user.facebookLink}
                                    tiktokLink={dashProfile?.user.tiktokLink}
                                    githubLink={dashProfile?.user.githubLink}
                                    createdAt={dashProfile?.user.createdAt}
                                />
                                <>
                                    {currentUser && username != currentUser.username ? (
                                        !isSubscribed ? (
                                            <Button
                                                gradientMonochrome="lime"
                                                onClick={handleToggleSubscribe}
                                                className="mx-auto my-2"
                                            >
                                                <FaUserPlus className="mr-2 h-5 w-5" />
                                                Subscribe
                                            </Button>
                                        ) : (
                                            <Button
                                                gradientMonochrome="failure"
                                                outline
                                                onClick={handleToggleSubscribe}
                                                className="opacity-50 mx-auto my-2"
                                            >
                                                <FaUserMinus className="mr-2 h-5 w-5" />
                                                Unsubscribe
                                            </Button>
                                        )
                                    ) : null}
                                </>
                                <div className="flex flex-wrap gap-2 mt-6">
                                    <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                        {dashProfile?.allBlogs.length} Blogs
                                    </i>
                                    <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                        {dashProfile?.totalViews} Views
                                    </i>
                                    <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                        {dashProfile?.user?.subscribeUsers.length} Subscriber
                                    </i>
                                    <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                        {totalLike} Likes
                                    </i>
                                    {!isNaN(Number(allAverageRating.toFixed(1))) && (
                                        <i className="flex items-center gap-1 border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                            {Number(allAverageRating.toFixed(1))} <FaStarHalfAlt />
                                            Average Rating
                                        </i>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </InPageNavigation>
            </div>

            <div className="max-w-[30%] border-l border-gray-300 pl-4 pt-3 max-md:hidden">
                <div className="text-center">
                    {dashProfile?.user == null ? (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    ) : (
                        <>
                            <img
                                src={dashProfile?.user.userAvatar}
                                alt="Ảnh profile"
                                className="rounded-full w-32 h-32 object-cover block mx-auto"
                            />
                            <b className="text-xl font-medium break-words">@{dashProfile?.user.username}</b>
                            <span className="block mb-4 leading-2 line-clamp-3 break-words">
                                {dashProfile?.user.email}
                            </span>
                            <AboutUser
                                className="max-md:hidden"
                                userDesc={dashProfile?.user.userDesc}
                                youtubeLink={dashProfile?.user.youtubeLink}
                                facebookLink={dashProfile?.user.facebookLink}
                                tiktokLink={dashProfile?.user.tiktokLink}
                                githubLink={dashProfile?.user.githubLink}
                                createdAt={dashProfile?.user.createdAt}
                            />
                            <>
                                {currentUser && username != currentUser.username ? (
                                    !isSubscribed ? (
                                        <Button
                                            gradientMonochrome="lime"
                                            onClick={handleToggleSubscribe}
                                            className="mx-auto my-2"
                                        >
                                            <FaUserPlus className="mr-2 h-5 w-5" />
                                            Subscribe
                                        </Button>
                                    ) : (
                                        <Button
                                            gradientMonochrome="failure"
                                            outline
                                            onClick={handleToggleSubscribe}
                                            className="opacity-50 mx-auto my-2"
                                        >
                                            <FaUserMinus className="mr-2 h-5 w-5" />
                                            Unsubscribe
                                        </Button>
                                    )
                                ) : null}
                            </>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                    {dashProfile?.allBlogs.length} Blogs
                                </i>
                                <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                    {dashProfile?.totalViews} Views
                                </i>
                                <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                    {dashProfile?.user?.subscribeUsers.length} Subscriber
                                </i>
                                <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                    {totalLike} Likes
                                </i>
                                {!isNaN(Number(allAverageRating.toFixed(1))) && (
                                    <i className="flex items-center gap-1 border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                        {Number(allAverageRating.toFixed(1))} <FaStarHalfAlt />
                                        Average Rating
                                    </i>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

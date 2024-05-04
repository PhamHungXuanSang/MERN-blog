/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'flowbite-react';
import { signOutSuccess } from '../redux/user/userSlice';
import Blog from './Blog';
import OneByOneAppearEffect from './OneByOneAppearEffect';
import formatDate from '../utils/formatDate.js';
import { FaStarHalfAlt } from 'react-icons/fa';
import InPageNavigation from './InPageNavigation.jsx';
import { MdVerifiedUser } from 'react-icons/md';

export default function DashProfile() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [dashProfile, setDashProfile] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getUserDashProfile = async () => {
            try {
                const res = await fetch(`/api/user/profile/${currentUser.username}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                } else if (res.status === 200) {
                    setDashProfile(await res.json());
                }
            } catch (error) {
                console.log(error);
            }
        };

        getUserDashProfile();
    }, []);

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

    return (
        <section className="h-cover flex justify-center gap-4 container mx-auto py-8">
            <div className="w-full md:max-w-[68%]">
                <InPageNavigation routes={['Blogs Pushlish', 'User Profile']} defaultHidden={['User Profile']}>
                    <>
                        {dashProfile?.blogs?.length > 0 &&
                            dashProfile.blogs.map((blog, i) => {
                                return (
                                    <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.12 }} key={i}>
                                        <Blog key={i} content={blog} author={blog.authorId} />
                                    </OneByOneAppearEffect>
                                );
                            })}
                    </>
                    <div className="text-center mt-4">
                        <img
                            src={
                                currentUser.userAvatar ||
                                '../../public/user-profile-icon-vector-avatar.webp'
                            }
                            alt="Ảnh profile"
                            className="rounded-full w-32 h-32 object-cover block mx-auto"
                        />
                        <b className="block my-3">@{currentUser.username}</b>
                        <div className="flex gap-1 w-fit mx-auto">
                            <span className="block mb-4 line-clamp-2 break-words w-fit mx-auto">
                                {currentUser.email}
                            </span>
                            <MdVerifiedUser fill="green" size={22} />
                        </div>
                        <i className="block my-3 leading-2 line-clamp-3 break-words">
                            {currentUser.userDesc || 'No description about this account'}
                        </i>
                        <span className="flex flex-wrap gap-2 mt-6">
                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                {dashProfile?.allBlogs.length} Blogs
                            </i>
                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                {dashProfile?.totalViews} Views
                            </i>
                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                {dashProfile?.user?.subscribeUsers.length} Subscriber
                            </i>
                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">{totalLike} Likes</i>
                            <i className="flex items-center gap-1 border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                {Number(allAverageRating.toFixed(1))} <FaStarHalfAlt />
                                Average Rating
                            </i>
                        </span>
                        <i
                            className="block mt-2 mb-4 text-gray-500 text-
                        md"
                        >
                            Joined on {formatDate(currentUser.createdAt)}
                        </i>
                        <div className="block text-center">
                            <Link to="/dash-board?tab=update-profile" className="block w-fit mx-auto text-center">
                                <Button gradientDuoTone="greenToBlue" outline>
                                    Update Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </InPageNavigation>
            </div>

            <div className="max-w-[30%] border-l border-gray-300 pl-4 pt-3 max-md:hidden">
                <div className="text-center">
                    <img
                        src={
                            currentUser.userAvatar ||
                            '../../public/user-profile-icon-vector-avatar.webp'
                        }
                        alt="Ảnh profile"
                        className="rounded-full w-32 h-32 object-cover block mx-auto"
                    />
                    <b className="block my-3">@{currentUser.username}</b>
                    <div className="flex gap-1 w-fit mx-auto">
                        <span className="block mb-4 line-clamp-2 break-words w-fit mx-auto">{currentUser.email}</span>
                        {currentUser.emailVerified.verifiedAt && <MdVerifiedUser fill="green" size={22} />}
                    </div>
                    <i className="block my-3 leading-2 line-clamp-3 break-words">
                        {currentUser.userDesc || 'No description about this account'}
                    </i>
                    <span className="flex flex-wrap gap-2 mt-6">
                        <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                            {dashProfile?.allBlogs.length} Blogs
                        </i>
                        <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                            {dashProfile?.totalViews} Views
                        </i>
                        <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                            {dashProfile?.user?.subscribeUsers.length} Subscriber
                        </i>
                        <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">{totalLike} Likes</i>
                        <i className="flex items-center gap-1 border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                            {Number(allAverageRating.toFixed(1))} <FaStarHalfAlt />
                            Average Rating
                        </i>
                    </span>
                    <i
                        className="block mt-2 mb-4 text-gray-500 text-
                        md"
                    >
                        Joined on {formatDate(currentUser.createdAt)}
                    </i>
                    <div className="block text-center">
                        <Link to="/dash-board?tab=update-profile" className="block w-fit mx-auto text-center">
                            <Button gradientDuoTone="greenToBlue" outline>
                                Update Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

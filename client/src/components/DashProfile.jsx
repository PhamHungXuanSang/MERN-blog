/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'flowbite-react';
import { signOutSuccess } from '../redux/user/userSlice';
import Blog from './Blog';
import OneByOneAppearEffect from './OneByOneAppearEffect';
import formatDate from '../utils/formatDate.js';

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

    let totalViewed = 0;
    dashProfile?.blogs?.forEach((blog) => {
        totalViewed += blog.viewed;
    });

    return (
        <div className="flex py-12 px-4">
            <div className="h-full w-[70%] pr-4">
                <div className="w-full h-fit border-b-2 border-neutral-300">
                    <p className="font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block">
                        Blogs Pushlish
                    </p>
                </div>

                {dashProfile?.blogs?.length > 0 &&
                    dashProfile.blogs.map((blog, i) => {
                        return (
                            <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.12 }} key={i}>
                                <Blog key={i} content={blog} author={blog.authorId} />
                            </OneByOneAppearEffect>
                        );
                    })}
            </div>
            <div className="border-l-2 w-[30%] h-full p-4">
                <div className="text-center">
                    <img
                        src={
                            currentUser.userAvatar ||
                            'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg'
                        }
                        alt="Ảnh profile"
                        className={'rounded-full w-32 h-32 object-cover inline'}
                    />
                    <b className="block my-3">@{currentUser.username}</b>
                    <span className="block mb-4">{currentUser.email}</span>
                    <i className="block my-3">{currentUser.userDesc || 'No description about this account'}</i>
                    <span className="block mt-8">
                        {dashProfile?.blogs?.length} Blogs - {totalViewed} Views
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
        </div>
    );
}

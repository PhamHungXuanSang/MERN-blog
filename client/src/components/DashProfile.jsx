import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'flowbite-react';
import { signOutSuccess } from '../redux/user/userSlice';
import Blog from './Blog';
import OneByOneAppearEffect from './OneByOneAppearEffect';

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
                    navigate('/sign-in');
                } else if (res.status === 200) {
                    setDashProfile(await res.json());
                } else if (res.status === 201) {
                    const returnToken = await res.json();
                    document.cookie = `access_token=${returnToken.newToken}`;
                    document.cookie = `refresh_token=${returnToken.refToken}`;
                    getUserDashProfile();
                }
            } catch (error) {
                console.log(error);
            }
        };

        getUserDashProfile();
    }, []);

    const formatDate = (dateString) => {
        const options = { timeZone: 'Asia/Ho_Chi_Minh' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        const date = new Date(formattedDate);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return `${day < 10 ? '0' + day : day} ${months[monthIndex]} ${year}`;
    };

    let totalViewed = 0;
    dashProfile?.blogs?.forEach((blog) => {
        totalViewed += blog.viewed;
    });

    return (
        <div className="w-[85.5%] flex py-12 px-4">
            <div className="h-full w-[70%] px-4">
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
                </div>
                <i className="block my-3">{currentUser.userDesc || 'No description about this account'}</i>
                <span className="block mt-8">
                    {dashProfile?.blogs?.length} Blogs - {totalViewed} Views
                </span>
                <i className="block mt-2 mb-4 text-gray-500 text-md">Joined on {formatDate(currentUser.createdAt)}</i>
                <Link to="/dash-board?tab=update-profile">
                    <Button gradientDuoTone="greenToBlue" outline>
                        Update Profile
                    </Button>
                </Link>
            </div>
        </div>
    );
}

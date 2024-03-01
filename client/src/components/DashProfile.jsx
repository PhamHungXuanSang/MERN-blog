import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'flowbite-react';
import { SlLike } from 'react-icons/sl';
import { GrView } from 'react-icons/gr';
import { signOutSuccess } from '../redux/user/userSlice';

export default function DashProfile() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [dashProfile, setDashProfile] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getUserDashProfile = async () => {
            try {
                const res = await fetch(`/api/user/profile/${currentUser._id}`, {
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

        return `${day} ${months[monthIndex]} ${year}`;
    };

    return (
        <div className="w-[85.5%] flex py-12 px-4">
            <div className="h-full w-[70%] px-4">
                <div className="w-full h-fit border-b-2 border-neutral-300">
                    <p className="border-b-2 text-lg w-fit py-2 px-4">Blogs Pushlish</p>
                </div>

                {dashProfile?.allBlogsOfUser.length > 0 && (
                    <div className="border-b-2 w-full h-fit bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-800 mt-4 p-3">
                        <div className="flex items-center">
                            <img
                                src={
                                    dashProfile?.userInfo.userAvatar ||
                                    'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg'
                                }
                                alt="Ảnh thumb blog"
                                className={'rounded-full w-8 h-8 object-cover'}
                            />
                            <b className="text-md ml-3">@{dashProfile?.userInfo.username}</b>
                            <i className="text-sm text-gray-500 ml-3">21 February 2024</i>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="max-w-[80%]">
                                <h1 className="text-2xl mb-2 font-bold">{dashProfile?.allBlogsOfUser[0].title}</h1>
                                <h2 className="truncate">
                                    {dashProfile?.allBlogsOfUser[0].content[0].blocks[0].data.text}
                                </h2>
                            </div>
                            <img
                                src={dashProfile?.allBlogsOfUser[0].thumb}
                                alt="Ảnh thumb blog"
                                className={'rounded w-24 h-24 object-cover'}
                            />
                        </div>
                        <div className="flex items-center justify-start mt-2">
                            <div className="rounded-full w-fit h-fit py-1 px-2 bg-slate-200 dark:bg-slate-500 font-semibold">
                                Category
                            </div>
                            <SlLike className="ml-6 mr-2" />
                            <p>{dashProfile?.allBlogsOfUser[0].liked}</p>
                            <GrView className="ml-6 mr-2" />
                            <p>{dashProfile?.allBlogsOfUser[0].viewed}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="border-l-2 h-full py-12 px-8">
                <img
                    src={
                        dashProfile?.userInfo.userAvatar ||
                        'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg'
                    }
                    alt="Ảnh profile"
                    className={`rounded-full w-32 h-32 object-cover`}
                />
                <b className="block my-3">@{dashProfile?.userInfo.username}</b>
                <span className="block mb-4">{dashProfile?.userInfo.email}</span>
                <i className="block my-3">{dashProfile?.userInfo.userDesc || 'No description about this account'}</i>
                <span className="block mt-8">
                    {dashProfile?.totalBlogs} Blogs - {dashProfile?.totalViews} Views
                </span>
                <i className="block mt-2 mb-4 text-gray-500 text-md">
                    Joined on {formatDate(dashProfile?.userInfo.createdAt)}
                </i>
                <Link to="/dash-board?tab=update-profile">
                    <Button gradientDuoTone="greenToBlue" outline>
                        Update Profile
                    </Button>
                </Link>
            </div>
        </div>
    );
}

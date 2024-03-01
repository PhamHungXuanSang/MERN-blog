// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';
import Blog from '../components/Blog';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';

export default function Home() {
    const [blogInfo, setBlogInfo] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const getAllBlog = async () => {
    //         try {
    //             const res = await fetch('/api/blog/allblog', {
    //                 method: 'GET',
    //                 headers: { 'Content-Type': 'application/json' },
    //             });

    //             if (res.status === 403) {
    //                 dispatch(signOutSuccess());
    //                 navigate('/sign-in');
    //             } else if (res.status === 200) {
    //                 setBlogInfo(await res.json());
    //             } else if (res.status === 201) {
    //                 const returnToken = await res.json();
    //                 document.cookie = `access_token=${returnToken.newToken}`;
    //                 document.cookie = `refresh_token=${returnToken.refToken}`;
    //                 getAllBlog();
    //             }

    //             // if (res.status === 403) {
    //             //     // Khoong cos quyeenf truy caapj neen batws login lai
    //             //     navigate('/sign-in');

    //             //     // Token hết hạn
    //             //     // const refreshRes = await fetch('/api/user/refreshToken', {
    //             //     //     method: 'GET',
    //             //     //     headers: { 'Content-Type': 'application/json' },
    //             //     // });
    //             //     const returnToken = await res.json();
    //             //     document.cookie = `access_token=${returnToken.token}`;
    //             //     document.cookie = `refresh_token=${returnToken.refToken}`;
    //             //     if (res.ok) {
    //             //         getAllBlog();
    //             //     }
    //             // } else if (res.status === 401) {
    //             //     setBlogInfo(null);
    //             // } else {
    //             //     const data = await res.json();
    //             //     setBlogInfo(data);
    //             // }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     getAllBlog();
    //     ////////// Xem lại cái thời gian hết hạn mới của refresh token phải bằng cái cũ chứ không phải tăng lên
    // }, []);

    return (
        <section className="container mx-auto h-screen flex justify-center gap-10">
            {/* latest blog */}
            <div className="w-full flex py-12 px-4">
                <div className="h-full w-[70%] px-4">
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p
                            onClick={() => setActiveTab('home')}
                            className={`${activeTab == 'home' ? 'border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6]' : 'text-gray-500'} text-lg w-fit py-2 px-4 inline-block cursor-pointer`}
                        >
                            Home
                        </p>
                        <p
                            onClick={() => setActiveTab('trending')}
                            className={`${activeTab == 'trending' ? 'border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6]' : 'text-gray-500'} text-lg w-fit py-2 px-4 inline-block cursor-pointer`}
                        >
                            Trending Blog
                        </p>
                    </div>

                    {activeTab == 'home' ? <h1>Hello Home</h1> : <h1>Hello Trending</h1>}

                    {/* {dashProfile?.allBlogsOfUser.length > 0 && (
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
                                        <h1 className="text-2xl mb-2 font-bold">
                                            {dashProfile?.allBlogsOfUser[0].title}
                                        </h1>
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
                        )} */}
                </div>
                <div className="border-l-2 h-full py-12 px-8"></div>
            </div>
            {/* filter and trending blog */}
        </section>
    );
}

import { Pagination, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AboutUser from '../components/AboutUser';
import NotFound from '../components/NotFound';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import Blog from '../components/Blog';
import { FaStarHalfAlt } from 'react-icons/fa';
import InPageNavigation from '../components/InPageNavigation';

export default function UserProfile() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [blogs, setBlogs] = useState(null);
    let { username } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [dashProfile, setDashProfile] = useState(null);

    const handleGetUserProfile = async () => {
        try {
            const res = await fetch(`/api/user/profile/${username}?page=${currentPage}&&limit=2`, {
                method: 'GET',
            });
            if (res.status == 404) {
                return navigate('*');
            }
            const userProfile = await res.json();
            setUserProfile(userProfile.user);
            setBlogs(userProfile.blogs);
            setDashProfile(userProfile);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetUserProfile();
    }, [currentPage]);

    const onPageChange = (page) => {
        setBlogs(null);
        setCurrentPage(page);
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

    return (
        // <section className="container mx-auto py-12 min-h-screen md:flex flex-row-reverse items-start gap-4">
        //     <div className="flex flex-col max-md:items-center gap-2 min-w-[250px] md:w-[50%] md:pl-4 md:border-l border-gray-300 md:sticky md:top-[100px] md:py-10">
        //         {userProfile == null ? (
        //             <Spinner className="block mt-4" size="lg" />
        //         ) : (
        //             <>
        //                 <img
        //                     src={userProfile.userAvatar}
        //                     className="w-48 h-48 bg-gray-300 rounded-full md:w-32 md:h-32"
        //                 />
        //                 <h1 className="text-xl font-medium break-words">@{userProfile.username}</h1>
        //                 <p className="text-lg break-words">{userProfile.email}</p>
        //                 {/* <p>
        //                     {totalBlogs} Blogs - {totalViews} Views
        //                 </p> */}
        //                 <AboutUser
        //                     className="max-md:hidden"
        //                     userDesc={userProfile.userDesc}
        //                     youtubeLink={userProfile.youtubeLink}
        //                     facebookLink={userProfile.facebookLink}
        //                     tiktokLink={userProfile.tiktokLink}
        //                     githubLink={userProfile.githubLink}
        //                     createdAt={userProfile.createdAt}
        //                 />
        //                 <span className="flex flex-wrap gap-2 mt-6">
        //                     <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
        //                         {dashProfile?.allBlogs.length} Blogs
        //                     </i>
        //                     <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
        //                         {dashProfile?.totalViews} Views
        //                     </i>
        //                     <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
        //                         {dashProfile?.user?.subscribeUsers.length} Subscriber
        //                     </i>
        //                     <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">{totalLike} Likes</i>
        //                     <i className="flex items-center gap-1 border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
        //                         {Number(allAverageRating.toFixed(1))} <FaStarHalfAlt />
        //                         Average Rating
        //                     </i>
        //                 </span>
        //             </>
        //         )}
        //     </div>
        //     <div className="max-md:mt-12 w-full">
        //         <div className="w-full h-fit border-b-2 border-neutral-300">
        //             <p
        //                 className={`font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block`}
        //             >
        //                 All blogs are written by {username}
        //             </p>
        //         </div>

        //         {blogs != null ? (
        //             blogs.length == 0 ? (
        //                 <NotFound object={`Not found blog written by ${username}`} />
        //             ) : (
        //                 <>
        //                     {blogs.map((blog, i) => (
        //                         <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.12 }} key={i}>
        //                             <Blog key={i} content={blog} author={blog.authorId} />
        //                         </OneByOneAppearEffect>
        //                     ))}
        //                     <Pagination
        //                         className="text-center mt-4"
        //                         currentPage={currentPage}
        //                         totalPages={Math.ceil(dashProfile?.allBlogs.length / 2)}
        //                         onPageChange={onPageChange}
        //                         showIcons
        //                     />
        //                 </>
        //             )
        //         ) : (
        //             <Spinner className="block mx-auto mt-4" size="xl" />
        //         )}
        //     </div>
        // </section>
        <section className="h-cover flex justify-center gap-4 container mx-auto py-8">
            <div className="w-full md:max-w-[70%]">
                <InPageNavigation routes={[`${username} blogs`, 'user profile']} defaultHidden={['user profile']}>
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
                                        showIcons
                                    />
                                </>
                            )
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="xl" />
                        )}
                    </>

                    <>
                        {userProfile == null ? (
                            <Spinner className="block mt-4" size="lg" />
                        ) : (
                            <>
                                <img
                                    src={userProfile.userAvatar}
                                    className="w-48 h-48 bg-gray-300 rounded-full md:w-32 md:h-32"
                                />
                                <h1 className="text-xl font-medium break-words">@{userProfile.username}</h1>
                                <p className="text-lg break-words">{userProfile.email}</p>
                                <AboutUser
                                    className="max-md:text-center"
                                    userDesc={userProfile.userDesc}
                                    youtubeLink={userProfile.youtubeLink}
                                    facebookLink={userProfile.facebookLink}
                                    tiktokLink={userProfile.tiktokLink}
                                    githubLink={userProfile.githubLink}
                                    createdAt={userProfile.createdAt}
                                />
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
                                    <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                        {totalLike} Likes
                                    </i>
                                    <i className="flex items-center gap-1 border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                        {Number(allAverageRating.toFixed(1))} <FaStarHalfAlt />
                                        Average Rating
                                    </i>
                                </span>
                            </>
                        )}
                    </>
                </InPageNavigation>
            </div>

            <div className="max-w-[30%] border-l border-gray-300 pl-4 pt-3 max-md:hidden">
                {userProfile == null ? (
                    <Spinner className="block mt-4" size="lg" />
                ) : (
                    <>
                        <img
                            src={userProfile.userAvatar}
                            className="w-48 h-48 bg-gray-300 rounded-full md:w-32 md:h-32"
                        />
                        <h1 className="text-xl font-medium break-words">@{userProfile.username}</h1>
                        <p className="text-lg break-words">{userProfile.email}</p>
                        <AboutUser
                            className="max-md:hidden"
                            userDesc={userProfile.userDesc}
                            youtubeLink={userProfile.youtubeLink}
                            facebookLink={userProfile.facebookLink}
                            tiktokLink={userProfile.tiktokLink}
                            githubLink={userProfile.githubLink}
                            createdAt={userProfile.createdAt}
                        />
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
                    </>
                )}
            </div>
        </section>
    );
}

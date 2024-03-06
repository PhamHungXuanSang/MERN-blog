import { Pagination, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AboutUser from '../components/AboutUser';
import NotFound from '../components/NotFound';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import Blog from '../components/Blog';

export default function UserProfile() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [blogs, setBlogs] = useState(null);
    let { username } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(1);
    const [totalViews, setTotalViews] = useState(0);
    const limit = 2;

    const handleGetUserProfile = async () => {
        try {
            const res = await fetch(`/api/user/profile/${username}?page=${currentPage}&&limit=${limit}`, {
                method: 'GET',
            });
            if (res.status == 400) {
                // Khoong thaays username
                navigate('*');
            }
            const userProfile = await res.json();
            setUserProfile(userProfile.user);
            setBlogs(userProfile.blogs);
            setTotalBlogs(userProfile.total);
            setTotalViews(userProfile.totalViews);
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

    return (
        <section className="container mx-auto pt-12 h-full md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-gray-300 md:sticky md:top-[100px] md:py-10">
                {userProfile == null ? (
                    <Spinner className="block mt-4" size="lg" />
                ) : (
                    <>
                        <img
                            src={userProfile.userAvatar}
                            className="w-48 h-48 bg-gray-300 rounded-full md:w-32 md:h-32"
                        />
                        <h1 className="text-2xl font-medium">@{userProfile.username}</h1>
                        <p className="text-xl h-6">{userProfile.email}</p>
                        <p>
                            {totalBlogs.toLocaleString()} Blogs - {totalViews.toLocaleString()} Views
                        </p>
                        <AboutUser
                            className="max-md:hidden"
                            userDesc={userProfile.userDesc}
                            youtubeLink={userProfile.youtubeLink}
                            facebookLink={userProfile.facebookLink}
                            tiktokLink={userProfile.tiktokLink}
                            githubLink={userProfile.githubLink}
                            createdAt={userProfile.createdAt}
                        />
                    </>
                )}
            </div>
            <div className="max-md:mt-12 w-full">
                <div className="w-full h-fit border-b-2 border-neutral-300">
                    <p
                        className={`font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block`}
                    >
                        All blogs are written by {username}
                    </p>
                </div>

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
                                totalPages={Math.ceil(totalBlogs / limit)}
                                onPageChange={onPageChange}
                                showIcons
                            />
                        </>
                    )
                ) : (
                    <Spinner className="block mx-auto mt-4" size="xl" />
                )}
            </div>
        </section>
    );
}

import { useEffect, useState } from 'react';
import Blog from '../components/Blog';
import { Button, Spinner, Pagination, Carousel } from 'flowbite-react';
import BlogMini from '../components/BlogMini';
import { TbTrendingUp } from 'react-icons/tb';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FaStarHalfAlt, FaArrowRight } from 'react-icons/fa';
import NotFound from '../components/NotFound';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import OneByOneAppearFromRightEffect from '../components/OneByOneAppearFromRightEffect';
import InPageNavigation from '../components/InPageNavigation';
import BlogTopRated from '../components/BlogTopRated';
import { Link } from 'react-router-dom';
import { SlNote } from 'react-icons/sl';
import BackToTopButton from '../components/BackToTopButton';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { useSelector } from 'react-redux';

export default function Home() {
    const [activeTab, setActiveTab] = useState('all category');
    const [activeCate, setActiveCate] = useState('');
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [topRatedBlogs, setTopRatedBlogs] = useState(null);
    const [topAuthors, setTopAuthors] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [allCate, setAllCate] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [authors, setAuthors] = useState(null);
    const limit = 5;

    const handleGetLatestBlogs = async () => {
        try {
            const res = await fetch(`/api/blog/latest-blogs?page=${currentPage}&&limit=${limit}`, {
                method: 'GET',
            });
            const data = await res.json();
            setBlogs(data.blogs);
            setTotalPage(data.total);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetAllCategoryTrendingHightestRatedBlogs = async () => {
        try {
            const res = await fetch('/api/blog/trending-hightest-rated-blogs', {
                method: 'GET',
            });
            const data = await res.json();
            setTrendingBlogs(data.trendingBlogs);
            setTopRatedBlogs(data.topRatedBlogs);
            setAllCate(data.allCates);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetTopAuthors = async () => {
        try {
            const res = await fetch(`/api/user/get-top-authors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 3, startIndex: 0 }),
            });
            const data = await res.json();
            setTopAuthors(data.topAuthors);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetUserSubscribeAuthor = async () => {
        const res = await fetch('/api/user/get-user-subscribe-authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser._id }),
        });
        const data = await res.json();
        setAuthors(data.authors);
        console.log(data.authors);
    };

    const handleGetBlogsByCate = async (cate) => {
        try {
            const res = await fetch(`/api/blog/category/${cate}?page=${currentPage}&&limit=${limit}`, {
                method: 'GET',
            });
            const data = await res.json();
            setBlogs(data.blogs);
            setTotalPage(data.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (activeTab == 'all category') {
            handleGetLatestBlogs();
        } else {
            handleGetBlogsByCate(activeTab);
        }
    }, [activeTab, currentPage]);

    useEffect(() => {
        handleGetAllCategoryTrendingHightestRatedBlogs();
        handleGetTopAuthors();
        if (currentUser) {
            handleGetUserSubscribeAuthor();
        }
    }, []);

    const loadBlogByCategory = async (e) => {
        let cate = e.target.innerText.toLowerCase();

        setBlogs(null);
        setTotalPage(1);

        if (activeTab == cate) {
            setActiveCate('');
            setCurrentPage(1);
            setActiveTab('all category');
        } else {
            setActiveCate(cate);
            setCurrentPage(1);
            setActiveTab(cate);
        }
    };

    const onPageChange = (page) => {
        setBlogs(null);
        setCurrentPage(page);
    };

    return (
        <section className="h-cover container mx-auto py-8">
            <div className="flex justify-center gap-4 min-h-screen">
                <div className="w-full md:max-w-[68%]">
                    <InPageNavigation routes={['home', 'Propose']} defaultHidden={['Propose']}>
                        <>
                            {blogs != null ? (
                                <>
                                    <div className="flex flex-col gap-2 my-4 md:hidden">
                                        <div className="flex items-center">
                                            <h1 className="font-medium text-xl mr-1">View by Category</h1>
                                            <BiSolidCategoryAlt />
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {allCate?.map((cate, i) => {
                                                return (
                                                    <OneByOneAppearFromRightEffect
                                                        transition={{ duration: 1, delay: i * 0.03 }}
                                                        key={i}
                                                    >
                                                        <Button
                                                            gradientDuoTone="greenToBlue"
                                                            key={i}
                                                            outline={
                                                                activeCate == cate.categoryName.toLowerCase()
                                                                    ? false
                                                                    : true
                                                            }
                                                            onClick={loadBlogByCategory}
                                                        >
                                                            {cate.categoryName.toUpperCase()}
                                                        </Button>
                                                    </OneByOneAppearFromRightEffect>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {blogs.length == 0 ? (
                                        <NotFound object={`Not found blog by ${activeCate} category`} />
                                    ) : (
                                        <>
                                            {blogs.map((blog, i) => (
                                                <OneByOneAppearEffect
                                                    transition={{ duration: 1, delay: i * 0.12 }}
                                                    key={i}
                                                >
                                                    <Blog key={i} content={blog} author={blog.authorId} />
                                                </OneByOneAppearEffect>
                                            ))}
                                            <Pagination
                                                className="text-center mt-4"
                                                currentPage={currentPage}
                                                totalPages={Math.ceil(totalPage / limit)}
                                                onPageChange={onPageChange}
                                                previousLabel=""
                                                nextLabel=""
                                                showIcons
                                            />
                                        </>
                                    )}
                                </>
                            ) : (
                                <Spinner className="block mx-auto mt-4" size="xl" />
                            )}
                        </>

                        <>
                            <div className="my-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="font-medium text-xl mr-1">Trending blogs</h1>
                                    <TbTrendingUp />
                                </div>
                                {trendingBlogs != null ? (
                                    trendingBlogs.length == 0 ? (
                                        <NotFound object={'Not found trending blog'} />
                                    ) : (
                                        <Carousel pauseOnHover>
                                            {trendingBlogs.map((blog, i) => (
                                                <BlogMini key={i} index={i} content={blog} author={blog.authorId} />
                                            ))}
                                        </Carousel>
                                    )
                                ) : (
                                    <Spinner className="block mx-auto mt-4" size="lg" />
                                )}
                            </div>
                            <div className="my-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="font-medium text-xl mr-1">Highest rated blogs</h1>
                                    <FaStarHalfAlt />
                                </div>
                                {topRatedBlogs != null ? (
                                    topRatedBlogs.length == 0 ? (
                                        <NotFound object={'Not found any rated blog'} />
                                    ) : (
                                        topRatedBlogs.map((blog, i) => (
                                            <BlogTopRated key={i} content={blog} index={i} />
                                        ))
                                    )
                                ) : (
                                    <Spinner className="block mx-auto mt-4" size="lg" />
                                )}
                            </div>
                        </>
                    </InPageNavigation>
                </div>

                <div className="max-w-[30%] border-l border-gray-300 pl-4 max-md:hidden">
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-2 mb-4 p-4 rounded-3xl dark:bg-slate-800 bg-slate-200">
                            <div className="flex items-center">
                                <h1 className="font-medium text-xl mr-1 text-green-400">View by Category</h1>
                                <BiSolidCategoryAlt fill="green" />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {allCate?.map((cate, i) => {
                                    return (
                                        <OneByOneAppearFromRightEffect
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            key={i}
                                        >
                                            <Button
                                                gradientDuoTone="greenToBlue"
                                                key={i}
                                                outline={activeCate == cate.categoryName.toLowerCase() ? false : true}
                                                onClick={loadBlogByCategory}
                                            >
                                                {cate.categoryName.toUpperCase()}
                                            </Button>
                                        </OneByOneAppearFromRightEffect>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="font-medium text-xl mr-1 text-yellow-300">Trending blogs</h1>
                                <TbTrendingUp fill="yellow" />
                            </div>
                            {trendingBlogs != null ? (
                                trendingBlogs.length == 0 ? (
                                    <NotFound object={'Not found trending blog'} />
                                ) : (
                                    <Carousel pauseOnHover>
                                        {trendingBlogs.map((blog, i) => (
                                            <BlogMini key={i} index={i} content={blog} author={blog.authorId} />
                                        ))}
                                    </Carousel>
                                )
                            ) : (
                                <Spinner className="block mx-auto mt-4" size="lg" />
                            )}
                        </div>
                        <div className="my-4">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="font-medium text-xl mr-1">Highest rated blogs</h1>
                                <FaStarHalfAlt />
                            </div>
                            {topRatedBlogs != null ? (
                                topRatedBlogs.length == 0 ? (
                                    <NotFound object={'Not found any rated blog'} />
                                ) : (
                                    topRatedBlogs.map((blog, i) => <BlogTopRated key={i} content={blog} index={i} />)
                                )
                            ) : (
                                <Spinner className="block mx-auto mt-4" size="lg" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Thêm code hiển thị danh sách authors đã subscribe */}
            {currentUser && (
                <>
                    <hr className="mt-20 my-6 opacity-50" />
                    <div className="flex justify-between mb-8">
                        <p className="font-semibold text-3xl mx-auto">Following Authors</p>
                        <div className="flex items-center group">
                            <Link to={'/all-following-author'} className="dark:opacity-60 group-hover:opacity-90 pr-2">
                                All
                            </Link>
                            <Link to={'/all-following-author'}>
                                <FaArrowRight
                                    size={18}
                                    className="duration-200 transition-opacity opacity-0 group-hover:opacity-90 cursor-pointer"
                                />
                            </Link>
                        </div>
                    </div>
                </>
            )}
            <hr className="mt-20 my-6 opacity-50" />
            <div className="flex justify-between mb-8">
                <p className="font-semibold text-3xl mx-auto">Top Authors</p>
                <div className="flex items-center group">
                    <Link to={'/all-user'} className="dark:opacity-60 group-hover:opacity-90 pr-2">
                        All
                    </Link>
                    <Link to={'/all-user'}>
                        <FaArrowRight
                            size={18}
                            className="duration-200 transition-opacity opacity-0 group-hover:opacity-90 cursor-pointer"
                        />
                    </Link>
                </div>
            </div>
            <FadeInWhenVisible>
                <div className="flex flex-col gap-4 md:flex-row md:justify-evenly">
                    {topAuthors != null ? (
                        topAuthors.length == 0 ? (
                            <NotFound object={'Not found any users'} />
                        ) : (
                            topAuthors.map((author, i) => {
                                return (
                                    <div
                                        className="p-4 dark:bg-slate-800 bg-slate-50 md:max-w-[32%] rounded-3xl overflow-hidden hover:scale-105 duration-300"
                                        key={i}
                                    >
                                        <div className="flex items-center gap-4 xl:gap-8">
                                            <div className="rounded-full max-w-24 max-h-24 border-2 flex justify-center items-center">
                                                <img
                                                    alt="Avatar"
                                                    src={author.userAvatar}
                                                    className="max-w-20 max-h-20 rounded-full shadow-2xl"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="font-semibold line-clamp-1 break-words">
                                                    @{author.username}
                                                </p>
                                                <p className="line-clamp-2 break-words">{author.userDesc}</p>
                                                <p className="line-clamp-1 break-words flex items-center gap-1">
                                                    <SlNote /> {author.count} Published Blogs
                                                </p>
                                                <Link to={`/user/${author.username}`} className="text-teal-600">
                                                    View profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="lg" />
                    )}
                </div>
            </FadeInWhenVisible>
            <BackToTopButton />
        </section>
    );
}

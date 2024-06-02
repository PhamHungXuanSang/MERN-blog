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
import { Link, useNavigate } from 'react-router-dom';
import { SlNote } from 'react-icons/sl';
import BackToTopButton from '../components/BackToTopButton';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { useDispatch, useSelector } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import dateToDateAndTime from '../utils/dateToDateAndTime';
import { signOutSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';
import { extractTime } from '../utils/extractTime.js';

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
    const [authors, setAuthors] = useState([]);
    const [authorBlogs, setAuthorBlogs] = useState(null);
    const [activeAuthor, setActiveAuthor] = useState(null);
    const [settings, setSettings] = useState({
        className: 'center',
        centerMode: true,
        infinite: true,
        slidesToShow: 3,
        speed: 500,
    });
    const [suggestedBlogs, setSuggestedBlogs] = useState(null);
    const limit = 5;

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        try {
            const res = await fetch('/api/user/get-user-subscribe-authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id }),
            });
            const data = await res.json();
            if (res.status == 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            setAuthors(data.authors);
            if (data.authors.length > 0) {
                setActiveAuthor(data.authors[0].username);
            }
        } catch (error) {
            console.log(error);
        }
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

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setSettings((prevSettings) => ({ ...prevSettings, slidesToShow: 1 }));
        } else {
            setSettings((prevSettings) => ({ ...prevSettings, slidesToShow: 3 }));
        }
    };

    useEffect(() => {
        if (activeTab == 'all category') {
            handleGetLatestBlogs();
        } else {
            handleGetBlogsByCate(activeTab);
        }
    }, [activeTab, currentPage]);

    const handleGetSuggestedBlog = async () => {
        try {
            const res = await fetch(`/api/user/get-suggested-blog/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id }),
            });
            const data = await res.json();
            if (res.status == 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status == 200) {
                setSuggestedBlogs(data.suggestedBlogs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetAllCategoryTrendingHightestRatedBlogs();
        handleGetTopAuthors();
        if (currentUser) {
            handleGetUserSubscribeAuthor();
            handleGetSuggestedBlog();
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
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

    const handleFetchAuthorBlog = async (username) => {
        setAuthorBlogs(null);
        setActiveAuthor(username);
        try {
            const res = await fetch(`/api/user/profile/${username}?page=1&&limit=3`, {
                method: 'GET',
            });
            if (res.status == 404) {
                return navigate('*');
            }
            const userProfile = await res.json();
            setAuthorBlogs(userProfile.blogs);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (activeAuthor != null) {
            handleFetchAuthorBlog(activeAuthor);
        }
    }, [activeAuthor]);

    return (
        <div className="h-cover container mx-auto py-8 px-2 md:px-0">
            <div className="flex justify-center gap-4 min-h-screen">
                <div className="w-full md:max-w-[68%]">
                    <InPageNavigation routes={['home', 'Propose']} defaultHidden={['Propose']}>
                        <>
                            {blogs != null ? (
                                <>
                                    <div className="flex flex-col gap-2 my-4 md:hidden">
                                        <div className="flex items-center">
                                            <h1 className="font-medium text-xl mr-1 text-green-500">
                                                View by Category
                                            </h1>
                                            <BiSolidCategoryAlt fill="green" />
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {allCate?.map((cate, i) => {
                                                return (
                                                    <OneByOneAppearFromRightEffect
                                                        transition={{ duration: 0.6, delay: i * 0.01 }}
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
                                    <h1 className="font-medium text-xl mr-1 text-red-600">Trending blogs</h1>
                                    <TbTrendingUp fill="red" />
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
                                    <h1 className="font-medium text-xl mr-1 text-yellow-300">Highest rated blogs</h1>
                                    <FaStarHalfAlt fill="yellow" />
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
                        <div className="flex flex-col gap-2 mb-4 p-4 rounded-3xl dark:bg-slate-800 bg-slate-100">
                            <div className="flex items-center">
                                <h1 className="font-medium text-xl mr-1 text-green-500">View by Category</h1>
                                <BiSolidCategoryAlt fill="green" />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {allCate?.map((cate, i) => {
                                    return (
                                        <OneByOneAppearFromRightEffect
                                            transition={{ duration: 0.6, delay: i * 0.1 }}
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
                                <h1 className="font-medium text-xl mr-1 text-red-600">Trending blogs</h1>
                                <TbTrendingUp fill="red" />
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
                                <h1 className="font-medium text-xl mr-1 text-yellow-300">Highest rated blogs</h1>
                                <FaStarHalfAlt fill="yellow" />
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
            {currentUser && (
                <>
                    <hr className="mt-20 my-6 opacity-50" />
                    <div className="flex justify-between mb-8">
                        <p className="font-semibold text-3xl mx-auto">Subscribed Authors</p>
                        {authors != null && (
                            <div className="flex items-center group">
                                <Link
                                    to={'/all-subscribed-author'}
                                    className="dark:opacity-60 group-hover:opacity-90 pr-2"
                                >
                                    All
                                </Link>
                                <Link to={'/all-subscribed-author'}>
                                    <FaArrowRight
                                        size={18}
                                        className="duration-200 transition-opacity opacity-0 group-hover:opacity-90 cursor-pointer"
                                    />
                                </Link>
                            </div>
                        )}
                    </div>
                    <FadeInWhenVisible>
                        {authors != null ? (
                            authors != null && authors.length > 0 ? (
                                authors.length == 1 ? (
                                    <div
                                        className="mx-auto w-fit dark:bg-white bg-gray-400 p-1 rounded-full cursor-pointer"
                                        onClick={() => handleFetchAuthorBlog(authors[0].username)}
                                    >
                                        <div className="flex gap-1 items-center truncate">
                                            <img
                                                src={authors[0].userAvatar}
                                                className="w-10 h-10 rounded-full"
                                                alt="userAvatar"
                                            />
                                            <span className="dark:text-black text-white break-words">
                                                @{authors[0].username}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <Slider {...settings} className="text-center">
                                        {authors.map((author, i) => (
                                            <div
                                                key={i}
                                                className="!w-fit dark:bg-white bg-gray-400 p-1 rounded-full cursor-pointer"
                                                onClick={() => handleFetchAuthorBlog(author.username)}
                                            >
                                                <div className="flex gap-1 items-center truncate">
                                                    <img
                                                        src={author.userAvatar}
                                                        className="w-10 h-10 rounded-full"
                                                        alt="userAvatar"
                                                    />
                                                    <span className="dark:text-black text-white">
                                                        @{author.username}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                )
                            ) : (
                                <i className="block text-center opacity-70">
                                    You are not subscribe any author. Click the subscribe button to easily see the
                                    authors blog
                                </i>
                            )
                        ) : (
                            <Spinner size="xl" className="mx-auto block" />
                        )}
                    </FadeInWhenVisible>
                    <FadeInWhenVisible>
                        {authorBlogs != null ? (
                            authorBlogs.length > 0 ? (
                                <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center mt-8 text-center">
                                    {authorBlogs.map((blog, i) => {
                                        return (
                                            <Link
                                                to={`/blog/${blog.slug}`}
                                                key={i}
                                                className="group md:max-w-[30%] my-0 mx-4 dark:bg-slate-800 bg-slate-100 p-4 rounded-3xl"
                                            >
                                                <img
                                                    src={blog.thumb}
                                                    alt="blogThumb"
                                                    className="w-full aspect-video object-cover mx-auto rounded-3xl"
                                                />
                                                <p className="my-2 text-xl font-semibold line-clamp-2 break-words duration-100 group-hover:scale-105 w-fit relative before:content-[''] before:absolute before:top-[6%] before:right-[-1px] before:w-0 before:h-[93%] before:rounded-sm before:bg-gradient-to-r before:from-indigo-500 before:from-10% before:via-sky-500 before:via-30% before:to-emerald-500 before:to-90% before:-z-10 before:transition-[0.5s] group-hover:before:left-[1px] group-hover:before:right-auto group-hover:before:w-full before:opacity-60">
                                                    {blog.title}
                                                </p>
                                                <span className="my-2 block w-fit px-4 whitespace-nowrap rounded-full capitalize border border-teal-500 font-semibold">
                                                    {blog.category}
                                                </span>
                                                <i className="min-w-fit ml-4 opacity-50 block">
                                                    Published on: {dateToDateAndTime(blog.createdAt)}
                                                </i>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <i className="block text-center opacity-70 mt-8">
                                    Author {activeAuthor != null ? '@' + activeAuthor : ''} not publish any blogs.
                                </i>
                            )
                        ) : authors.length > 0 ? (
                            <Spinner size="lg" className="mx-auto block mt-4" />
                        ) : (
                            ''
                        )}
                    </FadeInWhenVisible>
                </>
            )}

            {/* suggestedBlogs */}
            {currentUser && (
                <>
                    <hr className="mt-20 my-6 opacity-50" />
                    <p className="font-semibold text-3xl mx-auto mb-8 text-center">Suggested Blogs</p>
                    {suggestedBlogs != null ? (
                        suggestedBlogs != null && suggestedBlogs.length > 0 ? (
                            suggestedBlogs.map((blog, idx) => (
                                <FadeInWhenVisible key={idx}>
                                    <Link
                                        to={`/blog/${blog.slug}`}
                                        className="group flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden mb-6 p-2"
                                    >
                                        <img
                                            src={blog.thumb}
                                            alt="Blog Thumbnail"
                                            className="w-full md:w-1/3 object-cover max-h-44 rounded-xl"
                                        />
                                        <div className="p-6 w-full md:w-2/3">
                                            <h1 className="text-xl font-semibold line-clamp-2 break-words duration-100 group-hover:scale-105 w-fit relative before:content-[''] before:absolute before:top-[6%] before:right-[-1px] before:w-0 before:h-[93%] before:rounded-sm before:bg-gradient-to-r before:from-indigo-500 before:from-10% before:via-sky-500 before:via-30% before:to-emerald-500 before:to-90% before:-z-10 before:transition-[0.5s] group-hover:before:left-[1px] group-hover:before:right-auto group-hover:before:w-full before:opacity-60">
                                                {blog.title}
                                            </h1>
                                            <p className="text-gray-700 mb-4">{blog.description}</p>
                                            <div className="mb-4">
                                                {blog.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block bg-blue-400 text-white text-xs px-3 py-1 rounded-full mr-2"
                                                    >
                                                        # {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap text-gray-600 mb-4">
                                                <span className="mr-4">👁️ {blog.viewed}</span>
                                                <span className="mr-4">👍 {blog.likeCount}</span>
                                                <span className="mr-4">💬 {blog.commentCount}</span>
                                                <span className="mr-4">⭐️ {blog.averageRating}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-gray-500 items-center">
                                                <span className="mr-4 px-4 whitespace-nowrap rounded-full capitalize border border-teal-500 font-semibold dark:text-teal-100 text-teal-600">
                                                    {blog.category}
                                                </span>
                                                <div className="mr-4 flex items-center gap-1">
                                                    <div>
                                                        <img
                                                            src={blog.authorId.userAvatar}
                                                            className="w-6 h-6 object-cover rounded-full"
                                                        />
                                                    </div>
                                                    <p>@{blog.authorId.username}</p>
                                                </div>
                                                <span className="text-sm">
                                                    Published on: {extractTime(blog.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeInWhenVisible>
                            ))
                        ) : (
                            <i className="block text-center opacity-70">
                                There is no suggested or blogs you have not read. View more blogs to personalize
                                recommendations for you
                            </i>
                        )
                    ) : (
                        <Spinner size="xl" className="mx-auto block" />
                    )}
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
                                        className="md:p-4 p-2 dark:bg-slate-800 bg-slate-100 md:max-w-[32%] rounded-3xl overflow-hidden hover:scale-105 duration-300"
                                        key={i}
                                    >
                                        <div className="flex items-center gap-4 xl:gap-8">
                                            <div className="rounded-full max-w-24 max-h-24 border-2 flex justify-center items-center">
                                                <img
                                                    alt="Avatar"
                                                    src={author.userAvatar}
                                                    className="md:max-w-20 md:max-h-20 max-w-[60px] max-h-[60px] rounded-full shadow-2xl"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="font-semibold line-clamp-1 break-words">
                                                    @{author.username}
                                                </p>
                                                <p className="line-clamp-2 break-words text-sm md:text-base">
                                                    {author.userDesc}
                                                </p>
                                                <p className="line-clamp-1 break-words flex items-center gap-1 opacity-50">
                                                    <SlNote /> {author.count} Published Blogs
                                                </p>
                                                <Link to={`/user/${author.username}`} className="text-teal-600 text-sm">
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
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Spinner } from 'flowbite-react';
import dateToDateAndTime from '../utils/dateToDateAndTime';
import { useSelector } from 'react-redux';

export default function AllSubscribedAuthor() {
    const [authors, setAuthors] = useState([]);
    const [authorBlogs, setAuthorBlogs] = useState(null);
    const [activeAuthor, setActiveAuthor] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        className: 'center',
        centerMode: true,
        infinite: true,
        slidesToShow: 3,
        speed: 500,
    });

    const handleGetUserSubscribeAuthor = async () => {
        const res = await fetch('/api/user/get-user-subscribe-authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser._id }),
        });
        const data = await res.json();
        setAuthors(data.authors);
        if (data.authors.length > 0) {
            setActiveAuthor(data.authors[0].username);
        }
    };

    const handleFetchAuthorBlog = async (username) => {
        setAuthorBlogs(null);
        setActiveAuthor(username);
        try {
            const res = await fetch(`/api/user/profile/${username}?page=1&&limit=100000`, {
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

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setSettings((prevSettings) => ({ ...prevSettings, slidesToShow: 1 }));
        } else {
            setSettings((prevSettings) => ({ ...prevSettings, slidesToShow: 3 }));
        }
    };

    useEffect(() => {
        handleGetUserSubscribeAuthor();
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (activeAuthor != null) {
            handleFetchAuthorBlog(activeAuthor);
        }
    }, [activeAuthor]);

    return (
        <div className="flex flex-col gap-4 py-8 px-4 md:px-0 container mx-auto">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">All Subscribed Author</p>
            </div>
            {authors != null ? (
                authors != null && authors.length > 0 ? (
                    authors.length == 1 ? (
                        <div
                            className="mx-auto w-fit dark:bg-white bg-gray-400 p-1 rounded-full cursor-pointer"
                            onClick={() => handleFetchAuthorBlog(authors[0].username)}
                        >
                            <div className="flex gap-1 items-center truncate">
                                <img src={authors[0].userAvatar} className="w-10 h-10 rounded-full" alt="userAvatar" />
                                <span className="dark:text-black text-white">@{authors[0].username}</span>
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
                                        <span className="dark:text-black text-white">@{author.username}</span>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )
                ) : (
                    <i className="block text-center opacity-70">
                        You are not subscribe any author. Click the subscribe button to easily see the authors blog
                    </i>
                )
            ) : (
                <Spinner size="xl" className="mx-auto block" />
            )}
            {authorBlogs != null ? (
                authorBlogs.length > 0 ? (
                    <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-0 justify-between items-center mt-8 text-center">
                        {authorBlogs.map((blog, i) => {
                            return (
                                <Link
                                    to={`/blog/${blog.slug}`}
                                    key={i}
                                    className="group md:max-w-[30%] m-4 dark:bg-slate-800 bg-slate-100 p-4 rounded-3xl"
                                >
                                    <img
                                        src={blog.thumb}
                                        alt="blogThumb"
                                        className="w-full aspect-video object-cover mx-auto rounded-3xl"
                                    />
                                    <p className="text-left my-2 text-xl font-semibold line-clamp-2 break-words duration-100 group-hover:scale-105 w-fit relative before:content-[''] before:absolute before:top-[6%] before:right-[-1px] before:w-0 before:h-[93%] before:rounded-sm before:bg-gradient-to-r before:from-indigo-500 before:from-10% before:via-sky-500 before:via-30% before:to-emerald-500 before:to-90% before:-z-10 before:transition-[0.5s] group-hover:before:left-[1px] group-hover:before:right-auto group-hover:before:w-full">
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
        </div>
    );
}

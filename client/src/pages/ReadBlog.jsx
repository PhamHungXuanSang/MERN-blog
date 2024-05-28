/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Carousel, Rating, Spinner } from 'flowbite-react';
import { createContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogAction from '../components/BlogAction';
import blogStructure from '../context/blog/blogStructure.js';
import BlogSuggested from '../components/BlogSuggested.jsx';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect.jsx';
import ContentItem from '../components/ContentItem.jsx';
import { useDispatch, useSelector } from 'react-redux';
import StarRating from '../components/StarRating.jsx';
import CommentsContainer, { fetchComments } from '../components/CommentsContainer.jsx';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';
import FadeInWhenVisible from '../components/FadeInWhenVisible.jsx';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { signOutSuccess } from '../redux/user/userSlice.js';
import BackToTopButton from '../components/BackToTopButton.jsx';
import { BsListNested } from 'react-icons/bs';

export const BlogContext = createContext({});

export default function ReadBlog() {
    let { slug } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [suggest, setSuggest] = useState(null);
    const [similarAuthorBlogs, setSimilarAuthorBlogs] = useState(null);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [outline, setOutline] = useState([]);
    const [showOutline, setShowOutLine] = useState(false);
    const [rotate, setRotate] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleReadBlog = async () => {
        try {
            const res = await fetch(`/api/blog/read-blog/${slug}/${currentUser?._id}`, {
                method: 'GET',
            });
            if (res.status == 404) {
                return navigate('*');
            }
            const data = await res.json();
            if (data.blog.isBlocked.status == true) {
                return navigate('*');
            }
            const res2 = await fetch(`/api/search/${data.blog.tags}?page=1&&currentSlug=${data.blog.slug}`, {
                method: 'POST',
            });
            const data2 = await res2.json();
            let comments = await fetchComments({
                blogId: data.blog._id,
            });
            data.blog.comments = comments;
            setBlog(data.blog);
            setSimilarAuthorBlogs(data.similarAuthorBlogs);
            setIsSubscribed(data.isSubscribed);
            setSuggest(data2.blogs);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setBlog(blogStructure);
        setSimilarAuthorBlogs(null);
        setSuggest(null);
        handleReadBlog();
    }, [slug]);

    function extractTextFromHTML(htmlString) {
        let textContent = htmlString.replace(/<\/?[^>]+(>|$)/g, ' ').trim();
        textContent = textContent.replace(/\s+/g, ' ');
        return textContent;
    }

    useEffect(() => {
        if (blog != null && blog.title.length) {
            blog.content[0].blocks.map((block, i) => {
                switch (block.type) {
                    case 'header':
                        setOutline((prev) => [
                            ...prev,
                            {
                                index: i,
                                type: 'header',
                                level: block.data.level,
                                content: extractTextFromHTML(block.data.text),
                            },
                        ]);
                        break;
                    case 'image':
                        setOutline((prev) => [
                            ...prev,
                            {
                                index: i,
                                type: 'image',
                                content: block.data.caption.length
                                    ? extractTextFromHTML(block.data.caption)
                                    : extractTextFromHTML(block.data.file.url),
                            },
                        ]);
                        break;
                    case 'quote':
                        setOutline((prev) => [
                            ...prev,
                            {
                                index: i,
                                type: 'quote',
                                content: block.data.caption.length
                                    ? extractTextFromHTML(block.data.caption)
                                    : extractTextFromHTML(block.data.text),
                            },
                        ]);
                        break;
                    case 'warning':
                        setOutline((prev) => [
                            ...prev,
                            { index: i, type: 'warning', content: extractTextFromHTML(block.data.message) },
                        ]);
                        break;
                    case 'embed':
                        setOutline((prev) => [
                            ...prev,
                            { index: i, type: 'embed', content: extractTextFromHTML(block.data.caption) },
                        ]);
                        break;
                    case 'alert':
                        setOutline((prev) => [
                            ...prev,
                            { index: i, type: 'alert', content: extractTextFromHTML(block.data.message) },
                        ]);
                        break;
                }
            });
        }
    }, [blog]);

    const handleGetRatingOfXStar = (star) => {
        const totalRatingCount = blog.rating.length;

        let totalXStar = 0;
        blog.rating.forEach((rate) => {
            if (rate.star == star) {
                totalXStar += 1;
            }
        });
        const percent = (totalXStar / totalRatingCount) * 100;

        return { star, percent };
    };

    const handleToggleSubscribe = async () => {
        isSubscribed
            ? toast.success('Unsubscribed', { duration: 1000 })
            : toast.success('Subscribed', { duration: 1000 });
        setIsSubscribed((prev) => !prev);
        try {
            const res = await fetch(`/api/user/toggle-subscribe/${blog.authorId._id}/${currentUser._id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status !== 200) {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowOutline = () => {
        setShowOutLine((prev) => !prev);
        setRotate(true);
        setTimeout(() => setRotate(false), 800);
    };

    const handleScrollIntoView = (idx) => {
        const element = document.getElementById(idx + 'index');
        if (!element) return;
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
        setShowOutLine(false);
    };

    return (
        <div>
            {blog.title.length && blog != null ? (
                <BlogContext.Provider
                    value={{
                        blog,
                        setBlog,
                        commentsWrapper,
                        setCommentsWrapper,
                    }}
                >
                    <CommentsContainer />
                    <div className="max-w-[900px] block mx-auto py-10 max-lg:px-[5vw]">
                        <img src={blog.thumb} className="aspect-auto object-cover rounded-[10px] mx-auto max-h-96" />
                        <div className="mt-12">
                            <i className="block mx-auto w-fit py-1 px-3 my-4 font-semibold capitalize border-2 border-teal-500 dark:bg-slate-800 bg-slate-100 rounded-3xl dark:text-teal-100 text-teal-600">
                                {blog.category}
                            </i>
                            <h1 className="text-3xl text-center font-medium line-clamp-2 break-words">{blog.title}</h1>
                            <div className="flex max-sm:flex-col-reverse justify-between items-center my-8">
                                <div className="flex flex-col md:gap-4 gap-2 items-center border border-teal-500 p-2 rounded-lg">
                                    <Link
                                        to={`/user/${blog.authorId.username}`}
                                        className="flex gap-0 md:gap-4 justify-center items-center max-w-full"
                                    >
                                        <img
                                            src={blog.authorId.userAvatar}
                                            className="md:w-12 md:h-12 w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="block truncate">@{blog.authorId.username}</span>
                                            <i className="block truncate text-sm text-gray-500">
                                                {blog.authorId.email}
                                            </i>
                                        </div>
                                    </Link>
                                    <>
                                        {currentUser && blog.authorId._id !== currentUser._id ? (
                                            !isSubscribed ? (
                                                <Button gradientMonochrome="lime" onClick={handleToggleSubscribe}>
                                                    <FaUserPlus className="mr-2 h-5 w-5" />
                                                    Subscribe
                                                </Button>
                                            ) : (
                                                <Button
                                                    gradientMonochrome="failure"
                                                    outline
                                                    onClick={handleToggleSubscribe}
                                                    className="opacity-50"
                                                >
                                                    <FaUserMinus className="mr-2 h-5 w-5" />
                                                    Unsubscribe
                                                </Button>
                                            )
                                        ) : null}
                                    </>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                        Publish on {dateToDateAndTime(blog.createdAt)}{' '}
                                        {blog.isUpdated ? '(Updated)' : ''}
                                    </p>
                                    <p>{blog.viewed} Views</p>
                                </div>
                            </div>
                        </div>
                        <BlogAction />

                        {blog.title.length && blog != null ? (
                            blog.content[0].blocks.map((block, i) => {
                                return (
                                    <div key={i} className="my-4 md:my-8" id={i + 'index'}>
                                        <ContentItem type={block.type} block={block} />
                                    </div>
                                );
                            })
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="md" />
                        )}

                        {/* Tags */}
                        {blog != null && (
                            <div className="flex flex-wrap items-center gap-2">
                                <p>Tags: </p>
                                {blog.tags.map((tag, i) => (
                                    <div key={i}>
                                        <div className="relative py-2 px-4 opacity-50 scale-90 hover:opacity-100 hover:scale-100 duration-200 dark:bg-slate-500 bg-gray-200 rounded-full inline-block hover:bg-opacity-50">
                                            <p className="outline-none"># {tag}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Author infor */}
                        <div className="p-4 my-4 dark:bg-slate-800 bg-slate-50 rounded-xl shadow overflow-hidden">
                            <div className="flex items-center md:gap-8 gap-2">
                                <div className="rounded-full max-w-24 max-h-24 border-2 flex justify-center items-center">
                                    <img
                                        alt="Avatar"
                                        src={blog.authorId.userAvatar}
                                        className="md:max-w-20 md:max-h-20 max-w-14 max-h-14 rounded-full shadow-2xl"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold">@{blog.authorId.username}</p>
                                    <p className="line-clamp-2 break-words">{blog.authorId.userDesc}</p>
                                    <Link to={`/user/${blog.authorId.username}`} className="text-teal-600">
                                        View profile
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Rating blog */}
                        {currentUser && !blog.rating.some((item) => item.userId == currentUser._id) && (
                            <StarRating currentUser={currentUser} blogInfo={blog} />
                        )}
                        {blog.rating.length ? (
                            <>
                                <Rating className="mb-2 mt-16">
                                    <Rating.Star filled={blog.averageRating > 0 ? true : false} />
                                    <Rating.Star filled={blog.averageRating > 1 ? true : false} />
                                    <Rating.Star filled={blog.averageRating > 2 ? true : false} />
                                    <Rating.Star filled={blog.averageRating > 3 ? true : false} />
                                    <Rating.Star filled={blog.averageRating > 4 ? true : false} />
                                    <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {blog.averageRating} out of 5
                                    </p>
                                </Rating>
                                <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {blog.rating.length} global ratings
                                </p>
                                {[5, 4, 3, 2, 1].map((star, index) => {
                                    return (
                                        <Rating.Advanced
                                            key={index}
                                            percentFilled={handleGetRatingOfXStar(star).percent}
                                            className="mb-2"
                                        >
                                            {star} star
                                        </Rating.Advanced>
                                    );
                                })}
                            </>
                        ) : (
                            ''
                        )}

                        <FadeInWhenVisible>
                            <div
                                className={
                                    suggest != null &&
                                    suggest.length &&
                                    similarAuthorBlogs != null &&
                                    similarAuthorBlogs.length
                                        ? 'flex flex-col md:flex-row justify-between items-center'
                                        : ''
                                }
                            >
                                {suggest != null && suggest.length ? (
                                    <div className="max-w-[280px] md:max-w-[430px] mx-auto">
                                        <h1 className="text-xl mt-32 mb-10 font-medium text-center">Similar content</h1>
                                        <div className="mt-4">
                                            <Carousel className="max-w-fit h-fit pb-8" pauseOnHover>
                                                {suggest.map((blog, i) => (
                                                    <OneByOneAppearEffect
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        key={i}
                                                    >
                                                        <BlogSuggested key={i} blog={blog} />
                                                    </OneByOneAppearEffect>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                                {similarAuthorBlogs != null && similarAuthorBlogs.length ? (
                                    <div className="max-w-[280px] md:max-w-[430px] mx-auto">
                                        <h1 className="text-xl mt-32 mb-10 font-medium text-center">
                                            Written by @{blog.authorId.username}
                                        </h1>
                                        <div className="mt-4">
                                            <Carousel className="max-w-fit h-fit pb-8" pauseOnHover>
                                                {similarAuthorBlogs.map((blog, i) => (
                                                    <OneByOneAppearEffect
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        key={i}
                                                    >
                                                        <BlogSuggested key={i} blog={blog} />
                                                    </OneByOneAppearEffect>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </FadeInWhenVisible>
                    </div>
                </BlogContext.Provider>
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <BackToTopButton />
            <button
                onClick={handleShowOutline}
                className={`fixed flex justify-center items-center bottom-2 right-2 md:bottom-12 md:right-12 text-2xl md:p-3 p-2 dark:bg-white bg-slate-200 rounded-full z-50 ${showOutline ? 'opacity-100' : 'opacity-30'}`}
            >
                <BsListNested fill="black" size={24} className={rotate ? 'rotate-icon' : 'rotate-icon-off'} />
            </button>
            {showOutline && (
                <div className="bg-slate-200 dark:bg-white rounded-2xl md:max-w-[40%] max-w-full fixed md:bottom-28 md:right-12 bottom-14 right-0 z-50 dark:border-white dark:text-black">
                    <div className="mockup-window border border-base-300">
                        <div className="p-2 md:max-h-[220px] max-h-[320px] overflow-y-scroll">
                            {outline.length > 0 ? (
                                outline.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group my-1"
                                        onClick={() => {
                                            handleScrollIntoView(item.index);
                                        }}
                                    >
                                        <div className="flex items-start gap-2 group-hover:cursor-pointer">
                                            <i className="w-16 flex-shrink-0 opacity-80 group-hover:opacity-100 scale-90 group-hover:scale-100">
                                                {item.type == 'header' ? item.type + ' ' + item.level : item.type}
                                            </i>
                                            <p className="line-clamp-2">{item.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">No outline found</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

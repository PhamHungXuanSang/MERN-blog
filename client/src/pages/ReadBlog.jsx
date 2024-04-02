/* eslint-disable react-hooks/exhaustive-deps */
import { Carousel, Rating, Spinner } from 'flowbite-react';
import { createContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogAction from '../components/BlogAction';
import blogStructure from '../context/blog/blogStructure.js';
import BlogSuggested from '../components/BlogSuggested.jsx';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect.jsx';
import ContentItem from '../components/ContentItem.jsx';
import { useSelector } from 'react-redux';
import StarRating from '../components/StarRating.jsx';
import CommentsContainer, { fetchComments } from '../components/CommentsContainer.jsx';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';
import FadeInWhenVisible from '../components/FadeInWhenVisible.jsx';

export const BlogContext = createContext({});

export default function ReadBlog() {
    let { slug } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [suggest, setSuggest] = useState(null);
    const [similarAuthorBlogs, setSimilarAuthorBlogs] = useState(null);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
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
            const res2 = await fetch(`/api/search/${data.blog.tags}?page=1&&limit=2&&currentSlug=${data.blog.slug}`, {
                method: 'POST',
            });
            const data2 = await res2.json();
            let comments = await fetchComments({
                blogId: data.blog._id,
            });
            data.blog.comments = comments;
            setBlog(data.blog);
            setSimilarAuthorBlogs(data.similarAuthorBlogs);
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

    console.log(suggest, similarAuthorBlogs);

    return (
        <section>
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
                        <img src={blog.thumb} className="aspect-video object-cover rounded mx-auto" />
                        <div className="mt-12">
                            <h1 className="text-3xl text-center font-medium line-clamp-1">{blog.title}</h1>
                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <img src={blog.authorId.userAvatar} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <Link to={`/user/${blog.authorId.username}`}>@{blog.authorId.username}</Link>
                                        <br />
                                        <i>{blog.authorId.email}</i>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                        Publish on {dateToDateAndTime(blog.createdAt)}{' '}
                                        {blog.isUpdated ? '(Updated: ' + dateToDateAndTime(blog.updatedAt) + ')' : ''}
                                    </p>
                                    <p>{blog.viewed} Views</p>
                                </div>
                            </div>
                        </div>
                        <BlogAction />

                        {blog.title.length && blog != null ? (
                            blog.content[0].blocks.map((block, i) => {
                                return (
                                    <div key={i} className="my-4 md:my-8">
                                        <ContentItem type={block.type} block={block} />
                                    </div>
                                );
                            })
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="md" />
                        )}

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
                                        ? 'flex justify-between items-center'
                                        : ''
                                }
                            >
                                {suggest != null && suggest.length ? (
                                    <div className="max-w-[430px]">
                                        <h1 className="text-2xl mt-32 mb-10 font-medium text-center">
                                            Similar content
                                        </h1>
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
                                    <div className="max-w-[430px]">
                                        <h1 className="text-2xl mt-32 mb-10 font-medium text-center">
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
        </section>
    );
}

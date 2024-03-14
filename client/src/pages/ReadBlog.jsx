import { Rating, Spinner } from 'flowbite-react';
import { createContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogAction from '../components/BlogAction';
import blogStructure from '../context/blog/blogStructure.js';
import BlogSuggested from '../components/BlogSuggested.jsx';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect.jsx';
import ContentItem from '../components/ContentItem.jsx';
import formatDate from '../utils/formatDate.js';
import { useSelector } from 'react-redux';
import StarRating from '../components/StarRating.jsx';
import CommentsContainer, { fetchComments } from '../components/CommentsContainer.jsx';

export const BlogContext = createContext({});

export default function ReadBlog() {
    let { slug } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [suggest, setSuggest] = useState(null);
    const [commentsWrapper, setCommentsWrapper] = useState(true);
    //const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);
    const navigate = useNavigate();

    const handleReadBlog = async () => {
        try {
            const res = await fetch(`/api/blog/read-blog/${slug}`, {
                method: 'GET',
            });
            if (res.status == 404) {
                return navigate('*');
            }
            const data = await res.json();
            const res2 = await fetch(
                `/api/search/${data.blog.tags[0]}?page=1&&limit=2&&currentSlug=${data.blog.slug}`,
                {
                    method: 'POST',
                },
            );
            const data2 = await res2.json();
            let comments = await fetchComments({
                blogId: data.blog._id,
                //setParentCommentCountFun: setTotalParentCommentsLoaded,
            });
            //console.log(comments);
            data.blog.comments = comments;
            setBlog(data.blog);
            setSuggest(data2.blogs);
        } catch (error) {
            console.log(error);
        }
    };

    // console.log(slug);
    // console.log(blog);
    useEffect(() => {
        // if (blog.title.length) {
        //     setBlog(blog);
        //     return;
        // }
        setBlog(blogStructure);
        setSuggest(null);
        handleReadBlog();
        //}, [slug, blog]);
    }, [slug]);

    const handleGetAvgRating = () => {
        let sum = 0;
        blog.rating.forEach((rate) => (sum += rate.star));
        return sum / blog.rating.length;
    };

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

    return (
        <section>
            {blog.title.length && blog != null ? (
                <BlogContext.Provider
                    value={{
                        blog,
                        setBlog,
                        commentsWrapper,
                        setCommentsWrapper,
                        //totalParentCommentsLoaded,
                        //setTotalParentCommentsLoaded,
                    }}
                >
                    <CommentsContainer />
                    <div className="max-w-[900px] block mx-auto py-10 max-lg:px-[5vw]">
                        <img src={blog.thumb} className="aspect-video object-cover rounded mx-auto" />
                        <div className="mt-12">
                            <h1 className="text-3xl text-center font-medium">{blog.title}</h1>
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
                                        Publish on {formatDate(blog.createdAt)}
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
                                <Rating className="mb-2">
                                    <Rating.Star />
                                    <Rating.Star />
                                    <Rating.Star />
                                    <Rating.Star />
                                    <Rating.Star filled={false} />
                                    <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {handleGetAvgRating()} out of 5
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

                        {suggest != null && suggest.length ? (
                            <>
                                <h1 className="text-2xl mt-32 mb-10 font-medium text-center">Suggested articles</h1>
                                <div className="flex flex-wrap gap-5 mt-4 justify-center">
                                    {suggest.map((blog, i) => (
                                        <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                            <BlogSuggested key={i} blog={blog} />
                                        </OneByOneAppearEffect>
                                    ))}
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </BlogContext.Provider>
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
        </section>
    );
}

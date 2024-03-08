import { Spinner } from 'flowbite-react';
import { createContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogAction from '../components/BlogAction';
import blogStructure from '../context/blog/blogStructure.js';
import BlogSuggested from '../components/BlogSuggested.jsx';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect.jsx';
import ContentItem from '../components/ContentItem.jsx';
import formatDate from '../utils/formatDate.js';

export const BlogContext = createContext({});

export default function ReadBlog() {
    let { slug } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [suggest, setSuggest] = useState(null);
    const navigate = useNavigate();

    const handleReadBlog = async () => {
        try {
            const res = await fetch(`/api/blog/read-blog/${slug}`, {
                method: 'GET',
            });
            if (res.status == 400) {
                navigate('*');
            }
            const data = await res.json();
            const res2 = await fetch(
                `/api/search/${data.blog.tags[0]}?page=1&&limit=2&&currentSlug=${data.blog.slug}`,
                {
                    method: 'POST',
                },
            );
            const data2 = await res2.json();
            setBlog(data.blog);
            setSuggest(data2.blogs);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setBlog(blogStructure);
        setSuggest(null);
        handleReadBlog();
    }, [slug]);

    return (
        <section>
            {blog.title.length && blog != null ? (
                <BlogContext.Provider value={{ blog, setBlog }}>
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

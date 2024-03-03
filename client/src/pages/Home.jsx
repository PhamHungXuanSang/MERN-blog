import { useEffect, useState } from 'react';
import Blog from '../components/Blog';
import { Button, Spinner } from 'flowbite-react';
import BlogMini from '../components/BlogMini';
import { TbTrendingUp } from 'react-icons/tb';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import NotFoundBlog from '../components/NotFoundBlog';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';

export default function Home() {
    const [activeTab, setActiveTab] = useState('home');
    const [activeCate, setActiveCate] = useState('');
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);

    const category = ['programing', 'travel', 'food', 'technology', 'health', 'sport', 'entertainment'];

    const handleGetLatestBlogs = async () => {
        const res = await fetch('/api/blog/latest-blogs', {
            method: 'GET',
        });
        const blogs = await res.json();
        setBlogs(blogs);
    };

    const handleGetTrendingBlogs = async () => {
        const res = await fetch('/api/blog/trending-blogs', {
            method: 'GET',
        });
        const blogs = await res.json();
        setTrendingBlogs(blogs);
    };

    const handleGetBlogsByCate = async (cate) => {
        const res = await fetch(`/api/blog/category/${cate}`, {
            method: 'GET',
        });
        const blogs = await res.json();
        setBlogs(blogs);
    };

    useEffect(() => {
        if (activeTab == 'home') {
            handleGetLatestBlogs();
        } else {
            handleGetBlogsByCate(activeTab);
        }
    }, [activeTab]);

    useEffect(() => {
        handleGetTrendingBlogs();
    }, []);

    const loadBlogByCategory = async (e) => {
        let cate = e.target.innerText.toLowerCase();

        setBlogs(null);

        if (activeTab == cate) {
            setActiveCate('');
            setActiveTab('home');
            //return;
        } else {
            setActiveCate(cate);
            setActiveTab(cate);
        }
    };

    return (
        <section className="container mx-auto min-h-screen h-fit flex justify-center gap-10">
            {/* latest blog */}
            <div className="w-full flex py-12 px-4">
                <div className="h-full w-[70%] px-4">
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p
                            className={`border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block cursor-pointer`}
                        >
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </p>
                        {/* <p
                            onClick={() => setActiveTab('trending')}
                            className={`${activeTab == 'trending' ? 'border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6]' : 'text-gray-500'} text-lg w-fit py-2 px-4 inline-block cursor-pointer`}
                        >
                            Trending Blog
                        </p> */}
                    </div>

                    {blogs != null ? (
                        blogs.length == 0 ? (
                            <NotFoundBlog object={activeCate} />
                        ) : (
                            blogs.map((blog, i) => (
                                <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.15 }} key={i}>
                                    <Blog key={i} content={blog} author={blog.authorId} />
                                </OneByOneAppearEffect>
                            ))
                        )
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    )}

                    {/* {activeTab == 'trending' &&
                        (trendingBlogs.length == 0 ? (
                            <Spinner />
                        ) : (
                            trendingBlogs.map((blog, i) => (
                                <BlogMini key={i} index={i} content={blog} author={blog.authorId} />
                            ))
                        ))} */}
                </div>
                <div className="border-l-2 h-full pl-4 w-[30%] max-md:hidden">
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center">
                            <h1 className="font-medium text-xl mr-1">View by Category</h1>
                            <BiSolidCategoryAlt />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {category.map((cate, i) => {
                                return (
                                    <Button
                                        gradientDuoTone="greenToBlue"
                                        key={i}
                                        outline={activeCate == cate.toLowerCase() ? false : true}
                                        onClick={loadBlogByCategory}
                                    >
                                        {cate.toUpperCase()}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-medium text-xl mr-1">Trending blogs</h1>
                        <TbTrendingUp />
                    </div>
                    {trendingBlogs != null ? (
                        trendingBlogs.length == 0 ? (
                            <NotFoundBlog object={'trending'} />
                        ) : (
                            trendingBlogs.map((blog, i) => (
                                <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.15 }} key={i}>
                                    <BlogMini key={i} index={i} content={blog} author={blog.authorId} />
                                </OneByOneAppearEffect>
                            ))
                        )
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="lg" />
                    )}

                    {/* {trendingBlogs.length == 0 ? (
                        <h1>Khong co du lieu</h1>
                    ) : (
                        trendingBlogs.map((blog, i) => (
                            <BlogMini key={i} index={i} content={blog} author={blog.authorId} />
                        ))
                    )} */}
                </div>
            </div>
            {/* filter and trending blog */}
        </section>
    );
}

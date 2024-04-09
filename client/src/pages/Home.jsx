import { useEffect, useState } from 'react';
import Blog from '../components/Blog';
import { Button, Spinner, Pagination, Carousel } from 'flowbite-react';
import BlogMini from '../components/BlogMini';
import { TbTrendingUp } from 'react-icons/tb';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import NotFound from '../components/NotFound';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import OneByOneAppearFromRightEffect from '../components/OneByOneAppearFromRightEffect';

export default function Home() {
    const [activeTab, setActiveTab] = useState('all category');
    const [activeCate, setActiveCate] = useState('');
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    ///////////// Phải đổi lại lấy từ csdl ra chứ kp cố định là 1 array
    const category = ['programing', 'travel', 'food', 'technology', 'health', 'sport', 'entertainment'];
    const limit = 2;

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

    const handleGetTrendingBlogs = async () => {
        try {
            const res = await fetch('/api/blog/trending-blogs', {
                method: 'GET',
            });
            const blogs = await res.json();
            setTrendingBlogs(blogs);
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

    useEffect(() => {
        if (activeTab == 'all category') {
            handleGetLatestBlogs();
        } else {
            handleGetBlogsByCate(activeTab);
        }
    }, [activeTab, currentPage]);

    useEffect(() => {
        handleGetTrendingBlogs();
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
        <section className="container mx-auto min-h-screen h-fit flex justify-center gap-10">
            <div className="w-full flex py-12">
                {/* Latest blog */}
                <div className="h-full w-[70%]">
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p
                            className={`font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block`}
                        >
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </p>
                    </div>

                    {blogs != null ? (
                        blogs.length == 0 ? (
                            <NotFound object={`Not found blog by ${activeCate} category`} />
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
                                    totalPages={Math.ceil(totalPage / limit)}
                                    onPageChange={onPageChange}
                                    showIcons
                                />
                            </>
                        )
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    )}
                </div>

                {/* Trending and filter by category */}
                <div className="border-l-2 h-full pl-4 w-[30%] max-md:hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="font-medium text-xl mr-1">Trending blogs</h1>
                        <TbTrendingUp />
                    </div>
                    {trendingBlogs != null ? (
                        trendingBlogs.length == 0 ? (
                            <NotFound object={'Not found trending blog'} />
                        ) : (
                            <Carousel className="h-fit py-4 px-1 border-2 border-teal-500 rounded-3xl" pauseOnHover>
                                {trendingBlogs.map((blog, i) => (
                                    <BlogMini key={i} index={i} content={blog} author={blog.authorId} />
                                ))}
                            </Carousel>
                        )
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="lg" />
                    )}
                    <div className="flex flex-col gap-2 my-4">
                        <div className="flex items-center">
                            <h1 className="font-medium text-xl mr-1">View by Category</h1>
                            <BiSolidCategoryAlt />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {category.map((cate, i) => {
                                return (
                                    <OneByOneAppearFromRightEffect transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                        <Button
                                            gradientDuoTone="greenToBlue"
                                            key={i}
                                            outline={activeCate == cate.toLowerCase() ? false : true}
                                            onClick={loadBlogByCategory}
                                        >
                                            {cate.toUpperCase()}
                                        </Button>
                                    </OneByOneAppearFromRightEffect>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

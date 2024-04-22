import { useEffect, useState } from 'react';
import Blog from '../components/Blog';
import { Button, Spinner, Pagination, Carousel } from 'flowbite-react';
import BlogMini from '../components/BlogMini';
import { TbTrendingUp } from 'react-icons/tb';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import NotFound from '../components/NotFound';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import OneByOneAppearFromRightEffect from '../components/OneByOneAppearFromRightEffect';
import InPageNavigation from '../components/InPageNavigation';

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
        <section className="h-cover flex justify-center gap-4 container mx-auto py-8">
            <div className="w-full md:max-w-[68%]">
                <InPageNavigation routes={['home', 'treding blogs']} defaultHidden={['treding blogs']}>
                    <>
                        {blogs != null ? (
                            <>
                                <div className="flex flex-col gap-2 my-4 md:hidden">
                                    <div className="flex items-center">
                                        <h1 className="font-medium text-xl mr-1">View by Category</h1>
                                        <BiSolidCategoryAlt />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {category.map((cate, i) => {
                                            return (
                                                <OneByOneAppearFromRightEffect
                                                    transition={{ duration: 1, delay: i * 0.03 }}
                                                    key={i}
                                                >
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
                                {blogs.length == 0 ? (
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
                                )}
                            </>
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="xl" />
                        )}
                    </>

                    <>
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
                    </>
                </InPageNavigation>
            </div>

            <div className="max-w-[30%] border-l border-gray-300 pl-4 pt-3 max-md:hidden">
                <div className="flex flex-col">
                    <>
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
                    </>
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

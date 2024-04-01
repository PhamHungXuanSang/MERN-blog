/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Label, Pagination, Select, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import Blog from '../components/Blog';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import NotFound from '../components/NotFound';
import OneByOneAppearFromRightEffect from '../components/OneByOneAppearFromRightEffect';
import User from '../components/User';

export default function Search() {
    const [filterData, setFilterData] = useState({
        sort: 'desc',
        category: 'uncategorized',
    });
    const location = useLocation();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (sortFromUrl || categoryFromUrl) {
            setFilterData({
                ...filterData,
                sort: sortFromUrl,
                category: categoryFromUrl,
            });
        }
        getSearchValue();
    }, [location.search]);
    
    let { query } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const limit = 2;
    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);

    const getSearchValue = async () => {
        setBlogs(null);
        try {
            const res = await fetch(
                `/api/search/${query}?category=${filterData.category}&&page=${currentPage}&&limit=${limit}&&sort=${filterData.sort}`,
                {
                    method: 'POST',
                },
            );

            const data = await res.json();
            setBlogs(data.blogs);
            setTotalPage(data.total);
        } catch (error) {
            console.log(error);
        }
    };

    const searchUser = async () => {
        setUsers(null);
        try {
            const res = await fetch(`/api/search/users/${query}`, {
                method: 'POST',
            });

            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSearchValue();
    }, [currentPage, query]);

    useEffect(() => {
        searchUser();
    }, [query]);

    const onPageChange = (page) => {
        setBlogs(null);
        setCurrentPage(page);
    };

    return (
        <section className="container mx-auto min-h-screen h-fit justify-center gap-10">
            {/* Search filter */}
            <div className="w-full flex gap-10 pt-12 mb-4">
                <div className="flex gap-4 items-center">
                    <div className="mb-2 block">
                        <Label htmlFor="sort" value="Sort by:" className="whitespace-nowrap font-semibold" />
                    </div>
                    <Select id="sort" required onChange={(e) => setFilterData({ ...filterData, sort: e.target.value })}>
                        <option value={'desc'}>Latest</option>
                        <option value={'asc'}>Oldest</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="category"
                            value="Choose category:"
                            className="whitespace-nowrap font-semibold"
                        />
                    </div>
                    <Select
                        id="category"
                        required
                        onChange={(e) => setFilterData({ ...filterData, category: e.target.value })}
                    >
                        <option>uncategorized</option>
                        <option>programing</option>
                        <option>travel</option>
                        <option>food</option>
                        <option>technology</option>
                        <option>health</option>
                        <option>sport</option>
                        <option>entertainment</option>
                    </Select>
                </div>
                <Button onClick={getSearchValue} gradientMonochrome="teal">
                    Apply Filters
                </Button>
            </div>
            <div className="w-full flex">
                {/* Blog */}
                <div className="border-r-2 h-full w-[70%]">
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p
                            className={`font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block`}
                        >
                            Search result for{' '}
                            <u>
                                <i>{query}</i>
                            </u>
                        </p>
                    </div>

                    {blogs != null ? (
                        blogs.length == 0 ? (
                            <NotFound object={`Not found blog by ${query} search value`} />
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

                {/* User */}
                <div className="h-full pl-4 w-[30%] max-md:hidden">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                            <h1 className="font-medium text-xl mr-1">Search result for User</h1>
                            <FaUser />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {users != null ? (
                                users.length == 0 ? (
                                    <NotFound object={`Not found user by ${query} search value`} />
                                ) : (
                                    <>
                                        {users.map((user, i) => (
                                            <OneByOneAppearFromRightEffect
                                                transition={{ duration: 1, delay: i * 0.15 }}
                                                key={i}
                                            >
                                                <User user={user} />
                                            </OneByOneAppearFromRightEffect>
                                        ))}
                                    </>
                                )
                            ) : (
                                <Spinner className="block mx-auto mt-4" size="xl" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

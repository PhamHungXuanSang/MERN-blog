/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Label, Pagination, Select, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Link, useLocation, useParams } from 'react-router-dom';
import Blog from '../components/Blog';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import NotFound from '../components/NotFound';
import OneByOneAppearFromRightEffect from '../components/OneByOneAppearFromRightEffect';
import InPageNavigation from '../components/InPageNavigation';

export default function Search() {
    const [filterData, setFilterData] = useState({
        sort: 'desc',
        category: 'all category',
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
    const [allCate, setAllCate] = useState(null);

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
        const getAllCategory = async () => {
            const res = await fetch(`/api/category/get-all-category`, {
                method: 'GET',
            });
            const data = await res.json();
            setAllCate(data.allCates);
        };
        getAllCategory();
    }, [currentPage, query]);

    useEffect(() => {
        searchUser();
    }, [query]);

    const onPageChange = (page) => {
        setBlogs(null);
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto min-h-screen h-fit justify-center gap-10">
            {/* Search filter */}
            <div className="w-full flex flex-col md:flex-row gap-4 md:gap-10 pt-12 mb-4">
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
                        <option>all category</option>
                        <option>uncategorized</option>
                        {allCate?.map((cate, i) => (
                            <option key={i}>{cate.categoryName}</option>
                        ))}
                    </Select>
                </div>
                <Button onClick={getSearchValue} gradientMonochrome="teal" className="max-w-[30%] ml-4">
                    Apply Filters
                </Button>
            </div>
            <div className="w-full flex">
                {/* Blog */}
                <div className="w-full md:max-w-[68%]">
                    <InPageNavigation
                        routes={[`Search result for ${query}`, 'Search result for User']}
                        defaultHidden={['Search result for User']}
                    >
                        <>
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
                                            previousLabel=""
                                            nextLabel=""
                                            showIcons
                                        />
                                    </>
                                )
                            ) : (
                                <Spinner className="block mx-auto mt-4" size="xl" />
                            )}
                        </>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center">
                                <h1 className="font-medium text-xl mr-1">Search result for User</h1>
                                <FaUser />
                            </div>
                            <div className="flex gap-2 flex-wrap overflow-hidden">
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
                                                    <Link
                                                        to={`/user/${user.username}`}
                                                        className="flex gap-4 items-center justify-start overflow-hidden border-b mb-1 p-2 dark:hover:bg-slate-600 hover:bg-gray-200 rounded"
                                                    >
                                                        <img src={user.userAvatar} className="w-14 h-14 rounded-full" />
                                                        <div>
                                                            <p className="font-medium text-lg line-clamp-2">
                                                                @{user.username}
                                                            </p>
                                                            <i className="text-gray-500">{user.email}</i>
                                                        </div>
                                                    </Link>
                                                </OneByOneAppearFromRightEffect>
                                            ))}
                                        </>
                                    )
                                ) : (
                                    <Spinner className="block mx-auto mt-4" size="xl" />
                                )}
                            </div>
                        </div>
                    </InPageNavigation>
                </div>

                {/* User */}
                <div className="max-w-[30%] border-l border-gray-300 pl-4 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                            <h1 className="font-medium text-xl mr-1">Search result for User</h1>
                            <FaUser />
                        </div>
                        <div className="flex gap-2 flex-wrap overflow-x-hidden overflow-y-scroll max-h-[350px]">
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
                                                <Link
                                                    to={`/user/${user.username}`}
                                                    className="flex gap-4 items-center justify-start overflow-hidden border-b mb-1 p-2 dark:hover:bg-slate-600 hover:bg-gray-200 rounded"
                                                >
                                                    <img src={user.userAvatar} className="w-12 h-12 rounded-full" />
                                                    <div>
                                                        <p className="font-medium text-lg line-clamp-2">
                                                            @{user.username}
                                                        </p>
                                                        <i className="text-gray-500">{user.email}</i>
                                                    </div>
                                                </Link>
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
        </div>
    );
}

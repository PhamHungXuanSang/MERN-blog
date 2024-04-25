import { Button, Label, Pagination, Select, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotFound from './NotFound';
import OneByOneAppearEffect from './OneByOneAppearEffect';
import MyBlogCard from './MyBlogCard.jsx';

export default function DashAllMyBlog() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [query, setQuery] = useState('');
    const [blogs, setBlogs] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const limit = 2;

    const [filterData, setFilterData] = useState({
        query: query,
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
        getBlogs();
    }, [location.search]);

    const getBlogs = async () => {
        setBlogs(null);
        try {
            const res = await fetch(
                `/api/blog/manage-blogs/${currentUser._id}?&&page=${currentPage}&&limit=${limit}&&sort=${filterData.sort}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filterData),
                },
            );
            const data = await res.json();
            if (res.status === 200) {
                setBlogs(data.blogs);
                setTotalPage(data.total);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        } else {
            let searchQuery = e.target.value;
            setQuery(searchQuery);
            if (e.keyCode === 13 && searchQuery.length) {
                setBlogs(null);
            }
        }
    };

    const handleChange = (e) => {
        setFilterData({ ...filterData, query: e.target.value });
    };

    useEffect(() => {
        getBlogs();
    }, [currentPage]);

    const onPageChange = (page) => {
        setBlogs(null);
        setCurrentPage(page);
    };

    return (
        <div className="py-8 px-4">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">Manage Blogs</p>
            </div>
            <div>
                <div className="w-full flex flex-wrap gap-4 md:gap-16 my-4">
                    <TextInput
                        onChange={handleChange}
                        onKeyDown={handleSearch}
                        type="search"
                        className="w-fit rounded-full placeholder:text-gray-500"
                        placeholder="Search Blogs"
                    />
                    <div className="flex gap-4 items-center">
                        <div className="mb-2 block">
                            <Label htmlFor="sort" value="Sort by:" className="whitespace-nowrap font-semibold" />
                        </div>
                        <Select
                            id="sort"
                            required
                            onChange={(e) => setFilterData({ ...filterData, sort: e.target.value })}
                        >
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
                            <option>programing</option>
                            <option>travel</option>
                            <option>food</option>
                            <option>technology</option>
                            <option>health</option>
                            <option>sport</option>
                            <option>entertainment</option>
                        </Select>
                    </div>
                    <Button onClick={getBlogs} gradientMonochrome="teal">
                        Apply Filters
                    </Button>
                </div>
                {blogs != null ? (
                    blogs.length == 0 ? (
                        <NotFound object={`You don't have any blog`} />
                    ) : (
                        <>
                            {blogs.map((blog, i) => (
                                <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.12 }} key={i}>
                                    <MyBlogCard key={i} blog={blog} setBlogs={setBlogs} />
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
            </div>
        </div>
    );
}

import { Button, Label, Pagination, Select, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import OneByOneAppearEffect from './OneByOneAppearEffect';
import NotFound from './NotFound';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScheduleBlog from './ScheduleBlog';

export default function DashScheduleBlogs() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [query, setQuery] = useState('');
    const [scheduleBlogs, setScheduleBlogs] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [filterData, setFilterData] = useState({
        query: query,
        sort: 'desc',
        category: 'all category',
    });
    const limit = 2;
    const [allCate, setAllCate] = useState(null);

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
        getScheduleBlogs();
        const getAllCategory = async () => {
            const res = await fetch(`/api/category/get-all-not-blocked-category`, {
                method: 'GET',
            });
            const data = await res.json();
            setAllCate(data.allCates);
        };
        getAllCategory();
    }, [location.search]);

    const handleChange = (e) => {
        setFilterData({ ...filterData, query: e.target.value });
    };

    const handleSearch = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        } else {
            let searchQuery = e.target.value;
            setQuery(searchQuery);
            if (e.keyCode === 13 && searchQuery.length) {
                setScheduleBlogs(null);
            }
        }
    };

    const getScheduleBlogs = async () => {
        setScheduleBlogs(null);
        try {
            const res = await fetch(
                `/api/scheduleBlog/schedule-blog-management/${currentUser._id}?&&page=${currentPage}&&limit=${limit}&&sort=${filterData.sort}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filterData),
                },
            );
            const data = await res.json();
            if (res.status === 200) {
                setScheduleBlogs(data.scheduleBlogs);
                setTotalPage(data.total);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onPageChange = (page) => {
        if (currentPage != page) {
            setScheduleBlogs(null);
            setCurrentPage(page);
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">Manage Schedule Blogs</p>
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
                            {allCate?.map((cate, i) => (
                                <option key={i}>{cate.categoryName}</option>
                            ))}
                        </Select>
                    </div>
                    <Button onClick={getScheduleBlogs} gradientMonochrome="teal">
                        Apply Filters
                    </Button>
                </div>
                {scheduleBlogs != null ? (
                    scheduleBlogs.length == 0 ? (
                        <NotFound object={`You don't have any blog`} />
                    ) : (
                        <>
                            {scheduleBlogs.map((blog, i) => (
                                <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.12 }} key={i}>
                                    <ScheduleBlog key={i} blog={blog} setScheduleBlogs={setScheduleBlogs} />
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

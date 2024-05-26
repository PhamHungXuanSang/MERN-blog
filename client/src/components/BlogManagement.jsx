import { useEffect, useState } from 'react';
import NotFound from './NotFound';
import { Button, Label, Select, Spinner, Table, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ModalConfirm from './ModalConfirm';
import { signOutSuccess } from '../redux/user/userSlice.js';
import toast from 'react-hot-toast';
import BackToTopButton from './BackToTopButton.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { extractTime } from '../utils/extractTime.js';

export default function BlogManagement() {
    const [blogs, setBlogs] = useState(null);
    const [showMore, setShowMore] = useState(true);
    const [allBlogs, setAllBlogs] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState('');
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blogIdToBlock, setBlogIdToBlock] = useState('');
    const limit = 5;
    const date = new Date();
    const [filterData, setFilterData] = useState({
        search: null,
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(),
        sort: 'desc',
    });

    const currentUser = useSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGetAdminBlogManagement = async () => {
        try {
            const res = await fetch(`/api/blog/admin-blog-management?page=${1}&&limit=${999999}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id, filterData }),
            });
            const data = await res.json();
            setAllBlogs(data.total);
            if (res.ok) {
                const firstFiveBlogs = data.blogs.slice(0, 5);
                setBlogs(firstFiveBlogs);
                setAllBlogs(data.total);
                if (data.blogs.length <= 5) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetAdminBlogManagement();
    }, []);

    useEffect(() => {
        if (blogs?.length >= allBlogs) {
            setShowMore(false);
        }
    }, [blogs]);

    const handleShowMore = async () => {
        const startIndex = blogs.length;
        try {
            const res = await fetch(`/api/blog/admin-blog-management?startIndex=${startIndex}&&limit=${limit}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id, filterData }),
            });
            const data = await res.json();
            if (res.ok) {
                setBlogs((prev) => [...prev, ...data.blogs]);
                setAllBlogs(data.total);
                if (blogs.length + data.blogs.length >= allBlogs) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteBlog = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/blog/delete-blog/${blogIdToDelete}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (!res.ok) {
                toast.error(data.message, { duration: 6000 });
            } else {
                setBlogs((prev) => prev.filter((blog) => blog._id !== blogIdToDelete));
                setAllBlogs((prev) => prev - 1);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlockBlog = async () => {
        setShowBlockModal(false);
        try {
            const res = await fetch(`/api/blog/block-blog/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blogId: blogIdToBlock }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (!res.ok) {
                toast.error(data.message, { duration: 6000 });
            } else {
                toast.success(data.message, { duration: 6000 });
                setBlogs((prev) => [...prev]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilterBlog = async () => {
        setShowMore(true);
        try {
            const res = await fetch(`/api/blog/admin-blog-management`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filterData, totalBlogDisplayed: blogs?.length }),
            });
            const data = await res.json();
            if (res.ok) {
                setBlogs(data.blogs);
                setAllBlogs(data.total);
                if (data.blogs.length >= data.totalBlogs) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setFilterData((prev) => ({
            ...prev,
            search: value,
        }));
    };

    return (
        <div className="py-8 px-4">
            <div className="flex items-center justify-between w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">Blog Management</p>
                <p>
                    Rows <b>{blogs?.length}</b> of <b>{allBlogs}</b>
                </p>
            </div>
            {/* Filter */}
            <div className="flex items-center gap-4 pb-4 mt-4">
                <div className='flex items-center gap-1'>
                    <Label>Title: </Label>
                    <TextInput value={filterData.search} onChange={handleSearchChange} placeholder="Enter title" />
                </div>
                <div>
                    <Label>From: </Label>
                    <DatePicker
                        className="rounded-md dark:bg-[#1f2937]"
                        selected={filterData.startDate}
                        onChange={(date) => setFilterData({ ...filterData, startDate: date })}
                        dateFormat={'dd/MM/yyyy'}
                        maxDate={new Date()}
                    />
                </div>
                <div>
                    <Label>To: </Label>
                    <DatePicker
                        className="rounded-md dark:bg-[#1f2937]"
                        selected={filterData.endDate}
                        onChange={(date) => setFilterData({ ...filterData, endDate: date })}
                        dateFormat={'dd/MM/yyyy'}
                        maxDate={new Date()}
                    />
                </div>
                <Select id="sort" required onChange={(e) => setFilterData({ ...filterData, sort: e.target.value })}>
                    <option value={'desc'}>Latest</option>
                    <option value={'asc'}>Oldest</option>
                </Select>
                <Button gradientMonochrome="success" onClick={handleFilterBlog}>
                    Filter
                </Button>
            </div>
            {blogs != null ? (
                blogs?.length > 0 ? (
                    <div className="mt-4">
                        <Table hoverable className="shadow-md" striped>
                            <Table.Head>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Title</Table.HeadCell>
                                <Table.HeadCell>Thumbnail</Table.HeadCell>
                                <Table.HeadCell>Date Created</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>Block</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {blogs.map((blog, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white max-w-[180px] py-0 px-4">
                                                <Link to={`/user/${blog.authorId.username}`}>
                                                    {blog.authorId.username}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell className="max-w-[200px] p-0">
                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    className="font-medium text-gray-900 dark:text-white line-clamp-2 break-words"
                                                >
                                                    {blog.title}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link to={`/blog/${blog.slug}`}>
                                                    <img
                                                        src={blog.thumb}
                                                        alt="Thumb"
                                                        className="max-w-20 object-cover bg-gray-400 aspect-auto"
                                                    />
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>{extractTime(blog.createdAt)}</Table.Cell>
                                            <Table.Cell>
                                                <span
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setBlogIdToDelete(blog._id);
                                                    }}
                                                    className="text-red-500 font-medium hover:underline cursor-pointer"
                                                >
                                                    Delete
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span
                                                    onClick={() => {
                                                        setShowBlockModal(true);
                                                        setBlogIdToBlock(blog._id);
                                                    }}
                                                    className={`${blog.isBlocked.status ? 'text-teal-300' : 'text-yellow-300'} font-medium hover:underline cursor-pointer`}
                                                >
                                                    {blog.isBlocked.status ? 'Unlock' : 'Block'}
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                        {showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                                Show more
                            </button>
                        )}
                    </div>
                ) : (
                    <NotFound object={'No blogs found'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal}
                title={`You definitely want to delete this blog ?`}
                onConfirm={handleDeleteBlog}
                onNoConfirm={() => setShowModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
            <ModalConfirm
                showModal={showBlockModal}
                setShowModal={setShowBlockModal}
                title={`You definitely want to block this blog ?`}
                onConfirm={handleBlockBlog}
                onNoConfirm={() => setShowBlockModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
            <BackToTopButton />
        </div>
    );
}

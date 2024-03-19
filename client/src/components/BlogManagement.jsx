import { useEffect, useState } from 'react';
import NotFound from './NotFound';
import { Spinner, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import formatDate from '../utils/formatDate.js';

export default function BlogManagement() {
    const [blogs, setBlogs] = useState(null);
    const [showMore, setShowMore] = useState(true);
    const [allBlogs, setAllBlogs] = useState(0);
    const currentUser = useSelector((state) => state.user.currentUser);
    const handleGetLatestBlogs = async () => {
        try {
            const res = await fetch(`/api/blog/latest-blogs?page=${1}&&limit=${999999}`, {
                method: 'GET',
            });
            const data = await res.json();
            setAllBlogs(data.blogs.length);
            if (res.ok) {
                const firstFiveBlogs = data.blogs.slice(0, 5);
                setBlogs(firstFiveBlogs);
                if (data.blogs.length <= 5) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetLatestBlogs();
    }, []);

    console.log(allBlogs);
    const handleShowMore = async () => {
        const startIndex = blogs.length;
        try {
            const res = await fetch(`/api/blog/latest-blogs?startIndex=${startIndex}&&limit=${5}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.ok) {
                setBlogs((prev) => [...prev, ...data.blogs]);
                if (blogs.length <= allBlogs) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="py-12 px-4 table-auto overflow-x-scroll md:mx-auto p-3 scrollbarssssss">
            {blogs != null ? (
                blogs?.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md" striped>
                            <Table.Head>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Title</Table.HeadCell>
                                <Table.HeadCell>Thumbnail</Table.HeadCell>
                                <Table.HeadCell>Date Created</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>
                                    <span className="sr-only">Edit</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {blogs.map((blog, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                <Link to={`/user/${blog.authorId.username}`}>
                                                    {blog.authorId.username}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    className="font-medium text-gray-900 dark:text-white"
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
                                            <Table.Cell>{new Date(blog.updatedAt).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>{blog.category}</Table.Cell>
                                            <Table.Cell>
                                                <span className="text-red-500 font-medium hover:underline cursor-pointer">
                                                    Delete
                                                </span>
                                            </Table.Cell>
                                            {currentUser._id == blog.authorId._id ? (
                                                <Table.Cell>
                                                    <Link
                                                        to={`/editor/${blog.slug}`}
                                                        className="font-medium text-teal-600 hover:underline dark:text-teal-500"
                                                    >
                                                        Edit
                                                    </Link>
                                                </Table.Cell>
                                            ) : (
                                                <Table.Cell></Table.Cell>
                                            )}
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
                    </>
                ) : (
                    <NotFound object={'No blogs found'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
        </div>
    );
}

import { useEffect, useState } from 'react';
import NotFound from './NotFound';
import { Spinner, Table } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ModalConfirm from './ModalConfirm';
import { signOutSuccess } from '../redux/user/userSlice.js';

export default function BlogManagement() {
    const [blogs, setBlogs] = useState(null);
    const [showMore, setShowMore] = useState(true);
    const [allBlogs, setAllBlogs] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                console.log(data.message);
            } else {
                setBlogs((prev) => prev.filter((blog) => blog._id !== blogIdToDelete));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        // <div className="py-12 px-4 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
        <div className="py-12 px-4">
            {blogs != null ? (
                blogs?.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md" striped>
                            <Table.Head>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Title</Table.HeadCell>
                                <Table.HeadCell>Thumbnail</Table.HeadCell>
                                <Table.HeadCell>Date Created</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>
                                    <span className="sr-only">Edit</span>
                                </Table.HeadCell>
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
                                            <Table.Cell className="">
                                                <Link to={`/blog/${blog.slug}`}>
                                                    <img
                                                        src={blog.thumb}
                                                        alt="Thumb"
                                                        className="max-w-20 object-cover bg-gray-400 aspect-auto"
                                                    />
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>{new Date(blog.updatedAt).toLocaleDateString()}</Table.Cell>
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
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal} // Giả định rằng setShowModal là một hàm setState từ component cha
                title={`You definitely want to delete this blog ?`}
                onConfirm={handleDeleteBlog}
                onNoConfirm={() => setShowModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
        </div>
    );
}

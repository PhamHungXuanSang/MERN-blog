/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Button, Spinner, Table } from 'flowbite-react';

export default function MainBoardManagement() {
    const [users, setUsers] = useState(null);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    const [blogs, setBlogs] = useState(null);
    const [lastMonthBlogs, setLastMonthBlogs] = useState(0);
    const [totalBlogs, setTotalBlogs] = useState(0);

    const [comments, setComments] = useState(null);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    const currentUser = useSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/get-all-user?limit=5`, {
                    method: 'GET',
                });
                const data = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                }
                if (res.ok) {
                    setUsers(data.users);
                    setLastMonthUsers(data.lastMonthUsers);
                    setTotalUsers(data.totalUsers);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`/api/blog/admin-blog-management?page=1&&startIndex=0&&limit=5`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser._id }),
                });
                const data = await res.json();
                if (res.ok) {
                    setBlogs(data.blogs);
                    setLastMonthBlogs(data.lastMonthBlogs); // Chuaw cos
                    setTotalBlogs(data.total);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/get-all-comment?limit=5&&sort=desc`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setLastMonthComments(data.lastMonthComments);
                    setTotalComments(data.totalComments);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchBlogs();
            fetchComments();
        }
    }, [currentUser]);

    return (
        <div className="py-8 px-4 md:mx-auto">
            <div className="flex-wrap flex gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    {users != null ? (
                        <>
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-gray-500 text-lg uppercase">Total Users</h3>
                                    <p className="text-2xl">{totalUsers}</p>
                                </div>
                                <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full p-3 text-5xl shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {lastMonthUsers}
                                </span>
                                <div className="text-gray-500">Last month</div>
                            </div>
                        </>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="md" />
                    )}
                </div>

                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    {blogs != null ? (
                        <>
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-gray-500 text-lg uppercase">Total Blogs</h3>
                                    <p className="text-2xl">{totalBlogs}</p>
                                </div>
                                <HiDocumentText className="bg-lime-600 text-white rounded-full p-3 text-5xl shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {lastMonthBlogs}
                                </span>
                                <div className="text-gray-500">Last month</div>
                            </div>
                        </>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="md" />
                    )}
                </div>

                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    {comments != null ? (
                        <>
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-gray-500 text-lg uppercase">Total Comments</h3>
                                    <p className="text-2xl">{totalComments}</p>
                                </div>
                                <HiAnnotation className="bg-indigo-600 text-white rounded-full p-3 text-5xl shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {lastMonthComments}
                                </span>
                                <div className="text-gray-500">Last month</div>
                            </div>
                        </>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="md" />
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h3 className="text-center p-2">RECENT USERS</h3>
                        <Button outline gradientDuoTone="greenToBlue">
                            <Link to={'/admin?tab=user-management'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell className="text-center p-2">User avatar</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Username</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Joined on</Table.HeadCell>
                        </Table.Head>
                        {users ? (
                            users.map((user, i) => {
                                return (
                                    <Table.Body key={i} className="divide-y text-center">
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="p-2">
                                                <Link to={`/user/${user.username}`}>
                                                    <img
                                                        src={user.userAvatar}
                                                        alt="avatar"
                                                        className="w-10 h-10 rounded-full bg-gray-500 mx-auto"
                                                    />
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell className="p-2">
                                                <Link to={`/user/${user.username}`}>{user.username}</Link>
                                            </Table.Cell>
                                            <Table.Cell className="p-2">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                );
                            })
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="sm" />
                        )}
                    </Table>
                </div>

                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h3 className="text-center p-2">RECENT BLOGS</h3>
                        <Button outline gradientMonochrome="success">
                            <Link to={'/admin?tab=blog-management'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell className="text-center p-2">Blog Thumbnail</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Blog title</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Author</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Created at</Table.HeadCell>
                        </Table.Head>
                        {blogs ? (
                            blogs.map((blog, i) => {
                                return (
                                    <Table.Body key={i} className="divide-y text-center">
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="p-2">
                                                <img
                                                    src={blog.thumb}
                                                    alt="avatar"
                                                    className="max-w-20 rounded-sm bg-gray-500 mx-auto"
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="p-1 max-w-[360px] break-words line-clamp-2">
                                                {blog.title}
                                            </Table.Cell>
                                            <Table.Cell className="p-2">{blog.authorId.username}</Table.Cell>
                                            <Table.Cell className="p-2">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                );
                            })
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="sm" />
                        )}
                    </Table>
                </div>

                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h3 className="text-center p-2">RECENT COMMENTS</h3>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell className="text-center p-2">User avatar</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Username</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Content</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Type</Table.HeadCell>
                            <Table.HeadCell className="text-center p-2">Commented at</Table.HeadCell>
                        </Table.Head>
                        {comments ? (
                            comments.map((comment, i) => {
                                return (
                                    <Table.Body key={i} className="divide-y">
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="p-2">
                                                <img
                                                    src={comment.commentedBy.userAvatar}
                                                    alt="avatar"
                                                    className="w-10 h-10 rounded-full bg-gray-500  mx-auto"
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="p-2">{comment.commentedBy.username}</Table.Cell>
                                            <Table.Cell className="p-2 max-w-[360px] break-words line-clamp-2">
                                                {comment.content}
                                            </Table.Cell>
                                            <Table.Cell className="p-2">
                                                {comment.isReply ? 'Reply' : 'Comment'}
                                            </Table.Cell>
                                            <Table.Cell className="p-2">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                );
                            })
                        ) : (
                            <Spinner className="block mx-auto mt-4" size="sm" />
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
}

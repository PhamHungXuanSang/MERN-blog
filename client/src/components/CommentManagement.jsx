import { Button, Label, Select, Spinner, Table } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import NotFound from './NotFound';
import ModalConfirm from './ModalConfirm';
import BackToTopButton from './BackToTopButton';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

export default function CommentManagement() {
    const [comments, setComments] = useState(null);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const date = new Date();
    const [filterData, setFilterData] = useState({
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(),
        sort: 'desc',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGetAdminCommentManagement = async () => {
        try {
            const res = await fetch(`/api/comment/get-all-comment?sort=desc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filterData }),
            });
            const data = await res.json();
            if (res.ok) {
                setComments(data.comments);
                if (comments?.length + data.comments.length >= data.totalComments) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetAdminCommentManagement();
    }, []);

    const handleDeleteComment = async () => {
        setShowModal(!showModal);
        try {
            const res = await fetch('/api/comment/delete-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: commentIdToDelete }),
            });
            await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            toast.success('Comment deleted');
            setComments(comments.filter((comment) => comment._id != commentIdToDelete));
        } catch (error) {
            console.log(error);
        }
    };
    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/get-all-comment?startIndex=${startIndex}&&sort=desc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filterData }),
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (comments.length + data.comments.length >= data.totalComments) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilterComment = async () => {
        setShowMore(true);
        try {
            const res = await fetch(`/api/comment/get-all-comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filterData, totalCommentDisplayed: comments?.length }),
            });
            const data = await res.json();
            if (res.ok) {
                setComments(data.comments);
                if (data.comments.length >= data.totalComments) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="py-8 px-4">
            {/* Filter */}
            <div className="flex items-center gap-4 pb-4">
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
                <Button gradientMonochrome="success" onClick={handleFilterComment}>
                    Filter
                </Button>
            </div>
            {/* Table */}
            {comments != null ? (
                comments?.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md" striped>
                            <Table.Head>
                                <Table.HeadCell>User avatar</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Content</Table.HeadCell>
                                <Table.HeadCell>Type</Table.HeadCell>
                                <Table.HeadCell>Commented at</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {comments.map((comment, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="p-2">
                                                <img
                                                    src={comment.commentedBy.userAvatar}
                                                    alt="avatar"
                                                    className="w-10 h-10 rounded-full bg-gray-500  mx-auto"
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white max-w-[180px] py-0 px-4">
                                                <Link to={`/user/${comment.commentedBy.username}`}>
                                                    {comment.commentedBy.username}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell className="p-2 max-w-[360px] break-words">
                                                {comment.content}
                                            </Table.Cell>
                                            <Table.Cell className="p-2">
                                                {comment.isReply ? 'Reply' : 'Comment'}
                                            </Table.Cell>
                                            <Table.Cell className="p-2">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setCommentIdToDelete(comment._id);
                                                    }}
                                                    className="text-red-500 font-medium hover:underline cursor-pointer"
                                                >
                                                    Delete
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
                    </>
                ) : (
                    <NotFound object={'No comments found'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal}
                title={`You definitely want to delete this comment?`}
                onConfirm={handleDeleteComment}
                onNoConfirm={() => setShowModal(false)}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
            <BackToTopButton />
        </div>
    );
}

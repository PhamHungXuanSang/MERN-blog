/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../pages/ReadBlog';
import { FaRegHeart, FaHeart, FaCommentDots } from 'react-icons/fa';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Label, Modal, Radio, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchComments } from './CommentsContainer.jsx';
import { IoSaveSharp } from 'react-icons/io5';
import { IoIosAdd } from 'react-icons/io';
import toast from 'react-hot-toast';

export default function BlogAction() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let { blog, setBlog, setCommentsWrapper } = useContext(BlogContext);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [showModal, setShowModal] = useState(false);
    const [folder, setFolder] = useState('');
    const [createFolder, setCreateFolder] = useState('');
    const [folders, setFolders] = useState([]);

    const handleRadioChange = (e) => {
        setFolder(e.target.value);
    };

    useEffect(() => {
        if (currentUser && blog.likes.length > 0) {
            let isUserHasLiked = blog.likes.some((like) => like == currentUser._id);
            setLiked(isUserHasLiked);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const handleLikeBlog = async () => {
        if (!currentUser) {
            return navigate('/sign-in');
        }
        setLiked(!liked);
        try {
            const res = await fetch(`/api/blog/update-like-blog/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blog),
            });
            const result = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                let comments = await fetchComments({
                    blogId: result.blog._id,
                });
                result.blog.comments = comments;
                setBlog(result.blog);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddNewFolder = async () => {
        if (createFolder == '') return toast.error('Please name folder first');
        try {
            const res = await fetch(`/api/usersFolder/add-new-folder/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderName: createFolder }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status === 200) {
                document.querySelector('#folderName').value = '';
                setFolders((prev) => [...prev, data.folderName]);
                setCreateFolder('');
            } else {
                return toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowFolders = async () => {
        try {
            // Call api lấy danh sách folders của tài khoản
            const res = await fetch(`/api/usersFolder/get-user-folders/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            setFolders(data.folderNameArr);
            setShowModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSaveBlog = async () => {
        if (folder == '') {
            return toast.error('Please choose folder to save blog');
        }
        try {
            const res = await fetch(`/api/usersFolder/save-blog-to-folder/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderName: folder, blogId: blog._id }),
            });

            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status === 200) {
                toast.success(`Blog has been added to ${folder}`);
                setShowModal(false);
                setFolder('');
            } else {
                return toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return !loading ? (
        <>
            <hr className="border-gray-300 my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-6">
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={handleLikeBlog}
                            className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700 bg-gray-300"
                        >
                            {liked ? <FaHeart color="#ed1a1a" /> : <FaRegHeart />}
                        </button>
                        <p className="text-xl">{blog.likeCount}</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => setCommentsWrapper((preValue) => !preValue)}
                            className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700 bg-gray-300"
                        >
                            <FaCommentDots />
                        </button>
                        <p className="text-xl">{blog.commentCount}</p>
                    </div>

                    {currentUser && blog.authorId._id != currentUser?._id && (
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={handleShowFolders}
                                className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700 bg-gray-300"
                            >
                                <IoSaveSharp />
                            </button>
                        </div>
                    )}

                    {blog.authorId._id == currentUser?._id && (
                        <Link to={`/editor/${blog.slug}`}>
                            <Button gradientDuoTone="greenToBlue" outline>
                                Edit blog
                            </Button>
                        </Link>
                    )}
                </div>

                <FacebookShareButton url={location.href}>
                    <FacebookIcon size={40} round={true} />
                </FacebookShareButton>
            </div>
            <hr className="border-gray-300 my-2" />
            {showModal && (
                <Modal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setFolder('');
                    }}
                    popup
                    size="md"
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                Select or create an archive folder
                            </h3>
                            <div className="flex justify-center items-center gap-2 my-4">
                                <TextInput
                                    id="folderName"
                                    placeholder="Name the folder"
                                    type="text"
                                    onChange={(e) => setCreateFolder(e.target.value)}
                                />
                                <Button outline gradientMonochrome="failure" onClick={handleAddNewFolder}>
                                    <IoIosAdd className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="mx-auto rounded-lg bg-slate-200 p-2 mb-4">
                                {folders.length > 0 ? (
                                    folders.map((folder, i) => {
                                        return (
                                            <div key={i} className="flex items-center gap-2 px-2 py-1 cursor-pointer">
                                                <Radio
                                                    id={folder}
                                                    name="folder"
                                                    value={folder}
                                                    onChange={handleRadioChange}
                                                />
                                                <Label htmlFor={folder}>{folder}</Label>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <i>Please add new folder</i>
                                )}
                            </div>
                            <Button
                                className="mx-auto"
                                disabled={folder != '' ? false : true}
                                gradientDuoTone={'greenToBlue'}
                                outline
                                onClick={handleSaveBlog}
                            >
                                Save blog
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    ) : (
        <Spinner aria-label="Spinner button example" size="sm" />
    );
}

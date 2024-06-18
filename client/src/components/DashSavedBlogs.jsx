/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './NotFound';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import Blog from './Blog.jsx';
import toast from 'react-hot-toast';

export default function DashSavedBlogs() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [folders, setFolders] = useState(null);
    const [folder, setFolder] = useState('all');
    const [blogs, setBlogs] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleShowBlogsByFolder = async () => {
            try {
                const res = await fetch(`/api/usersFolder/get-blogs-by-folder/${currentUser._id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ folder }),
                });
                const data = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                }
                if (res.ok) {
                    if (data.folderNameArr.length > 0) {
                        setFolders(['all', ...data.folderNameArr]);
                        setBlogs(data.blogs);
                    } else {
                        setFolders([]);
                        setBlogs(data.blogs);
                    }
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        handleShowBlogsByFolder();
    }, [folder]);

    const handleChangeFolder = (e) => {
        let btn = e.target;
        if (folder != btn.innerHTML) {
            setBlogs(null);
            setFolder(btn.innerHTML);
        }
    };

    const handleDeleteFolder = async (folderName) => {
        try {
            const res = await fetch(`/api/usersFolder/delete-folder/${currentUser._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderName }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setFolders(['all', ...data.folderNameArr]);
                setBlogs(data.blogs);
                setFolder('all');
                return toast.success(`Folder ${folderName} has been removed`, { duration: 3000 });
            } else {
                return toast.error(data.message, { duration: 6000 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteSavedBlog = async (blogId, folderName) => {
        try {
            const res = await fetch(`/api/usersFolder/delete-blog-in-folder/${currentUser._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blogId, folderName }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setBlogs(data.blogs);
                return toast.success(`Blog has been removed from ${folderName}`, { duration: 3000 });
            } else {
                return toast.error(data.message, { duration: 6000 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-auto py-12">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block">
                    Saved Blogs
                </p>
            </div>
            <div className="my-8 flex flex-wrap gap-4">
                {folders != null ? (
                    folders.length > 0 ? (
                        folders.map((folderName, i) => {
                            return (
                                <div key={i} className="relative group">
                                    <button
                                        className={
                                            'rounded-3xl px-3 py-0.5' +
                                            (folderName === folder
                                                ? 'dark:bg-gray-500 dark:text-white bg-gray-400 text-white'
                                                : 'dark:bg-slate-500 dark:text-black bg-gray-200')
                                        }
                                        onClick={handleChangeFolder}
                                    >
                                        {folderName}
                                    </button>
                                    {i != 0 && (
                                        <div
                                            onClick={() => handleDeleteFolder(folderName)}
                                            className="absolute hidden group-hover:block hover:scale-125 duration-300 cursor-pointer bottom-3 right-[-12px] rounded-full px-2 bg-red-600"
                                        >
                                            x
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <NotFound object={'Not found any folders'} />
                    )
                ) : (
                    <div className="w-full">
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    </div>
                )}
            </div>
            {folders != null && folders.length > 0 ? (
                blogs && blogs.length > 0 ? (
                    blogs.map((blog, i) => {
                        return (
                            <div key={i} className="relative group">
                                <Blog content={blog} author={blog.authorId} />
                                <div
                                    onClick={() => handleDeleteSavedBlog(blog._id, folder)}
                                    className="absolute hidden group-hover:block hover:scale-125 duration-300 cursor-pointer top-[-4px] right-[-12px] rounded-full px-2 bg-red-600"
                                >
                                    x
                                </div>
                            </div>
                        );
                    })
                ) : blogs == null ? (
                    <Spinner className="block mx-auto mt-4" size="xl" />
                ) : (
                    <NotFound object={'Not found any blogs, choose another folder'} />
                )
            ) : (
                ''
            )}
        </div>
    );
}

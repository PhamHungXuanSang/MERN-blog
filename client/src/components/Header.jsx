/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Navbar, TextInput } from 'flowbite-react';
import { Avatar, Dropdown } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { FaMoon, FaSun } from 'react-icons/fa';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { darkModeToogle } from '../redux/theme/themeSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../App.jsx';
import { useEffect, useRef, useState } from 'react';
import BlogFastSearch from './BlogFastSearch.jsx';
import UserFastSearch from './UserFastSearch.jsx';

export default function Header() {
    const timeoutIdRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const darkModeObj = useSelector((state) => state.darkMode);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const checkNewNoti = async () => {
    //     try {
    //         const res = await fetch(`/api/notification/newNotification/${currentUser._id}`, {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         const data = await res.json();
    //         if (res.status === 403) {
    //             dispatch(signOutSuccess());
    //             return navigate('/sign-in');
    //         }
    //         dispatch(setCurrentUser({ ...currentUser, newNotification: data.length > 0 }));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/auth/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                socket.emit('signOut', currentUser._id.toString());
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleFastSearch = () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            timeoutIdRef.current = setTimeout(async () => {
                try {
                    const res = await fetch(`/api/search/${searchValue || null}`, {
                        method: 'POST',
                    });
                    const data = await res.json();
                    setBlogs(data.blogs.length ? data.blogs : null);
                    setUsers(data.users.length ? data.users : null);
                } catch (error) {
                    console.log(error);
                }
            }, 500);
            return () => {
                if (timeoutIdRef.current) {
                    clearTimeout(timeoutIdRef.current);
                }
            };
        };
        handleFastSearch();
    }, [searchValue]);

    const handleTypeSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.keyCode == 13 && e.target.value.length) {
            setBlogs(null);
            setUsers(null);
            navigate(`/search/${e.target.value}`);
        }
        if (!e.target.value.length) {
            setBlogs(null);
            setUsers(null);
        }
    };

    return (
        <Navbar className="border-b-2">
            <Link to="/" className="seft-center font-semibold text-sm sm:text-xl dark:text-white">
                <span className="px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                    MERN Blog
                </span>
            </Link>
            <div className="relative">
                <TextInput
                    type="text"
                    placeholder="Type to search"
                    rightIcon={LuSearch}
                    className="hidden lg:inline"
                    onKeyDown={handleSearch}
                    onChange={handleTypeSearch}
                    value={searchValue}
                />
                {blogs?.length || users?.length ? (
                    <div className="absolute z-10 w-80 h-fit bg-slate-100 dark:bg-[#1f2937] top-[130%] right-[-50px] rounded p-4 shadow-2xl max-h-60 overflow-y-scroll overflow-x-hidden scrollbar-thin">
                        {blogs ? (
                            <div className="mb-6">
                                <i className="block pb-2 text-sm font-semibold">Related articles</i>
                                <hr></hr>
                                {blogs.slice(0, 5)?.map((blog, i) => {
                                    return (
                                        <div
                                            className="dark:hover:bg-slate-600 hover:bg-gray-100 rounded border-b border-gray-500 mb-2 py-1"
                                            key={i}
                                            onClick={() => {
                                                setBlogs(null);
                                                setUsers(null);
                                            }}
                                        >
                                            <BlogFastSearch blog={blog} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            ''
                        )}
                        {users ? (
                            <div>
                                <i className="block pb-2 text-sm font-semibold">Related users</i>
                                <hr></hr>
                                {users.slice(0, 5)?.map((user, i) => {
                                    return (
                                        <div
                                            className="dark:hover:bg-slate-600 hover:bg-gray-100 rounded border-b border-gray-500 mb-2 py-1"
                                            key={i}
                                            onClick={() => {
                                                setBlogs(null);
                                                setUsers(null);
                                            }}
                                        >
                                            <UserFastSearch user={user} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                ) : (
                    ''
                )}
            </div>
            <Button className="lg:hidden w-12 h-10" pill color="gray">
                <LuSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button
                    className="hidden w-12 h-10 sm:inline"
                    pill
                    color="gray"
                    onClick={() => dispatch(darkModeToogle())}
                >
                    {darkModeObj.darkMode === 'light' ? <FaMoon /> : <FaSun />}
                </Button>
                {currentUser ? (
                    <div>
                        <Dropdown
                            label={
                                <Avatar
                                    //onClick={checkNewNoti}
                                    alt="User settings"
                                    img={currentUser.userAvatar}
                                    rounded
                                />
                            }
                            arrowIcon={false}
                            inline
                        >
                            <Dropdown.Header>
                                <span className="block text-sm">@{currentUser.username}</span>
                                <span className="block truncate text-sm font-medium">{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/notification'}>
                                <Dropdown.Item className="flex gap-1 items-center">
                                    Notification
                                    {currentUser?.newNotification == true && (
                                        <i className="px-2 rounded-full bg-red-500 text-sm font-thin">New</i>
                                    )}
                                </Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Link to={'/dash-board?tab=profile'}>
                                <Dropdown.Item>Dashboard</Dropdown.Item>
                            </Link>
                            {currentUser.isAdmin && (
                                <>
                                    <Dropdown.Divider />
                                    <Link to={'/admin?tab=main-board'}>
                                        <Dropdown.Item>Admin</Dropdown.Item>
                                    </Link>
                                </>
                            )}
                            <Dropdown.Divider />
                            <Link to={'/change-password'}>
                                <Dropdown.Item>Setting</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                        </Dropdown>
                    </div>
                ) : (
                    <Link to={'/sign-in'}>
                        <Button outline gradientDuoTone="greenToBlue">
                            Sign in
                        </Button>
                    </Link>
                )}
                {/* <Navbar.Toggle/> */}
                <button
                    type="button"
                    className="-ml-3 mr-1 p-2 md:hidden"
                    onClick={() => {
                        document.getElementById('side-bar')?.classList.toggle('hidden');
                    }}
                >
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        aria-label="Open sidebar"
                        className="size-6 cursor-pointer text-gray-600 dark:text-gray-300"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </div>
        </Navbar>
    );
}

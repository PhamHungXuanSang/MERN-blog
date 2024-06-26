/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Navbar, TextInput } from 'flowbite-react';
import { Avatar, Dropdown } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { FaMoon, FaSun } from 'react-icons/fa';
import { setCurrentUser, signOutSuccess } from '../redux/user/userSlice.js';
import { darkModeToogle } from '../redux/theme/themeSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../App.jsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import BlogFastSearch from './BlogFastSearch.jsx';
import UserFastSearch from './UserFastSearch.jsx';
import toast from 'react-hot-toast';
import { BiSolidDashboard } from 'react-icons/bi';
import { FaRocketchat } from 'react-icons/fa6';

export default function Header() {
    const timeoutIdRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const darkModeObj = useSelector((state) => state.darkMode);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const isDashboard = useMemo(() => {
        return location.pathname === '/dash-board';
    }, [location]);

    const checkNewNoti = async () => {
        try {
            const res = await fetch(`/api/notification/newNotification/${currentUser._id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            dispatch(setCurrentUser({ ...currentUser, newNotification: data }));
        } catch (error) {
            console.log(error);
        }
    };

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
            }, 100);
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
        <div className="relative">
            <Navbar className="border-b-2 h-[60px]">
                <Link to="/" className="seft-center font-semibold text-sm sm:text-xl dark:text-white">
                    <span className="md:px-3 px-0.5 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                        MERN Blog
                    </span>
                </Link>
                <div className="relative">
                    <TextInput
                        type="text"
                        placeholder="Type to search"
                        rightIcon={LuSearch}
                        className="hidden md:inline"
                        onKeyDown={handleSearch}
                        onChange={handleTypeSearch}
                        value={searchValue}
                    />
                    {blogs?.length || users?.length ? (
                        <div className="absolute hidden md:block z-10 w-80 h-fit bg-slate-100 dark:bg-[#1f2937] top-[130%] right-[-50px] rounded p-4 shadow-2xl max-h-60 overflow-y-scroll overflow-x-hidden scrollbar-thin">
                            {blogs ? (
                                <div className="mb-6">
                                    <i className="block pb-2 text-sm font-semibold">Related articles</i>
                                    <hr></hr>
                                    {blogs.slice(0, 5)?.map((blog, i) => {
                                        return (
                                            <div
                                                className="dark:hover:bg-slate-600 hover:bg-gray-200 rounded border-b border-gray-500 mb-2 py-1"
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
                                                className="overflow-x-hidden dark:hover:bg-slate-600 hover:bg-gray-200 rounded border-b border-gray-500 mb-2 py-1"
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
                <Button
                    className="md:hidden w-10 h-10"
                    pill
                    color="gray"
                    onClick={() => document.querySelector('#searchInput').classList.toggle('hidden')}
                >
                    <LuSearch />
                </Button>

                <div className="flex md:gap-2 gap-0.5 md:order-2 items-center">
                    <Button
                        className="w-10 md:w-16 h-10 flex items-center justify-center"
                        pill
                        color="gray"
                        onClick={() => {
                            if (!currentUser) return toast.error('Please sign in to chat');
                            return navigate('/chat');
                        }}
                    >
                        <FaRocketchat size={20} />
                    </Button>
                    <Button
                        className="w-[46px] h-10 inline"
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
                                        onClick={checkNewNoti}
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
                                            <i className="px-2 rounded-full bg-red-500 text-sm font-medium">New</i>
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
                            <button className="border-2 border-orange-500 rounded-lg p-0.5 md:px-2 md:py-1 font-semibold hover:bg-orange-500 dark:text-orange-200 text-orange-500 hover:text-white text-sm md:text-base">
                                Sign in
                            </button>
                        </Link>
                    )}
                    {isDashboard && (
                        <button
                            type="button"
                            className="-ml-1 px-[2px] py-2 md:hidden"
                            onClick={() => {
                                document.getElementById('side-bar')?.classList.toggle('hidden');
                            }}
                        >
                            <BiSolidDashboard size={20} />
                        </button>
                    )}
                </div>
            </Navbar>
            <div className="hidden absolute top-[60px] w-full z-30" id="searchInput">
                <TextInput
                    type="text"
                    placeholder="Type to search"
                    className="relative"
                    id="mobileInput"
                    onKeyDown={handleSearch}
                    onChange={handleTypeSearch}
                    value={searchValue}
                />
                <LuSearch
                    className="absolute right-4 top-3"
                    onClick={() => {
                        setBlogs(null);
                        setUsers(null);
                        let inputValue = document.querySelector('#mobileInput').value;
                        if (inputValue.length > 0) {
                            navigate(`/search/${inputValue}`);
                        } else {
                            toast.error('Please enter search value', { duration: 3000 });
                        }
                    }}
                />
            </div>
        </div>
    );
}

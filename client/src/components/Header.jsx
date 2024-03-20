import { Button, Navbar, TextInput } from 'flowbite-react';
import { Avatar, Dropdown } from 'flowbite-react';

// eslint-disable-next-line no-unused-vars
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { FaMoon, FaSun } from 'react-icons/fa';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { darkModeToogle } from '../redux/theme/themeSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../utils/socket.js';

export default function Header() {
    // const path = useLocation().pathname;
    const currentUser = useSelector((state) => state.user.currentUser);
    const darkModeObj = useSelector((state) => state.darkMode);

    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    const handleSearch = (e) => {
        if (e.keyCode == 13 && e.target.value.length) {
            navigate(`/search/${e.target.value}`);
        }
    };

    return (
        <Navbar className="border-b-2">
            <Link to="/" className="seft-center font-semibold text-sm sm:text-xl dark:text-white">
                <span className="px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                    MERN Blog
                </span>
            </Link>
            {/* <form> */}
            <TextInput
                type="text"
                placeholder="Type to search"
                rightIcon={LuSearch}
                className="hidden lg:inline"
                onKeyDown={handleSearch}
            />
            {/* </form> */}
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
                    <Dropdown
                        label={<Avatar alt="User settings" img={currentUser.userAvatar} rounded />}
                        arrowIcon={false}
                        inline
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">@{currentUser.username}</span>
                            <span className="block truncate text-sm font-medium">{currentUser.email}</span>
                        </Dropdown.Header>
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
                        <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to={'/sign-in'}>
                        <Button outline gradientDuoTone="greenToBlue">
                            Sign in
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
            {/* <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to="/">Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to="/about">About</Link>
                </Navbar.Link>
            </Navbar.Collapse> */}
        </Navbar>
    );
}

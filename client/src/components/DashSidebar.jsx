import { Sidebar } from 'flowbite-react';
import { MdLocalOffer, MdFolderSpecial } from 'react-icons/md';
import { IoCreateSharp } from 'react-icons/io5';
import { HiDocumentText } from 'react-icons/hi';
import { HiMiniClipboardDocumentCheck } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import checkCreatePermission from '../utils/checkCreatePermission.js';
import { setCurrentUser } from '../redux/user/userSlice.js';
import { AiOutlineTransaction, AiFillSchedule } from 'react-icons/ai';
import { FaInfoCircle } from 'react-icons/fa';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const setCreatePermission = async () => {
            const rs = await checkCreatePermission(currentUser._id);
            if (rs) {
                dispatch(setCurrentUser(rs));
            }
        };

        setCreatePermission();
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const toggleHiddenSidebar = () => {
        document.getElementById('side-bar')?.classList.toggle('hidden');
    };

    return (
        <Sidebar
            aria-label="Sidebar with content separator example"
            className="w-full hidden md:block md:max-h-full"
            id="side-bar"
        >
            <Sidebar.Items className="pt-8">
                <Sidebar.ItemGroup>
                    <span className="text-2xl font-semibold pl-2">Profile</span>
                    <Link to="/dash-board?tab=profile">
                        <Sidebar.Item
                            onClick={() => toggleHiddenSidebar()}
                            active={tab === 'profile'}
                            label={currentUser.isAdmin ? 'Admin' : 'User'}
                            labelColor="dark"
                            as="div"
                            className="mt-2"
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Link to="/dash-board?tab=update-profile">
                        <Sidebar.Item
                            onClick={() => toggleHiddenSidebar()}
                            className="mt-1"
                            active={tab === 'update-profile'}
                            labelColor="dark"
                            as="div"
                        >
                            Update profile
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <span className="text-2xl font-semibold pl-2">Blog</span>
                    {currentUser.isAdmin || currentUser.createPermission ? (
                        <>
                            <Link to="/dash-board?tab=create-blog">
                                <Sidebar.Item
                                    onClick={() => toggleHiddenSidebar()}
                                    className="mt-2"
                                    active={tab === 'create-blog'}
                                    icon={IoCreateSharp}
                                >
                                    Create blog
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dash-board?tab=schedule-list">
                                <Sidebar.Item
                                    onClick={() => toggleHiddenSidebar()}
                                    className="mt-1"
                                    active={tab === 'schedule-list'}
                                    icon={AiFillSchedule}
                                >
                                    Schedule list
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dash-board?tab=all-blog">
                                <Sidebar.Item
                                    onClick={() => toggleHiddenSidebar()}
                                    className="mt-1"
                                    active={tab === 'all-blog'}
                                    icon={HiDocumentText}
                                >
                                    All my blog
                                </Sidebar.Item>
                            </Link>
                        </>
                    ) : (
                        <Link to="/offer">
                            <Sidebar.Item onClick={() => toggleHiddenSidebar()} className="mt-2" icon={MdLocalOffer}>
                                Create blog offer
                            </Sidebar.Item>
                        </Link>
                    )}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <span className="text-2xl font-semibold pl-2">History</span>
                    <>
                        <Link to="/dash-board?tab=recently-viewed">
                            <Sidebar.Item
                                onClick={() => toggleHiddenSidebar()}
                                className="mt-1"
                                active={tab === 'recently-viewed'}
                                icon={HiMiniClipboardDocumentCheck}
                            >
                                Recently viewed
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dash-board?tab=saved-blogs">
                            <Sidebar.Item
                                onClick={() => toggleHiddenSidebar()}
                                className="mt-1"
                                active={tab === 'saved-blogs'}
                                icon={MdFolderSpecial}
                            >
                                Saved blogs
                            </Sidebar.Item>
                        </Link>
                    </>
                </Sidebar.ItemGroup>
                {!currentUser.isAdmin && (
                    <Sidebar.ItemGroup>
                        <span className="text-2xl font-semibold pl-2">Transaction</span>
                        <>
                            <Link to="/offer">
                                <Sidebar.Item
                                    onClick={() => toggleHiddenSidebar()}
                                    className="mt-2"
                                    icon={MdLocalOffer}
                                >
                                    Buy package
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dash-board?tab=usage">
                                <Sidebar.Item
                                    onClick={() => toggleHiddenSidebar()}
                                    className="mt-2"
                                    active={tab === 'usage'}
                                    icon={FaInfoCircle}
                                >
                                    Account usage
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dash-board?tab=transaction">
                                <Sidebar.Item
                                    onClick={() => toggleHiddenSidebar()}
                                    className="mt-2"
                                    active={tab === 'transaction'}
                                    icon={AiOutlineTransaction}
                                >
                                    All transaction
                                </Sidebar.Item>
                            </Link>
                        </>
                    </Sidebar.ItemGroup>
                )}
                {/* <Sidebar.ItemGroup>
                    <span className="text-2xl font-semibold pl-2">Setting</span>
                    <>
                        <Link to="/dash-board?tab=account-setting">
                            <Sidebar.Item
                                onClick={() => toggleHiddenSidebar()}
                                className="mt-2"
                                active={tab === 'account-setting'}
                                icon={IoSettings}
                            >
                                Account setting
                            </Sidebar.Item>
                        </Link>
                    </>
                </Sidebar.ItemGroup> */}
            </Sidebar.Items>
        </Sidebar>
    );
}

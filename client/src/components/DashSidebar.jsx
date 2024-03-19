import { Sidebar } from 'flowbite-react';
import { MdLocalOffer } from 'react-icons/md';
import { IoCreateSharp, IoSettings } from 'react-icons/io5';
import { HiDocumentText, HiUser } from 'react-icons/hi';
import { RiAdminFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import checkCreatePermission from '../utils/checkCreatePermission.js';
import { setCurrentUser } from '../redux/user/userSlice.js';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const setCreatePermission = async () => {
            const rs = await checkCreatePermission(currentUser._id);
            if (rs) {
                // Nếu về data thì gọi hàm set lại currentUser trong redux
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

    return (
        <Sidebar aria-label="Sidebar with content separator example" className="w-full md:w-56">
            <Sidebar.Items className="pt-8">
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Profile</span>
                    <Link to="/dash-board?tab=profile">
                        <Sidebar.Item
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
                        <Sidebar.Item className="mt-1" active={tab === 'update-profile'} labelColor="dark" as="div">
                            Update Profile
                        </Sidebar.Item>
                    </Link>
                    {/* {currentUser.isAdmin && (
                        <Sidebar.Collapse icon={RiAdminFill} label="Admin">
                            <Link to="/dash-board?tab=admin-dashboard">
                                <Sidebar.Item
                                    active={tab === 'profile'}
                                    label={currentUser.isAdmin ? 'Admin' : 'User'}
                                    labelColor="dark"
                                    as="div"
                                >
                                    Admin
                                </Sidebar.Item>
                            </Link>
                        </Sidebar.Collapse>
                    )} */}
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Blog</span>
                    {currentUser.isAdmin || currentUser.createPermission ? (
                        <>
                            <Link to="/dash-board?tab=create-blog">
                                <Sidebar.Item className="mt-2" active={tab === 'create-blog'} icon={IoCreateSharp}>
                                    Create blog
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dash-board?tab=all-blog">
                                <Sidebar.Item className="mt-1" active={tab === 'all-blog'} icon={HiDocumentText}>
                                    All blog
                                </Sidebar.Item>
                            </Link>
                        </>
                    ) : (
                        <Link to="/offer">
                            <Sidebar.Item className="mt-2" icon={MdLocalOffer}>
                                Create blog offer
                            </Sidebar.Item>
                        </Link>
                    )}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Setting</span>
                    <>
                        <Link to="/dash-board?tab=account-setting">
                            <Sidebar.Item className="mt-2" active={tab === 'account-setting'} icon={IoSettings}>
                                Account Setting
                            </Sidebar.Item>
                        </Link>
                    </>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

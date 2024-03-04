import { Sidebar } from 'flowbite-react';
import { FcStatistics } from 'react-icons/fc';
import { IoCreateSharp, IoSettings } from 'react-icons/io5';
import { HiDocumentText, HiUser } from 'react-icons/hi';
import { RiAdminFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    return (
        <Sidebar aria-label="Sidebar with content separator example" className="w-full md:w-56">
            <Sidebar.Items className="pt-10">
                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Dashboard</span>
                    <Sidebar.Collapse icon={HiUser} label="Profile">
                        <Link to="/dash-board?tab=profile">
                            <Sidebar.Item
                                active={tab === 'profile'}
                                label={currentUser.isAdmin ? 'Admin' : 'User'}
                                labelColor="dark"
                                as="div"
                            >
                                Profile
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dash-board?tab=update-profile">
                            <Sidebar.Item className="mt-1" active={tab === 'update-profile'} labelColor="dark" as="div">
                                Update Profile
                            </Sidebar.Item>
                        </Link>
                    </Sidebar.Collapse>
                    {currentUser.isAdmin && (
                        <Sidebar.Collapse icon={RiAdminFill} label="Admin">
                            <Link to="/dash-board?tab=admin-dashboard">
                                <Sidebar.Item
                                    active={tab === 'profile'}
                                    label={currentUser.isAdmin ? 'Admin' : 'User'}
                                    labelColor="dark"
                                    as="div"
                                >
                                    Profile
                                </Sidebar.Item>
                            </Link>
                        </Sidebar.Collapse>
                    )}
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                    <span className="text-3xl font-semibold pb-2 pl-2">Blog</span>
                    <>
                        <Link to="/dash-board?tab=create-blog">
                            <Sidebar.Item className="mt-2" active={tab === 'create-blog'} icon={IoCreateSharp}>
                                Create new blog
                            </Sidebar.Item>
                        </Link>
                        <Link to="/dash-board?tab=all-blog">
                            <Sidebar.Item className="mt-1" active={tab === 'all-blog'} icon={HiDocumentText}>
                                All blog
                            </Sidebar.Item>
                        </Link>
                    </>
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

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSideBar from '../components/AdminSideBar';
import NewPackage from '../components/NewPackage';
import BlogManagement from '../components/BlogManagement';
import MainBoardManagement from '../components/MainBoardManagement';
import UserManagement from '../components/UserManagement';
import RevenueManagement from '../components/RevenueManagement';

export default function Admin() {
    const [tab, setTab] = useState('');
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]); // thuc hien code khi co su thay doi ve location

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-56">
                <AdminSideBar />
            </div>
            <div className="min-h-screen container mx-auto">
                {tab === 'main-board' && <MainBoardManagement />}
                {tab === 'revenue' && <RevenueManagement />}
                {tab === 'new-package' && <NewPackage />}
                {tab === 'blog-management' && <BlogManagement />}
                {tab === 'user-management' && <UserManagement />}
            </div>
        </div>
    );
}

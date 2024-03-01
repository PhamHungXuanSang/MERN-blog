import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashProfileUpdate from '../components/DashProfileUpdate';
import DashAccountSetting from '../components/DashAccountSetting';
import DashAdmin from '../components/DashAdmin';
import Editor from './Editor';

export default function Dashboard() {
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
        <div className="flex flex-col md:flex-row min-h-screen container mx-auto">
            <div className="md:w-56">
                <DashSidebar />
            </div>
            {tab === 'admin-dashboard' && <DashAdmin />}
            {tab === 'profile' && <DashProfile />}
            {tab === 'update-profile' && <DashProfileUpdate />}
            {tab === 'create-blog' && <Editor />}
            {tab === 'all-blog' && <DashBlog />}
            {tab === 'account-setting' && <DashAccountSetting />}
        </div>
    );
}

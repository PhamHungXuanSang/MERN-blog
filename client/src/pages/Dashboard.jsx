import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashProfileUpdate from '../components/DashProfileUpdate';
import DashAccountSetting from '../components/DashAccountSetting';
import Editor from './Editor';
import DashAllMyBlog from '../components/DashAllMyBlog';

export default function Dashboard() {
    const [tab, setTab] = useState('');
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-56">
                <DashSidebar />
            </div>
            <div className="min-h-screen container mx-auto">
                {/* {tab === 'admin-dashboard' && <DashAdmin />} */}
                {tab === 'profile' && <DashProfile />}
                {tab === 'update-profile' && <DashProfileUpdate />}
                {tab === 'create-blog' && <Editor />}
                {tab === 'all-blog' && <DashAllMyBlog />}
                {tab === 'account-setting' && <DashAccountSetting />}
            </div>
        </div>
    );
}

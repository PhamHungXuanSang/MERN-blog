import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashProfileUpdate from '../components/DashProfileUpdate';
import Editor from './Editor';
import DashAllMyBlog from '../components/DashAllMyBlog';
import DashRecentlyViewed from '../components/DashRecentlyViewed';
import DashTransaction from '../components/DashTransaction';
import DashUsage from '../components/DashUsage';
import DashSavedBlogs from '../components/DashSavedBlogs';
import DashScheduleBlogs from '../components/DashScheduleBlogs';

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
            <div className="md:w-[16%]">
                <DashSidebar />
            </div>
            <div className="min-h-screen container md:w-[80%] mx-auto">
                {tab === 'profile' && <DashProfile />}
                {tab === 'update-profile' && <DashProfileUpdate />}
                {tab === 'create-blog' && <Editor />}
                {tab === 'schedule-list' && <DashScheduleBlogs />}
                {tab === 'all-blog' && <DashAllMyBlog />}
                {tab === 'recently-viewed' && <DashRecentlyViewed />}
                {tab === 'saved-blogs' && <DashSavedBlogs />}
                {tab === 'usage' && <DashUsage />}
                {tab === 'transaction' && <DashTransaction />}
            </div>
        </div>
    );
}

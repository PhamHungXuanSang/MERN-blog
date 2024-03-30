import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filterPaginationData } from '../common/filterPaginationData';
import { Spinner } from 'flowbite-react';
import NotFound from '../components/NotFound';
import NotificationCard from '../components/NotificationCard';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import LoadMoreDataButton from '../components/LoadMoreDataButton';

export default function Notification() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);
    let filters = ['all', 'system', 'like', 'comment', 'reply', 'rate', 'subscribe new blog'];

    const fetchNotifications = async ({ page, deletedDocCount = 0 }) => {
        try {
            const res = await fetch(`/api/notification/get-notifications/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page, filter, deletedDocCount }),
            });
            const data = await res.json();
            let formatedData = await filterPaginationData({
                state: notifications,
                data: data.notifications,
                page,
                countRoute: `/api/notification/allNotificationCount/${currentUser._id}`,
                dataToSend: { filter },
            });
            setNotifications(formatedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setNotifications(null);
        fetchNotifications({ page: 1 });
    }, [filter]);

    const handleFilter = (e) => {
        let btn = e.target;
        setFilter(btn.innerHTML);
        setNotifications(null);
    };

    return (
        <div className="container mx-auto py-12">
            <h1 className="max-md:hidden">Recent Notification</h1>
            <div className="my-8 flex gap-4">
                {filters.map((filterName, i) => {
                    return (
                        <button
                            key={i}
                            className={
                                'rounded-3xl px-3 py-0.5' +
                                (filter === filterName
                                    ? 'dark:bg-gray-500 dark:text-white bg-gray-400 text-white'
                                    : 'dark:bg-slate-500 dark:text-black bg-gray-200')
                            }
                            onClick={handleFilter}
                        >
                            {filterName}
                        </button>
                    );
                })}
            </div>
            {notifications == null ? (
                <Spinner aria-label="Spinner button example" size="xl" />
            ) : (
                <>
                    {notifications.results.length ? (
                        notifications.results.map((notification, i) => {
                            return (
                                <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                    <NotificationCard
                                        key={i}
                                        data={notification}
                                        index={i}
                                        notificationState={{ notifications, setNotifications }}
                                    />
                                </OneByOneAppearEffect>
                            );
                        })
                    ) : (
                        <NotFound object={'Not found any notification'} />
                    )}
                    <LoadMoreDataButton
                        state={notifications}
                        fetchDataFun={fetchNotifications}
                        additionalParam={{ deletedDocCount: notifications.deletedDocCount }}
                    />
                </>
            )}
        </div>
    );
}

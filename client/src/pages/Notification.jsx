/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Spinner } from 'flowbite-react';
import NotFound from '../components/NotFound';
import NotificationCard from '../components/NotificationCard';
import OneByOneAppearEffect from '../components/OneByOneAppearEffect';
import { IoMdSettings } from 'react-icons/io';
import Switch from '../components/switch';
import { setNotiTypeSetting } from '../redux/notiSetting/notiSettingSlice';

export default function Notification({
    filterStateMapping,
    // setSystemState,
    // setLikeState,
    // setCommentState,
    // setReplyState,
    // setRateState,
    // setSubscriberState,
    // setNewBlogState,
}) {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);
    const [data, setData] = useState([]);
    let filters = ['all', 'system', 'like', 'comment', 'reply', 'rate', 'subscriber', 'new blog'];
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/notification/get-notifications/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filter }),
            });
            const data = await res.json();
            setData(data);
            data.forEach((t) => {
                if (t.type == filter) {
                    return setNotifications(t.notifications);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setNotifications(null);
        fetchNotifications();
    }, [filter]);

    const handleFilter = (e) => {
        let btn = e.target;
        setFilter(btn.innerHTML);
    };

    const handleSettingNoti = (filter) => {
        if (filter != 'new blog') {
            dispatch(setNotiTypeSetting(filter));
            // switch (filter) {
            //     case 'system':
            //         setSystemState((prev) => !prev);
            //         break;
            //     case 'like':
            //         setLikeState((prev) => !prev);
            //         break;
            //     case 'comment':
            //         setCommentState((prev) => !prev);
            //         break;
            //     case 'reply':
            //         setReplyState((prev) => !prev);
            //         break;
            //     case 'rate':
            //         setRateState((prev) => !prev);
            //         break;
            //     case 'subscriber':
            //         setSubscriberState((prev) => !prev);
            //         break;
            // }
        } else {
            dispatch(setNotiTypeSetting('newBlog'));
            // setNewBlogState((prev) => !prev);
        }
    };

    return (
        <div className="container mx-auto py-12">
            <div className="pr-4 md:pr-0 flex items-center justify-between w-full h-fit border-b-2 border-neutral-300">
                <p className="font-bold border-b-2 border-black dark:bg-[#4b5563] bg-[#f3f4f6] text-lg w-fit py-2 px-4 inline-block">
                    Recent Notification
                </p>
                <IoMdSettings
                    size={28}
                    className="cursor-pointer opacity-50 hover:opacity-100 duration-500"
                    onClick={() => setShowModal(true)}
                />
            </div>
            <div className="my-8 flex flex-wrap gap-4">
                {filters.map((filterName, i) => {
                    return (
                        <div key={i} className="relative">
                            <button
                                className={
                                    'capitalize rounded-3xl px-3 py-0.5' +
                                    (filter === filterName
                                        ? 'dark:bg-gray-500 dark:text-white bg-gray-400 text-white'
                                        : 'dark:bg-slate-500 dark:text-black bg-gray-200')
                                }
                                onClick={handleFilter}
                            >
                                {filterName}
                            </button>
                            {data[i]?.unReadCount > 0 ? (
                                <div className="absolute bottom-3 right-[-2px] rounded-full px-1 bg-red-600">
                                    {data[i]?.unReadCount}
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    );
                })}
            </div>
            {notifications == null ? (
                <Spinner aria-label="Spinner button example" size="xl" className="mx-auto block" />
            ) : (
                <>
                    {notifications.length ? (
                        notifications.map((notification, i) => {
                            return (
                                <OneByOneAppearEffect transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                    <NotificationCard
                                        key={i}
                                        data={notification}
                                        index={i}
                                        notificationState={{ notifications, setNotifications }}
                                        unReadCount={data}
                                    />
                                </OneByOneAppearEffect>
                            );
                        })
                    ) : (
                        <NotFound object={'Not found any notification'} />
                    )}
                </>
            )}
            {showModal && (
                <Modal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    popup
                    size="sm"
                >
                    <Modal.Header>Setting popup notifications</Modal.Header>
                    <Modal.Body>
                        {filters != null &&
                            filters.slice(1).map((filter, i) => (
                                <div key={i} className="flex items-center justify-between my-4">
                                    <div className="capitalize">{filter}</div>
                                    <div onClick={() => handleSettingNoti(filter)}>
                                        <Switch boolean={filterStateMapping[filter]} />
                                    </div>
                                </div>
                            ))}
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

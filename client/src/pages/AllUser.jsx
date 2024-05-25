import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import NotFound from '../components/NotFound';
import { Link } from 'react-router-dom';
import { FaFacebookSquare, FaGithubSquare, FaStarHalfAlt, FaTiktok, FaYoutube } from 'react-icons/fa';
import formatDate from '../utils/formatDate';
import BackToTopButton from '../components/BackToTopButton';

export default function AllUser() {
    const [users, setUsers] = useState(null);
    const [showMore, setShowMore] = useState(true);
    const limit = 3;

    const handleGetAllUserProfile = async () => {
        try {
            const res = await fetch('/api/user/get-all-user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit }),
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(data.paginationUsers);
                if (users?.length || 0 + data.paginationUsers.length >= data.allUsers) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetAllUserProfile();
    }, []);

    const handleShowMore = async () => {
        try {
            const startIndex = users.length;
            const res = await fetch('/api/user/get-all-user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startIndex, limit }),
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.paginationUsers]);
                if (users?.length + data.paginationUsers.length >= data.allUsers) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col gap-4 py-8 px-4 md:px-0 container mx-auto">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">All Authors</p>
            </div>
            {users != null ? (
                users.length == 0 ? (
                    <NotFound object={'Not found any users'} />
                ) : (
                    <>
                        {users.map((item, i) => (
                            <div key={i} className="w-full rounded-lg">
                                <div
                                    className={
                                        'flex flex-col md:block group w-full overflow-hidden md:w-[60%] hover:w-full hover:cursor-pointer duration-500 dark:bg-slate-800 bg-slate-100 rounded-lg p-4' +
                                        (i % 2 === 0 ? ' float-right text-right' : ' float-left text-left')
                                    }
                                >
                                    <div
                                        className={
                                            'flex items-start gap-4 xl:gap-8' +
                                            (i % 2 === 0 ? ' float-right flex-row-reverse' : ' float-left')
                                        }
                                    >
                                        <div className="rounded-full max-w-24 max-h-24 border-2 flex justify-center items-center">
                                            <img
                                                alt="Avatar"
                                                src={item.user.userAvatar}
                                                className="max-w-20 max-h-20 rounded-full shadow-2xl"
                                            />
                                        </div>
                                        <div className={'flex flex-col gap-2' + (i % 2 === 0 ? ' items-end' : '')}>
                                            <div className="px-4 dark:bg-slate-600 bg-black w-fit rounded-3xl text-green-400">
                                                {item.user.isAdmin
                                                    ? 'Admin user'
                                                    : item.user.isBlocked
                                                      ? 'Blocked user'
                                                      : 'User'}
                                            </div>
                                            <p className="font-semibold line-clamp-1 break-words">
                                                @{item.user.username}
                                            </p>
                                            <p className="font-semibold line-clamp-1 break-words">{item.user.email}</p>
                                            <Link
                                                to={`/user/${item.user.username}`}
                                                className="hidden group-hover:block text-teal-500"
                                            >
                                                View profile
                                            </Link>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            'hidden group-hover:flex flex-col items-center' +
                                            (i % 2 === 0 ? ' ml-10' : ' mr-10')
                                        }
                                    >
                                        <div className={'text-center'}>
                                            <p className="leading-2 line-clamp-3 break-words">
                                                {item.user.userDesc.length
                                                    ? item.user.userDesc
                                                    : 'No description about this account'}
                                            </p>
                                            <div className="flex flex-wrap gap-8 my-2 items-center justify-center">
                                                {item.user.youtubeLink ? (
                                                    <Link to={item.user.youtubeLink} target="_blank">
                                                        <FaYoutube size={28} />
                                                    </Link>
                                                ) : (
                                                    ''
                                                )}
                                                {item.user.facebookLink ? (
                                                    <Link to={item.user.facebookLink} target="_blank">
                                                        <FaFacebookSquare size={28} />
                                                    </Link>
                                                ) : (
                                                    ''
                                                )}
                                                {item.user.tiktokLink ? (
                                                    <Link to={item.user.tiktokLink} target="_blank">
                                                        <FaTiktok size={28} />
                                                    </Link>
                                                ) : (
                                                    ''
                                                )}
                                                {item.user.githubLink ? (
                                                    <Link to={item.user.githubLink} target="_blank">
                                                        <FaGithubSquare size={28} />
                                                    </Link>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <i>Joined on {formatDate(item.user.createdAt)}</i>
                                        </div>

                                        <div
                                            className={
                                                i % 2 === 0
                                                    ? 'flex flex-wrap gap-2 mt-6 justify-start'
                                                    : 'flex flex-wrap gap-2 mt-6 justify-end'
                                            }
                                        >
                                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                                {item.blogs.length} Blogs
                                            </i>
                                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                                {item.totalViews} Views
                                            </i>
                                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                                {item.user.subscribeUsers.length} Subscriber
                                            </i>
                                            <i className="border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                                {item.totalLike} Likes
                                            </i>
                                            {item.allAverageRating ? (
                                                <i className="flex items-center gap-1 border border-gray-500 py-1 px-2 rounded-3xl opacity-70">
                                                    {Number(item.allAverageRating.toFixed(1))}{' '}
                                                    <FaStarHalfAlt fill="yellow" />
                                                </i>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                                Show more
                            </button>
                        )}
                    </>
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="lg" />
            )}
            <BackToTopButton />
        </div>
    );
}

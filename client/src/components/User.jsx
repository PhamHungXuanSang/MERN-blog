/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

export default function User({ user }) {
    let { username, email, userAvatar } = user;

    return (
        <Link
            to={`/user/${username}`}
            className="flex gap-5 items-center justify-start overflow-hidden border-b mb-2 p-2 dark:hover:bg-slate-600 hover:bg-gray-200 rounded"
        >
            <img src={userAvatar} className="w-14 h-14 rounded-full" />
            <div>
                <h1 className="font-medium text-xl line-clamp-2">@{username}</h1>
                <p className="text-gray-500">{email}</p>
            </div>
        </Link>
    );
}

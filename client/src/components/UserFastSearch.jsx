/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

export default function UserFastSearch({ user }) {
    // username, avatar, email, số bài viết
    return (
        <Link to={`user/${user.username}`} className="pt-1">
            <div className="flex gap-4 items-center">
                <img src={user.userAvatar} className="max-w-10 rounded-full object-contain" />
                <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>
        </Link>
    );
}

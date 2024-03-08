import { Link } from 'react-router-dom';
import formatDate from '../utils/formatDate.js';

export default function BlogMini({ content, author, index }) {
    const { title, createdAt, description, tags, liked, thumb, slug } = content;
    const { userAvatar, username } = author;

    return (
        <Link
            to={`/blog/${slug}`}
            className="flex gap-5 items-center border-b mb-2 p-2 dark:hover:bg-slate-600 hover:bg-gray-100 rounded"
        >
            <h1 className="sm:text-3xl font-bold text-gray-300 leading-none">
                {index < 10 ? '0' + (index + 1) : index + 1}
            </h1>
            <div>
                <div className="flex gap-2 items-center mb-2">
                    <img src={userAvatar} alt={'avatar'} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(createdAt)}</p>
                </div>

                <h1 className="text-base font-medium leading-7 line-clamp-2">{title}</h1>
            </div>
        </Link>
    );
}

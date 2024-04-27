/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

export default function BlogMini({ content, author, index }) {
    const { title, slug } = content;
    const { userAvatar, username } = author;

    return (
        <div className="p-4 dark:hover:bg-slate-700 hover:bg-gray-100 border-2 border-teal-500 rounded-3xl">
            <h1 className="text-center sm:text-xl font-bold text-gray-300 leading-none">
                Top {index < 10 ? '0' + (index + 1) : index + 1}
            </h1>
            <Link to={`/blog/${slug}`}>
                <div className="flex gap-2 items-center mb-2">
                    <img src={userAvatar} alt={'avatar'} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{username}</p>
                </div>

                <h1 className="font-medium line-clamp-1 break-words">{title}</h1>
            </Link>
        </div>
    );
}

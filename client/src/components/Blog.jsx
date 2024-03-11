import { SlLike } from 'react-icons/sl';
import { Link } from 'react-router-dom';
import formatDate from '../utils/formatDate.js';

export default function Blog({ content, author }) {
    const { title, createdAt, description, tags, likeCount, thumb, slug } = content;
    const { userAvatar, username } = author;

    return (
        <Link
            to={`/blog/${slug}`}
            className="flex gap-8 items-center border-b-2 my-2 dark:hover:bg-slate-600 hover:bg-gray-100 p-2 rounded"
        >
            <div className="w-full">
                <div className="flex gap-2 items-center mb-2">
                    <img src={userAvatar} alt={'avatar'} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(createdAt)}</p>
                </div>
                <h1 className="text-xl font-semibold line-clamp-2">{title}</h1>
                <i className="my-2 text-md leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-1">
                    {description}
                </i>
                <div className="flex gap-4 mt-2">
                    <span className="px-4 whitespace-nowrap rounded-full capitalize bg-slate-200 dark:bg-slate-500 font-semibold">
                        {tags[0]}
                    </span>
                    <div className="flex items-center gap-2">
                        <SlLike />
                        <span>{likeCount}</span>
                    </div>
                </div>
            </div>
            <div className="h-28 aspect-square">
                <img src={thumb} className="w-full h-full aspect-square object-cover rounded" />
            </div>
        </Link>
    );
}

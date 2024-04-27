/* eslint-disable no-unused-vars */

import { Link } from 'react-router-dom';
import formatDate from '../utils/formatDate';
import { FaStarHalfAlt } from 'react-icons/fa';
//import formattedDate from '../utils/formatDate.js'

/* eslint-disable react/prop-types */
export default function BlogTopRated({ index, content }) {
    const {
        title,
        thumb,
        averageRating,
        slug,
        createdAt,
        authorId: { username, userAvatar },
    } = content;

    return (
        <Link
            to={`/blog/${slug}`}
            className="group overflow-hidden flex gap-2 p-2 rounded-md dark:hover:bg-slate-600 hover:bg-gray-100"
        >
            <p className="text-4xl sm:text-3xl lg:text-5xl font-bold text-gray-700 leading-none group-hover:text-red-500 group-hover:scale-125 duration-300">
                {index < 10 ? '0' + (index + 1) : index}
            </p>

            <div>
                <div className="flex gap-2 items-center break-words">
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(createdAt)}</p>
                </div>

                <h1 className="text-xl font-medium line-clamp-2 break-words">{title}</h1>
                <div className="flex items-center gap-1">
                    Average: {averageRating}
                    <FaStarHalfAlt fill="yellow" />
                </div>
            </div>
        </Link>
    );
}

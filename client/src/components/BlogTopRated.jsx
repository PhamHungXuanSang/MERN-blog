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
            className="group overflow-hidden flex gap-3 p-2 rounded-md dark:hover:bg-slate-800 hover:bg-gray-100"
        >
            <p className="sm:text-3xl lg:text-4xl font-bold text-gray-700 leading-none group-hover:text-red-500 group-hover:scale-125 duration-300">
                {index < 10 ? '0' + (index + 1) : index}
            </p>

            <div>
                <div className="flex gap-2 items-center break-words text-sm">
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(createdAt)}</p>
                </div>

                <h1 className="text-xl my-1 font-medium line-clamp-2 break-words duration-100 group-hover:scale-105 w-fit relative before:content-[''] before:absolute before:top-[6%] before:right-[-1px] before:w-0 before:h-[93%] before:rounded-sm before:bg-gradient-to-r before:from-indigo-500 before:from-10% before:via-sky-500 before:via-30% before:to-emerald-500 before:to-90% before:-z-10 before:transition-[0.5s] group-hover:before:left-[1px] group-hover:before:right-auto group-hover:before:w-full">
                    {title}
                </h1>
                <div className="flex items-center gap-1 text-sm">
                    Average: {averageRating}
                    <FaStarHalfAlt fill="yellow" />
                </div>
            </div>
        </Link>
    );
}

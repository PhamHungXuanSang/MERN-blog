/* eslint-disable react/prop-types */
import { SlLike } from 'react-icons/sl';
import { FaRegComments, FaStarHalfAlt } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';

export default function Blog({ content, author }) {
    const { title, createdAt, description, category, viewed, likeCount, commentCount, averageRating, thumb, slug } =
        content;
    const { userAvatar, username } = author;

    return (
        <Link
            to={`/blog/${slug}`}
            className="group flex gap-1 md:gap-8 justify-between items-center border-b my-2 dark:hover:bg-slate-800 hover:bg-gray-200 py-2 md:px-4 px-1 rounded"
        >
            <div className="max-w-[70%] flex-grow">
                <div className="flex gap-2 items-center mb-3">
                    <img
                        src={userAvatar}
                        alt={'avatar'}
                        className="w-6 h-6 rounded-full duration-300 group-hover:scale-125"
                    />
                    <p className="truncate">@{username}</p>
                    <p className="min-w-fit ml-4 hidden md:inline opacity-50 group-hover:opacity-100">
                        {dateToDateAndTime(createdAt)}
                    </p>
                </div>
                <h1 className="text-xl font-semibold line-clamp-2 break-words duration-100 group-hover:scale-105 w-fit relative before:content-[''] before:absolute before:top-[6%] before:right-[-1px] before:w-0 before:h-[93%] before:rounded-sm before:bg-gradient-to-r before:from-indigo-500 before:from-10% before:via-sky-500 before:via-30% before:to-emerald-500 before:to-90% before:-z-10 before:transition-[0.5s] group-hover:before:left-[1px] group-hover:before:right-auto group-hover:before:w-full before:opacity-60">
                    {title}
                </h1>
                <i className="my-2 text-md leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-1">
                    {description}
                </i>
                <div className="flex flex-wrap md:gap-5 gap-4 mt-4">
                    <span className="px-4 whitespace-nowrap rounded-full capitalize border border-teal-500 font-semibold dark:text-teal-100 text-teal-600">
                        {category}
                    </span>
                    <div className="flex items-center gap-2">
                        <GrView />
                        <span>{viewed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <SlLike fill="red" />
                        <span>{likeCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegComments fill="green" />
                        <span>{commentCount}</span>
                    </div>
                    {averageRating > 0 ? (
                        <div className="flex items-center gap-2">
                            <FaStarHalfAlt fill="yellow" />
                            <span>{averageRating}</span>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className="h-28 aspect-auto">
                <img
                    src={thumb}
                    className="group-hover:scale-110 md:group-hover:scale-110 duration-500 w-full h-full aspect-square object-cover rounded"
                />
            </div>
        </Link>
    );
}

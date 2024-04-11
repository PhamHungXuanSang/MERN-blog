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
            className="flex gap-8 justify-between items-center border-b-2 my-2 dark:hover:bg-slate-600 hover:bg-gray-100 p-2 rounded"
        >
            <div className="max-w-[70%] flex-grow">
                <div className="flex gap-2 items-center mb-2">
                    <img src={userAvatar} alt={'avatar'} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1 break-words">@{username}</p>
                    <p className="min-w-fit ml-4">Published on: {dateToDateAndTime(createdAt)}</p>
                </div>
                <h1 className="text-xl font-semibold line-clamp-2 break-words">{title}</h1>
                <i className="my-2 text-md leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-1">
                    {description}
                </i>
                <div className="flex flex-wrap gap-5 mt-4">
                    <span className="px-4 whitespace-nowrap rounded-full capitalize bg-slate-200 dark:bg-slate-500 font-semibold">
                        {category}
                    </span>
                    <div className="flex items-center gap-2">
                        <GrView />
                        <span>{viewed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <SlLike />
                        <span>{likeCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegComments />
                        <span>{commentCount}</span>
                    </div>
                    {averageRating > 0 ? (
                        <div className="flex items-center gap-2">
                            <FaStarHalfAlt />
                            <span>{averageRating}</span>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className="h-28 aspect-auto">
                <img src={thumb} className="w-full h-full aspect-square object-cover rounded" />
            </div>
        </Link>
    );
}

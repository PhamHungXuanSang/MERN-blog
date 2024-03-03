import { SlLike } from 'react-icons/sl';
import { Link } from 'react-router-dom';

export default function Blog({ content, author }) {
    const { title, createdAt, description, tags, liked, thumb, slug } = content;
    const { userAvatar, username } = author;

    const formatDate = (dateString) => {
        const options = { timeZone: 'Asia/Ho_Chi_Minh' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        const date = new Date(formattedDate);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return `${day} ${months[monthIndex]} ${year}`;
    };

    return (
        <Link
            to={`/blog/${slug}`}
            className="flex gap-8 items-center border-b-2 my-2 dark:hover:bg-slate-600 hover:bg-gray-100 p-4"
        >
            <div className="w-full">
                <div className="flex gap-2 items-center mb-7">
                    <img src={userAvatar} alt={title} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(createdAt)}</p>
                </div>
                <h1 className="blog-title">{title}</h1>
                <p className="my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
                    {description}
                </p>
                <div className="flex gap-4 mt-7">
                    <span className="py-1 px-4 whitespace-nowrap rounded-full capitalize bg-slate-200 dark:bg-slate-500 font-semibold">
                        {tags[0]}
                    </span>
                    <div className="flex items-center gap-2">
                        <SlLike />
                        <span>{liked}</span>
                    </div>
                </div>
            </div>
            <div className="h-28 aspect-square">
                <img src={thumb} className="w-full h-full aspect-square object-cover rounded" />
            </div>
        </Link>
    );
}

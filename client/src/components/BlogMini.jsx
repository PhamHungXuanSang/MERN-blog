import { Link } from 'react-router-dom';

export default function BlogMini({ content, author, index }) {
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
        <Link to={`/blog/${slug}`} className="flex gap-5 mb-8">
            <h1 className="text-4xl sm:text-3xl lg:text-5xl font-bold text-grey leading-none">
                {index < 10 ? '0' + (index + 1) : index + 1}
            </h1>
            <div>
                <div className="flex gap-2 items-center mb-7">
                    <img src={userAvatar} alt={title} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">@{username}</p>
                    <p className="min-w-fit">{formatDate(createdAt)}</p>
                </div>

                <h1 className="text-2xl font-medium leading-7 line-clamp-3 sm:line-clamp-2">{title}</h1>
            </div>
        </Link>
    );
}

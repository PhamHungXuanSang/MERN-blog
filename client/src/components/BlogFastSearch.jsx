/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

export default function BlogFastSearch({ blog }) {
    // Các thông tin cần hiển thị: title, thumb, author, category
    return (
        <Link to={`blog/${blog.slug}`} className="pt-1">
            <div className="flex gap-4 items-center">
                <img src={blog.thumb} className="max-w-16 rounded object-contain aspect-video" />
                <div>
                    <p className="text-sm font-semibold">{blog.title}</p>
                    <p className="text-sm text-gray-500">{blog.category}</p>
                </div>
            </div>
        </Link>
    );
}

import { Link } from 'react-router-dom';

export default function BlogSuggested({ blog }) {
    return (
        <div className="group relative w-full h-[400px] border border-teal-500 hover:border-2 transition-all overflow-hidden rounded-lg sm:w-[430px]">
            <Link to={`/blog/${blog.slug}`}>
                <img
                    src={blog.thumb}
                    alt="thumbnail"
                    className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
                />
            </Link>
            <div className="p-3 flex flex-col gap-2">
                <p className="text-lg font-semibold line-clamp-2">{blog.title}</p>
                <span className="w-fit px-4 whitespace-nowrap rounded-full capitalize bg-slate-200 dark:bg-slate-500 font-semibold">
                    {blog.tags[0]}
                </span>
                <Link
                    to={`/blog/${blog.slug}`}
                    className="z-10 bottom-[-200px] group-hover:bottom-0 absolute left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
                >
                    Read article
                </Link>
            </div>
        </div>
    );
}

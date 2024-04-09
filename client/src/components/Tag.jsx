/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { EditorContext } from '../pages/Editor';

export default function Tag({ tag }) {
    let {
        blog,
        blog: { tags },
        setBlog,
    } = useContext(EditorContext);

    const handleDeleteTag = () => {
        tags = tags.filter((t) => t != tag);
        setBlog({ ...blog, tags });
    };

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 dark:bg-slate-500 bg-gray-200 rounded-full inline-block hover:bg-opacity-50 pr-10">
            {/* <p className="outline-none" contentEditable="true"> */}
            <p className="outline-none">{tag}</p>
            <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2">
                <IoCloseOutline onClick={handleDeleteTag} />
            </button>
        </div>
    );
}

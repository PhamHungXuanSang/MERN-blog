import { Button, Select, Spinner, TextInput, Textarea } from 'flowbite-react';
import { useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { EditorContext } from '../pages/Editor';
import Tag from './Tag';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

export default function PublishForm() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    let {
        blog,
        blog: { title, description, tags, thumb },
        setBlog,
        setEditorState,
    } = useContext(EditorContext);

    const handleClosePreview = () => {
        setEditorState('editor');
    };

    const handleTitleChange = (e) => {
        setBlog({ ...blog, title: e.target.value });
    };

    const handleDescriptionChange = (e) => {
        setBlog({ ...blog, description: e.target.value });
    };

    const handleChooseCate = (e) => {
        setBlog({ ...blog, category: e.target.value });
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    };

    const handleAddTopic = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault();
            if (tags.length < 10) {
                let tag = e.target.value;
                if (tag.length > 0 && !tags.includes(tag)) {
                    setBlog({ ...blog, tags: [...tags, tag] });
                }
            } else {
                toast.error('Add maximum 10 tags');
            }
            e.target.value = '';
        }
    };

    const handlePublishBlog = async () => {
        if (!title.length) {
            return toast.error('Please type your blog title before publishing');
        }

        if (!description.length || description.length > 200) {
            return toast.error('Please type your blog description before publishing');
        }

        if (!tags.length) {
            return toast.error('Please enter at least 1 tag');
        }

        let loadingToast = toast.loading('Publishing ...');
        setLoading(true);

        try {
            const res = await fetch(`/api/blog/create-blog/${currentUser._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blog),
            });
            const rs = await res.json();
            if (res.status === 403) {
                toast.dismiss(loadingToast);
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                toast.dismiss(loadingToast);
                toast.success('Published 👍');
                setTimeout(() => {
                    navigate(`/blog/${rs.slug}`);
                }, 500);
            } else if (rs.success === false) {
                toast.dismiss(loadingToast);
                setLoading(false);
                return toast.error(rs.message);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            setLoading(false);
            return toast.error(error.message);
        }
    };

    return (
        <>
            <section className="w-fit md:w-[900px] mx-auto min-h-screen grid items-center lg:grid-cols-2">
                <Toaster />
                <div className="max-w-[450px] block mx-auto mb-4">
                    <p className="lg:text-5xl font-semibold py-2 px-4">Preview</p>
                    <div className="w-full aspect-auto rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={thumb} className="aspect-auto object-cover" />
                    </div>
                    <h1 className="text-3xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
                    <p className="line-clamp-2 text-xl leading-7 mt-4">{description}</p>
                </div>
                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="my-2">Blog Title</p>
                    <TextInput
                        onChange={handleTitleChange}
                        type="text"
                        placeholder="Blog Title"
                        defaultValue={title}
                        className="w-[100%] rounded-md px-3 py-1 bg-grey border border-grey focus:bg-transparent"
                    />

                    <p className="mb-2 mt-6">Description about your blog</p>
                    <Textarea
                        onChange={handleDescriptionChange}
                        onKeyDown={handleTitleKeyDown}
                        maxLength={200}
                        type="text"
                        placeholder="Description"
                        defaultValue={description}
                        className="h-16 resize-none leading-7 w-[100%] rounded-md p-4 bg-grey border border-grey focus:bg-transparent"
                    />

                    <p className="mb-2 mt-6">Choose your blog category</p>
                    <Select
                        onChange={handleChooseCate}
                        className="h-16 resize-none leading-7 w-[100%] rounded-md px-3 pt-1 bg-grey pl-2 border border-grey focus:bg-transparent"
                    >
                        <option value={'uncategorized'}>Uncategorized</option>
                        <option value={'programing'}>Programing</option>
                        <option value={'travel'}>Travel</option>
                        <option value={'food'}>Food</option>
                        <option value={'technology'}>Technology</option>
                        <option value={'health'}>Health</option>
                        <option value={'sport'}>Sport</option>
                        <option value={'entertainment'}>Entertainment</option>
                    </Select>

                    <i className="block text-gray-500 text-sm text-right">{200 - description.length} characters left</i>
                    <p className="mb-2 mt-6">Topics - Usefull for searching your blog</p>

                    <div className="relative w-[100%] rounded-md p-4 bg-grey border border-grey focus:bg-transparent pl-2 py-2 pb-4">
                        <input
                            onKeyDown={handleAddTopic}
                            type="text"
                            placeholder="Topic"
                            className="sticky w-[100%] rounded-md px-4 dark:bg-[#374151] dark:text-gray-400 border border-grey focus:bg-transparent bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                        />
                        {tags.map((tag, i) => {
                            return <Tag tag={tag} key={i} />;
                        })}
                        <i className="block text-gray-500 text-sm text-right">{10 - tags.length} Tags left</i>
                    </div>
                    <div className="flex gap-4 float-right my-4">
                        <Button disabled={loading} onClick={handlePublishBlog} gradientDuoTone="greenToBlue">
                            {loading ? (
                                <>
                                    <Spinner aria-label="Spinner button example" size="sm" />
                                    <span className="ml-3">Publishing ...</span>
                                </>
                            ) : (
                                'Publish'
                            )}
                        </Button>
                        <Button outline gradientDuoTone="greenToBlue" onClick={handleClosePreview}>
                            Close Preview
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

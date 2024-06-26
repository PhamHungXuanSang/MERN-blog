import { Button, Modal, Select, Spinner, Textarea } from 'flowbite-react';
import { useContext, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { EditorContext } from '../pages/Editor';
import Tag from './Tag';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';

export default function PublishForm() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [allCate, setAllCate] = useState(null);
    const [userDateCreate, setUserDateCreate] = useState(null);
    const [suggestTags, setSuggestTags] = useState(null);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const inputRef = useRef();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [postingTime, setPostingTime] = useState(new Date());

    let {
        blog,
        blog: { title, description, category, tags, thumb },
        setBlog,
        setEditorState,
    } = useContext(EditorContext);

    useEffect(() => {
        const getAllCategory = async () => {
            try {
                const res = await fetch('/api/category/get-all-not-blocked-category', {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setAllCate(data.allCates);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        const fetchUserDateCreate = async () => {
            try {
                const res = await fetch(`/api/transaction/getCreateDate/${currentUser._id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    navigate('/sign-in');
                    return;
                }
                if (res.status === 200) {
                    setUserDateCreate(data.userExpirationDate);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const handleScrollToTop = () => {
            const isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
            const scrollToTop = () => {
                if (isSmoothScrollSupported) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                } else {
                    window.scrollTo(0, 0);
                }
            };
            const timeoutId = setTimeout(scrollToTop, 100);
            return () => {
                clearTimeout(timeoutId);
            };
        };
        getAllCategory();
        fetchUserDateCreate();
        const cleanup = handleScrollToTop();
        return cleanup;
    }, []);

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

    function removeVietnameseAccents(str) {
        const accents = {
            á: 'a',
            à: 'a',
            ả: 'a',
            ã: 'a',
            ạ: 'a',
            ă: 'a',
            ắ: 'a',
            ặ: 'a',
            ằ: 'a',
            ẳ: 'a',
            ẵ: 'a',
            â: 'a',
            ấ: 'a',
            ầ: 'a',
            ẩ: 'a',
            ẫ: 'a',
            ậ: 'a',
            đ: 'd',
            é: 'e',
            è: 'e',
            ẻ: 'e',
            ẽ: 'e',
            ẹ: 'e',
            ê: 'e',
            ế: 'e',
            ề: 'e',
            ể: 'e',
            ễ: 'e',
            ệ: 'e',
            í: 'i',
            ì: 'i',
            ỉ: 'i',
            ĩ: 'i',
            ị: 'i',
            ó: 'o',
            ò: 'o',
            ỏ: 'o',
            õ: 'o',
            ọ: 'o',
            ô: 'o',
            ố: 'o',
            ồ: 'o',
            ổ: 'o',
            ỗ: 'o',
            ộ: 'o',
            ơ: 'o',
            ớ: 'o',
            ờ: 'o',
            ở: 'o',
            ỡ: 'o',
            ợ: 'o',
            ú: 'u',
            ù: 'u',
            ủ: 'u',
            ũ: 'u',
            ụ: 'u',
            ư: 'u',
            ứ: 'u',
            ừ: 'u',
            ử: 'u',
            ữ: 'u',
            ự: 'u',
            ý: 'y',
            ỳ: 'y',
            ỷ: 'y',
            ỹ: 'y',
            ỵ: 'y',
            Á: 'A',
            À: 'A',
            Ả: 'A',
            Ã: 'A',
            Ạ: 'A',
            Ă: 'A',
            Ắ: 'A',
            Ặ: 'A',
            Ằ: 'A',
            Ẳ: 'A',
            Ẵ: 'A',
            Â: 'A',
            Ấ: 'A',
            Ầ: 'A',
            Ẩ: 'A',
            Ẫ: 'A',
            Ậ: 'A',
            Đ: 'D',
            É: 'E',
            È: 'E',
            Ẻ: 'E',
            Ẽ: 'E',
            Ẹ: 'E',
            Ê: 'E',
            Ế: 'E',
            Ề: 'E',
            Ể: 'E',
            Ễ: 'E',
            Ệ: 'E',
            Í: 'I',
            Ì: 'I',
            Ỉ: 'I',
            Ĩ: 'I',
            Ị: 'I',
            Ó: 'O',
            Ò: 'O',
            Ỏ: 'O',
            Õ: 'O',
            Ọ: 'O',
            Ô: 'O',
            Ố: 'O',
            Ồ: 'O',
            Ổ: 'O',
            Ỗ: 'O',
            Ộ: 'O',
            Ơ: 'O',
            Ớ: 'O',
            Ờ: 'O',
            Ở: 'O',
            Ỡ: 'O',
            Ợ: 'O',
            Ú: 'U',
            Ù: 'U',
            Ủ: 'U',
            Ũ: 'U',
            Ụ: 'U',
            Ư: 'U',
            Ứ: 'U',
            Ừ: 'U',
            Ử: 'U',
            Ữ: 'U',
            Ự: 'U',
            Ý: 'Y',
            Ỳ: 'Y',
            Ỷ: 'Y',
            Ỹ: 'Y',
            Ỵ: 'Y',
        };

        return str
            .split('')
            .map((char) => accents[char] || char)
            .join('')
            .toLowerCase();
    }

    let timeoutId;

    const handleSuggestTags = async (e) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const fetchTags = async () => {
            let tag = removeVietnameseAccents(e.target.value.trim());
            if (tag) {
                setLoadingSuggest(true);
                try {
                    const res = await fetch(`/api/search/suggestTags/${tag}`);
                    const data = await res.json();
                    setSuggestTags(data);
                    setLoadingSuggest(false);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        if (e.target.value.trim() != null && e.target.value.trim().length > 0) {
            timeoutId = setTimeout(fetchTags, 1300);
        } else {
            setSuggestTags(null);
            setLoadingSuggest(false);
        }
    };

    const handleChooseTag = (e) => {
        let tag = e.target.value;
        if (tags.length < 10) {
            if (!tags.includes(tag)) {
                setBlog({ ...blog, tags: [...tags, tag] });
            }
        } else {
            return toast.error('Add maximum 10 tags', { duration: 3000 });
        }
        inputRef.current.value = '';
        setSuggestTags(null);
        setLoadingSuggest(false);
    };

    const handleAddTag = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault();
            let tag = e.target.value.trim();
            if (tags.length < 10) {
                if (tag.length > 0 && !/^[ ]+$/.test(tag) && !tags.includes(tag)) {
                    setBlog({ ...blog, tags: [...tags, removeVietnameseAccents(tag)] });
                }
            } else {
                return toast.error('Add maximum 10 tags', { duration: 3000 });
            }
            e.target.value = '';
            setSuggestTags(null);
            setLoadingSuggest(false);
        }
    };

    const handlePublishBlog = async () => {
        if (!title.length) {
            return toast.error('Please type your blog title before publishing', { duration: 4000 });
        }

        if (!description.length || description.length > 200) {
            return toast.error('Please type your blog description before publishing', { duration: 4000 });
        }

        if (!tags.length) {
            return toast.error('Please enter at least 1 tag', { duration: 4000 });
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
                toast.success('Published 👍', { duration: 6000 });
                navigate(`/blog/${rs.slug}`);
            } else if (rs.success === false) {
                toast.dismiss(loadingToast);
                setLoading(false);
                return toast.error(rs.message, { duration: 6000 });
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            setLoading(false);
            return toast.error(error.message, { duration: 6000 });
        }
    };

    const handleChoosePostingTime = (date) => {
        if (userDateCreate) {
            if (new Date(date) > new Date(userDateCreate)) {
                return toast.error(`Your expiry date is: ${dateToDateAndTime(userDateCreate)}`);
            } else if (date >= new Date()) {
                setPostingTime(date);
                let pt = dateToDateAndTime(date);
                return toast.success(`Posting time set to ${pt}`, { duration: 6000 });
            } else {
                return toast.error('Please choose a posting time after the current time', { duration: 6000 });
            }
        } else {
            return toast.error('No expiration date found for this account');
        }
    };

    const handlePushToWaiting = async () => {
        if (postingTime >= new Date()) {
            if (!title.length) {
                return toast.error('Please type your blog title before publishing', { duration: 4000 });
            }

            if (!description.length || description.length > 200) {
                return toast.error('Please type your blog description before publishing', { duration: 4000 });
            }

            if (!tags.length) {
                return toast.error('Please enter at least 1 tag', { duration: 4000 });
            }

            let loadingToast = toast.loading('Publishing ...');
            try {
                const res = await fetch(`/api/scheduleBlog/add-to-schedule/${currentUser._id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ blog, postingTime }),
                });
                const rs = await res.json();
                if (res.status === 403) {
                    toast.dismiss(loadingToast);
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                } else if (res.status === 200) {
                    toast.dismiss(loadingToast);
                    toast.success('Added to schedule 👍', { duration: 6000 });
                    return navigate(`/dash-board?tab=schedule-list`);
                } else if (rs.success === false) {
                    toast.dismiss(loadingToast);
                    setLoading(false);
                    return toast.error(rs.message, { duration: 6000 });
                }
            } catch (error) {
                toast.dismiss(loadingToast);
                return toast.error(error.message, { duration: 6000 });
            }
        } else {
            return toast.error('Please choose a posting time after the current time', { duration: 6000 });
        }
    };

    return (
        <div>
            <div className="w-full container mx-auto min-h-screen grid items-start lg:grid-cols-2 px-2 md:px-0 max-sm:max-w-[96vw]">
                <Toaster />
                <div className="md:max-w-[450px] block mx-auto mb-4">
                    <p className="text-3xl font-semibold py-2 px-4">Preview</p>
                    <div className="w-full aspect-auto rounded-lg overflow-hidden mt-4">
                        <img
                            src={
                                thumb
                                    ? thumb
                                    : 'https://expeditionmeister.com/oc-content/plugins/blog/img/blog/blog-default.png'
                            }
                            className="aspect-auto object-cover max-h-72"
                        />
                    </div>
                    <h1 className="md:text-3xl text-xl font-medium mt-2 leading-tight break-words overflow-hidden">
                        {title}
                    </h1>
                    <i className="line-clamp-2 md:text-xl text-base dark:text-white/70 leading-7 mt-4 break-words">
                        {description}
                    </i>
                </div>
                <div className="border-gray-300 lg:border-1 lg:pl-8">
                    <p className="my-2">Blog Title</p>
                    <Textarea
                        onChange={handleTitleChange}
                        onKeyDown={handleTitleKeyDown}
                        type="text"
                        placeholder="Blog Title"
                        defaultValue={title}
                        className="w-[100%] rounded-md focus:bg-transparent font-medium outline-none resize-none placeholder:opacity-40 mx-auto"
                        rows={1}
                    />

                    <p className="my-2">Description about your blog</p>
                    <Textarea
                        onChange={handleDescriptionChange}
                        onKeyDown={handleTitleKeyDown}
                        maxLength={200}
                        type="text"
                        placeholder="Description"
                        defaultValue={description}
                        className="h-16 resize-none w-[100%] rounded-md border border-gray-300 focus:bg-transparent"
                    />
                    <i className="block text-gray-500 text-sm text-right">{200 - description.length} characters left</i>

                    <p className="my-2">Blog category</p>
                    <Select
                        onChange={handleChooseCate}
                        className="resize-none w-[100%] rounded-md focus:bg-transparent"
                    >
                        <option value={category ? category : 'Uncategorized'}>
                            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Uncategorized'}
                        </option>
                        {allCate?.map((cate, i) => (
                            <option value={cate.categoryName} key={i}>
                                {cate.categoryName.charAt(0).toUpperCase() + cate.categoryName.slice(1)}
                            </option>
                        ))}
                    </Select>
                    <p className="my-2">Tags - Suggest Tags</p>
                    <div className="relative flex md:flex-row-reverse flex-col gap-2 w-[100%] rounded-md p-4 border border-gray-300 focus:bg-transparent pl-2 py-2 pb-4">
                        {loadingSuggest ? (
                            <div className="md:w-32">
                                <Spinner className="block mx-auto mt-4" size="sm" />
                            </div>
                        ) : suggestTags?.length > 0 ? (
                            <Select
                                onChange={handleChooseTag}
                                className="md:w-32"
                                size={suggestTags.length >= 5 ? '5' : '2'}
                            >
                                {suggestTags.map((tag, index) => (
                                    <option key={index} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </Select>
                        ) : (
                            ''
                        )}
                        <div className="flex-1">
                            <input
                                ref={inputRef}
                                onChange={handleSuggestTags}
                                onKeyDown={handleAddTag}
                                type="text"
                                placeholder="Name tag and press Enter"
                                className="sticky w-[100%] rounded-md px-4 dark:bg-[#374151] dark:text-gray-400 border border-gray-300 focus:bg-transparent bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                            />
                            {tags.map((tag, i) => {
                                return <Tag tag={tag} key={i} />;
                            })}
                            <i className="block text-gray-500 text-sm text-right">{10 - tags.length} Tags left</i>
                        </div>
                    </div>
                    <div className="flex gap-4 float-right my-4">
                        <Button outline gradientDuoTone="greenToBlue" onClick={handleClosePreview}>
                            Back
                        </Button>
                        <Button gradientMonochrome="purple" onClick={() => setShowModal(true)}>
                            Schedule Publish
                        </Button>
                        <Button disabled={loading} onClick={handlePublishBlog} gradientDuoTone="greenToBlue">
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-3">Publishing ...</span>
                                </>
                            ) : (
                                'Publish'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            {showModal && (
                <Modal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    popup
                    size="md"
                >
                    <Modal.Body className="text-center">
                        <i className="block pt-6">Choose time to publish your new blog</i>
                        <DatePicker
                            className="rounded-md dark:bg-[#1f2937] my-4"
                            selected={postingTime}
                            onChange={(date) => handleChoosePostingTime(date)}
                            showTimeSelect
                            timeIntervals={5}
                            timeCaption="Hours"
                            dateFormat="dd/MM/yyyy HH:mm"
                            minDate={new Date()}
                            // maxDate={addDays(new Date(), 1)}
                        />
                        <div className="flex justify-center gap-4">
                            <Button gradientMonochrome="purple" onClick={handlePushToWaiting}>
                                Add to waiting list posting
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

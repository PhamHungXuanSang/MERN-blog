/* eslint-disable no-unused-vars */
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Label, Select, Spinner, TextInput, Textarea } from 'flowbite-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { app } from '../firebase';
import toast from 'react-hot-toast';
import { EditorContext } from '../pages/Editor';
import EditorJS from '@editorjs/editorjs';
import { tools } from './Tools';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoSend } from 'react-icons/io5';
import useSpeechToText from '../hooks/useSpeechToText';
import useClipboard from 'react-use-clipboard';
import MessageSkeleton from './MessageSkeleton';

export default function BlogEditor() {
    const [textInput, setTextInput] = useState('');
    const [lang, setLang] = useState('en-US');
    const [error, setError] = useState('');
    const [value, setValue] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechToText({
        continuous: true,
        lang,
    });
    const [isCopied, setCopied] = useClipboard(textInput, {
        successDuration: 1000,
    });

    const btnStartListening = () => {
        startListening();
    };

    const btnStopListening = () => {
        stopVoiceInput();
    };

    const stopVoiceInput = () => {
        setTextInput((prevVal) => prevVal + (transcript.length ? (prevVal.length ? ' ' : '') + transcript : ''));
        stopListening();
    };

    const targetRef = useRef(null);
    const hiddenElementRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();

    let {
        blog,
        blog: { title, content, thumb },
        setBlog,
        setEditorState,
        textEditor, // Cái này là cái promise được sinh ra khi dùng new EditorJS (nếu có nó chứng tỏ đã có viết blog trước đó rồi)
        setTextEditor,
    } = useContext(EditorContext);

    useEffect(() => {
        if (blog.slug || textEditor.isReady) {
            // Nếu người vào trang edit khác so với tác giả thì không cho edit
            if (blog?.authorId != '' && blog?.authorId != currentUser._id) {
                return navigate('/');
            }
            setTextEditor(
                new EditorJS({
                    holder: 'textEditor',
                    data: Array.isArray(content) ? content[0] : content,
                    inlineToolbar: true,
                    tools: tools,
                    placeholder: 'Write your new blog ...',
                }),
            );
        } else {
            setTextEditor(
                new EditorJS({
                    holder: 'textEditor',
                    inlineToolbar: true,
                    tools: tools,
                    placeholder: 'Write your new blog ...',
                }),
            );
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        let loadingToast = null;
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                if (loadingToast == null) {
                    loadingToast = toast.loading('Uploading ...');
                }
            },
            (error) => {
                toast.dismiss(loadingToast);
                setImageFileUploadError('Could not upload image (File must be less than 12MB)');
                setImageFile(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    toast.dismiss(loadingToast);
                    toast.success('Uploaded 👌', { duration: 6000 });
                    setBlog({ ...blog, thumb: downloadURL });
                });
            },
        );
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';

        setBlog({ ...blog, title: input.value });
    };

    const handlePublishEditor = () => {
        if (!title.length) {
            return toast.error('Please type your blog title', { duration: 3000 });
        }
        if (textEditor.isReady) {
            textEditor
                .save()
                .then((data) => {
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data });
                        setEditorState('publish');
                    } else {
                        return toast.error('Write something to publish your new blog', { duration: 3000 });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return toast.error('Do not leave blank spaces at the end of the article', { duration: 3000 });
                });
        }
    };

    const handleShowCreateImage = () => {
        document.getElementById('geminiAI').classList.toggle('hidden');
    };

    const handleShowCreateText = () => {
        document.getElementById('speechToText').classList.toggle('hidden');
    };

    const getGeminiAnswer = async () => {
        setLoading(true);
        if (!value) {
            setError('Error! Please ask a question!');
            setLoading(false);
            return;
        }
        try {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: chatHistory,
                    message: value,
                }),
            };

            const res = await fetch('/api/messages/gemini', options);
            const data = await res.text();
            setChatHistory((prev) => [
                ...prev,
                { role: 'user', parts: [{ text: value }] },
                { role: 'model', parts: [{ text: data }] },
            ]);
            setValue('');
            setLoading(false);
            const scrollElement = document.querySelector('#scrollElement');
            if (data.length > 0) {
                setTimeout(() => {
                    scrollElement.scrollTo({
                        top: scrollElement.scrollHeight,
                        behavior: 'smooth',
                    });
                }, 500);
            }
        } catch (error) {
            console.log(error);
            setError('Something went wrong!');
        }
    };

    const regex = /\\n|\\r\\n|\\n\\r|\\r/g;

    return (
        <div className="flex-1 py-4 px-2 md:px-0">
            <div className="w-full">
                <Textarea
                    defaultValue={title}
                    placeholder="Blog Title"
                    className="text-3xl text-center font-medium h-16 outline-none resize-none placeholder:opacity-40 mx-auto md:w-[60%] w-[90%]"
                    onKeyDown={handleTitleKeyDown}
                    onChange={handleTitleChange}
                ></Textarea>
                <div className="mx-auto mt-4 md:w-[60%] w-[90%]">
                    <Label
                        htmlFor="dropzone-file"
                        className="flex w-full aspect-auto cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        {thumb ? (
                            <img
                                id="blogThumbnail"
                                ref={targetRef}
                                onClick={() => hiddenElementRef.current.click()}
                                src={thumb}
                                alt="Ảnh blog thumbnail"
                                className={`h-full aspect-auto object-cover rounded-[10px] mx-auto max-h-96 border-[lightgray]`}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                <svg
                                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                            </div>
                        )}

                        <FileInput
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={hiddenElementRef}
                            onChange={handleImageChange}
                            id="dropzone-file"
                        />
                    </Label>
                    {imageFileUploadError && (
                        <Alert className="w-full mt-2" color="failure">
                            {imageFileUploadError}
                        </Alert>
                    )}
                </div>
                <hr className="w-full opacity-50 my-5 h-1" />
                <div id="textEditor"></div>

                <div className="flex justify-end gap-4 w-full md:max-w-[650px] mx-auto">
                    <Button outline gradientDuoTone="redToYellow" onClick={handleShowCreateText}>
                        Create text content with speech
                    </Button>
                    <Button outline gradientDuoTone="redToYellow" onClick={handleShowCreateImage}>
                        Create text content with AI
                    </Button>
                    <Button
                        gradientDuoTone="greenToBlue"
                        onClick={handlePublishEditor}
                        className="flex items-center justify-center"
                    >
                        Publish
                    </Button>
                </div>
            </div>

            <div
                className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50 pt-20 text-black hidden"
                id="geminiAI"
            >
                <div
                    className="relative p-5 border w-11/12 max-w-4xl max-h-[80vh] shadow-lg rounded-md bg-white overflow-hidden mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-black">Create content with Gemini AI</h3>
                        <button
                            className="text-gray-700 bg-transparent hover:bg-gray-200 rounded-lg text-lg px-2 py-1 ml-auto inline-flex items-center focus:outline-none"
                            onClick={handleShowCreateImage}
                        >
                            &#x2715;
                        </button>
                    </div>
                    <div
                        className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden"
                        style={{ maxHeight: 'calc(80vh - 40px)' }}
                    >
                        <div className="flex md:gap-4 gap-0 mt-4 w-full">
                            <input
                                type="text"
                                value={value}
                                placeholder="Describe your ideas"
                                disabled={loading}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                onChange={(e) => setValue(e.target.value)}
                            />
                            {!error &&
                                (!loading ? (
                                    <button
                                        className="w-10 h-10 rounded-full flex justify-center items-center bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                                        onClick={() => getGeminiAnswer()}
                                    >
                                        <IoSend />
                                    </button>
                                ) : (
                                    <Spinner className="block mx-auto mt-4" size="sm" />
                                ))}
                            {error && (
                                <button
                                    className="px-3 py-1 rounded-md shadow-sm bg-red-500 text-white hover:bg-red-600 focus:outline-none"
                                    onClick={() => {
                                        setValue('');
                                        setError('');
                                        setChatHistory([]);
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {error && <div className="text-red-500 font-semibold">{error}</div>}
                        <div className="flex-1 overflow-y-auto p-2" id="scrollElement">
                            {chatHistory.map((chat, i) => (
                                <div key={i} className="p-3 border m-1 rounded-md text-black">
                                    <p
                                        className={`font-semibold ${
                                            chat.role === 'user' ? 'text-blue-500' : 'text-red-500'
                                        }`}
                                    >
                                        {chat.role === 'user' ? '@' + currentUser.username + ': ' : 'AI: '}
                                    </p>
                                    <span
                                        className="whitespace-pre-line"
                                        dangerouslySetInnerHTML={{
                                            __html: chat.parts[0].text
                                                .replace(regex, '<br>')
                                                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                                        }}
                                    ></span>
                                </div>
                            ))}
                            {loading && [...Array(1)].map((_, idx) => <MessageSkeleton key={idx} />)}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50 h-full w-full hidden"
                id="speechToText"
            >
                <div
                    className="relative top-20 mx-auto p-5 border w-[98vw] md:w-[60vw] shadow-lg rounded-md bg-white text-black"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Create text with speech</h3>
                        <Select value={lang} onChange={(e) => setLang(e.target.value)} className="w-fit ml-4">
                            <option value={'en-US'}>English</option>
                            <option value={'vi-VN'}>Vietnamese</option>
                        </Select>
                        <button
                            className="text-gray-700 border-none bg-transparent hover:bg-gray-200 rounded-lg text-lg p-2 ml-auto inline-flex items-center"
                            onClick={handleShowCreateText}
                        >
                            &#x2715;
                        </button>
                    </div>
                    {hasRecognitionSupport ? (
                        <>
                            <Textarea
                                disabled={isListening}
                                rows={5}
                                value={
                                    isListening
                                        ? textInput +
                                          (transcript.length ? (textInput.length ? ' ' : '') + transcript : '')
                                        : textInput
                                }
                                onChange={(e) => setTextInput(e.target.value)}
                                className="my-8 w-[98%] md:w-[90%] mx-auto"
                            />
                            <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-0 items-center justify-evenly">
                                <Button onClick={setCopied} gradientDuoTone="cyanToBlue">
                                    {isCopied ? 'Copied 👍' : 'Copy to Clipboard'}
                                </Button>
                                <Button onClick={() => btnStartListening()} outline gradientDuoTone="greenToBlue">
                                    Start Listening
                                </Button>
                                <Button onClick={() => btnStopListening()} outline gradientDuoTone="pinkToOrange">
                                    Stop Listening
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p>Your brower not support listening</p>
                    )}
                </div>
            </div>
        </div>
    );
}

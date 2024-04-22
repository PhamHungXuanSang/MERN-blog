/* eslint-disable no-unused-vars */
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Label, Select, TextInput, Textarea } from 'flowbite-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { app } from '../firebase';
import toast from 'react-hot-toast';
import { EditorContext } from '../pages/Editor';
import EditorJS from '@editorjs/editorjs';
import { tools } from './Tools';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoSend } from 'react-icons/io5';

export default function BlogEditor() {
    const targetRef = useRef(null);
    const hiddenElementRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [inputIdea, setInputIdea] = useState(null);
    const [AIType, SetAIType] = useState('chatGPT');
    const [output, setOutput] = useState('');
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
                    inlineToolbar: ['link', 'marker', 'bold', 'italic'],
                    tools: tools,
                    placeholder: 'Write your new blog ...',
                }),
            );
        } else {
            setTextEditor(
                new EditorJS({
                    holder: 'textEditor',
                    inlineToolbar: ['link', 'marker', 'bold', 'italic'],
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
                    toast.success('Uploaded 👌');
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
            return toast.error('Please type your blog title');
        }
        if (textEditor.isReady) {
            textEditor
                .save()
                .then((data) => {
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data });
                        setEditorState('publish');
                    } else {
                        return toast.error('Write something to publish your new blog');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return toast.error('Do not leave blank spaces at the end of the article');
                });
        }
    };

    const handleChangeImageInput = (e) => {
        setInputIdea(e.target.value);
    };

    const handleShowCreateImage = () => {
        document.getElementById('openAI').classList.toggle('hidden');
    };

    const getImages = async () => {
        try {
            // console.log(inputIdea);
            // console.log(import.meta.env.VITE_REACT_APP_AI_DALL_E_KEY);
            const res = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_AI_DALL_E_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: inputIdea,
                    n: 2,
                    size: '1024x1024',
                }),
            });

            const data = await res.json();
            data?.data.forEach((imageObject) => {
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.style =
                    'width: 46%; border-radius: 15px; overflow: hidden; box-shadow: rgb(38, 57, 77) 0 20px 30px -10px;';
                const imageElement = document.createElement('img');
                imageElement.setAttribute('src', imageObject.url);
                imageElement.style.width = '100%';
                imageContainer.append(imageElement);
                document.getElementById('images-section').append(imageContainer);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getChatGPTAnswer = async () => {
        try {
            let message = [{ role: 'user', content: `${inputIdea}` }];
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_AI_DALL_E_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    message,
                    temperature: 0.9,
                    max_tokens: 150,
                }),
            });

            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex-1 py-4">
            <section className="w-full">
                <Textarea
                    defaultValue={title}
                    placeholder="Blog Title"
                    className="text-3xl text-center font-medium h-16 outline-none resize-none placeholder:opacity-40 mx-auto w-[60%]"
                    onKeyDown={handleTitleKeyDown}
                    onChange={handleTitleChange}
                ></Textarea>
                <div className="mx-auto mt-4 w-[60%]">
                    <Label
                        htmlFor="dropzone-file"
                        className="dark:hover:bg-bray-800 flex w-full aspect-auto cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        {thumb ? (
                            <img
                                id="blogThumbnail"
                                ref={targetRef}
                                onClick={() => hiddenElementRef.current.click()}
                                src={thumb}
                                alt="Ảnh blog thumbnail"
                                className={`w-full h-full object-cover border-[lightgray]`}
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
                    <Button outline gradientDuoTone="redToYellow" onClick={handleShowCreateImage}>
                        Create images with AI
                    </Button>
                    <Button gradientDuoTone="greenToBlue" onClick={handlePublishEditor}>
                        Publish
                    </Button>
                </div>
            </section>

            <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50 h-full w-full hidden" id="openAI">
                <div
                    className="relative top-20 mx-auto p-5 border w-[60vw] shadow-lg rounded-md bg-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-black">Create content using AI</h3>
                        <button
                            className="text-gray-700 border-none bg-transparent hover:bg-gray-200 rounded-lg text-lg p-2 ml-auto inline-flex items-center"
                            onClick={handleShowCreateImage}
                        >
                            &#x2715;
                        </button>
                    </div>
                    <p className="text-sm mt-4">
                        <Select
                            onChange={(e) => {
                                SetAIType(e.target.value);
                            }}
                        >
                            <option value="chatGPT">ChatGPT</option>
                            <option value="dall-e">Dall-E</option>
                        </Select>
                        <div className="flex gap-4 mt-16 w-full">
                            <TextInput
                                type="text"
                                placeholder="Describe your ideas"
                                className="flex-1"
                                onChange={handleChangeImageInput}
                            ></TextInput>
                            <IoSend
                                className="w-10 h-10 cursor-pointer"
                                onClick={() => {
                                    if (AIType == 'chatGPT') {
                                        getChatGPTAnswer();
                                    } else {
                                        getImages();
                                    }
                                }}
                            />
                        </div>
                        <section id="images-section" className="w-full flex flex-wrap justify-between p-2"></section>
                        <Textarea
                            placeholder="AI Output"
                            className="mt-1 block w-full rounded-md border-gray-300 p-4 border shadow-lg"
                        >
                            {output}
                        </Textarea>
                    </p>
                </div>
            </div>
        </div>
    );
}

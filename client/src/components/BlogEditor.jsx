import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Label, Textarea } from 'flowbite-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { app } from '../firebase';
import toast from 'react-hot-toast';
import { EditorContext } from '../pages/Editor';
import EditorJS from '@editorjs/editorjs';
import { tools } from './Tools';

export default function BlogEditor() {
    const targetRef = useRef(null);
    const hiddenElementRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    let {
        blog,
        blog: { authorId, title, description, content, tags, thumb, category, liked, viewed, slug },
        setBlog,
        setEditorState,
        textEditor,
        setTextEditor,
    } = useContext(EditorContext);

    useEffect(() => {
        setTextEditor(
            new EditorJS({
                holder: 'textEditor',
                data: content,
                tools: tools,
                placeholder: 'Write your new blog ...',
            }),
        );
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
                });
        }
    };

    return (
        <div className="flex-1 pt-4">
            <section>
                <Textarea
                    defaultValue={title}
                    placeholder="Blog Title"
                    className="text-3xl text-center font-medium w-full h-16 outline-none resize-none placeholder:opacity-40 mx-auto w-[60%]"
                    onKeyDown={handleTitleKeyDown}
                    onChange={handleTitleChange}
                ></Textarea>
                <div className="mx-auto mt-4 w-[60%]">
                    {/* <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-[lightgray]"> */}
                    {/* <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={hiddenElementRef}
                        onChange={handleImageChange}
                    ></input> */}
                    {/* <div className="relative w-[100%] h-[100%] self-center cursor-pointer shadow-md overflow-hidden">
                            {imageFileUploadProgress && (
                                <CircularProgressbar
                                    value={imageFileUploadProgress || 0}
                                    text={`${imageFileUploadProgress}%`}
                                    strokeWidth={5}
                                    styles={{
                                        root: {
                                            width: '32px',
                                            height: '32px',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        },
                                        path: { stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})` },
                                    }}
                                />
                            )}
                            <img
                                id="blogThumbnail"
                                ref={targetRef}
                                onClick={() => hiddenElementRef.current.click()}
                                src={
                                    imageFileUrl ||
                                    'https://noahlegend.com.vn/wp-content/themes/thrive-theme/architect/editor/css/images/featured_image.png'
                                }
                                alt="Ảnh blog thumbnail"
                                className={`w-full h-full object-cover border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
                            />
                        </div>
                        {imageFileUploadError && (
                            <Alert className="w-full" color="failure">
                                {imageFileUploadError}
                            </Alert>
                        )} */}

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
                    {/* </div> */}
                </div>
                <hr className="w-full opacity-10 my-5" />
                <div id="textEditor" className="w-full"></div>
                <div className="flex gap-4 w-full mx-auto">
                    <Button gradientDuoTone="greenToBlue" onClick={handlePublishEditor}>
                        Publish
                    </Button>
                </div>
            </section>
        </div>
    );
}

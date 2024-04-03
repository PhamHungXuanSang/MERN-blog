/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Alert, Button, Label, Spinner, TextInput, Textarea } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { app } from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {
    updateUserProfileFailure,
    updateUserProfileSuccess,
    updateUserProfileStart,
    signOutSuccess,
} from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiInformationCircle } from 'react-icons/hi';

export default function DashProfileUpdate() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const { loading, error } = useSelector((state) => state.user);
    const [characters, setCharacters] = useState((200 - currentUser.userDesc.length || 0).toString());
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const targetRef = useRef(null);
    const hiddenElementRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        dispatch(updateUserProfileFailure(''));
    }, []);

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
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploading(true);
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploading(false);
                setImageFileUploadError('Could not upload image (File must be less than 12MB)');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUploading(false);
                    setImageFileUrl(downloadURL);
                    setImageFileUploadProgress(null);
                    setFormData({ ...formData, userAvatar: downloadURL });
                });
            },
        );
    };

    const handleUpdateUserProfile = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    function hasFourDigitsAtEnd(input) {
        return /\d{4}$/.test(input);
    }

    const handleSubmitUpdateUserProfile = async (e) => {
        dispatch(updateUserProfileStart());
        if (e) {
            e.preventDefault();
        }
        if (Object.keys(formData).length === 0) {
            dispatch(updateUserProfileFailure(null));
            return;
        }

        if (formData.username) {
            if (!hasFourDigitsAtEnd(formData.username)) {
                dispatch(updateUserProfileFailure('Please enter 4 digit at the end of username'));
                return;
            }
        }

        try {
            const res = await fetch(`/api/user/update-profile/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const dataUpdated = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                dispatch(updateUserProfileSuccess(dataUpdated));
            }
            else if (dataUpdated.success === false) {
                dispatch(updateUserProfileFailure(dataUpdated.message));
                return;
            }
        } catch (error) {
            dispatch(updateUserProfileFailure(error.message));
            return;
        }
    };

    const handleCharactersLeft = (e) => {
        setCharacters((200 - e.target.value.length).toString());
    };

    return (
        <div className="flex-1 mx-auto py-12 px-4">
            <div className="h-full">
                <div className="w-full h-fit border-b-2 border-neutral-300">
                    <p className="border-b-2 text-lg w-fit py-2 px-4">Update Profile</p>
                </div>

                <form className="mt-4">
                    <div className="flex p-2">
                        <div className="w-[11%] mr-8 flex flex-col justify-start items-center">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={hiddenElementRef}
                                onChange={handleImageChange}
                            ></input>
                            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mb-4">
                                {imageFileUploadProgress && (
                                    <CircularProgressbar
                                        value={imageFileUploadProgress || 0}
                                        text={`${imageFileUploadProgress}%`}
                                        strokeWidth={5}
                                        styles={{
                                            root: {
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                            },
                                            path: { stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})` },
                                        }}
                                    />
                                )}
                                <img
                                    id="userAvatar"
                                    ref={targetRef}
                                    onClick={() => hiddenElementRef.current.click()}
                                    src={imageFileUrl || currentUser.userAvatar}
                                    alt="Ảnh profile"
                                    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
                                />
                            </div>
                            {imageFileUploadError && (
                                <Alert className="w-full" color="failure">
                                    {imageFileUploadError}
                                </Alert>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex mb-4">
                                <div className="mr-4 flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="username" value="User name" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        id="username"
                                        placeholder="username"
                                        defaultValue={currentUser.username}
                                        onChange={handleUpdateUserProfile}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="email" value="Email" />
                                    </div>
                                    <TextInput
                                        disabled
                                        type="email"
                                        id="email"
                                        placeholder="email"
                                        defaultValue={currentUser.email}
                                    />
                                </div>
                            </div>
                            <div className="mb-2 block">
                                <Label htmlFor="userDesc" value="Description" />
                            </div>
                            <Textarea
                                id="userDesc"
                                placeholder="Leave a description about your sefl ..."
                                defaultValue={currentUser.userDesc}
                                onInput={handleCharactersLeft}
                                maxLength={200}
                                rows={4}
                                onChange={handleUpdateUserProfile}
                            />
                            <i className="block mb-16 text-gray-500 text-sm">{characters} characters left</i>

                            <span>Add Your Social Handles below</span>
                            <div className="flex my-4">
                                <div className="mr-4 flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="youtube" value="Youtube" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        id="youtube"
                                        placeholder="https://"
                                        defaultValue={currentUser.youtubeLink}
                                        onChange={handleUpdateUserProfile}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="facebook" value="Facebook" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        id="facebook"
                                        placeholder="https://"
                                        defaultValue={currentUser.facebookLink}
                                        onChange={handleUpdateUserProfile}
                                    />
                                </div>
                            </div>
                            <div className="flex mb-8">
                                <div className="mr-4 flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="tiktok" value="Tiktok" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        id="tiktok"
                                        placeholder="https://"
                                        defaultValue={currentUser.tiktokLink}
                                        onChange={handleUpdateUserProfile}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2 block">
                                        <Label htmlFor="github" value="Github" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        id="github"
                                        placeholder="https://"
                                        defaultValue={currentUser.githubLink}
                                        onChange={handleUpdateUserProfile}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                onClick={handleSubmitUpdateUserProfile}
                                gradientDuoTone="greenToBlue"
                                outline
                                disabled={loading || imageFileUploading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner aria-label="Spinner button example" size="sm" />
                                        <span className="ml-3">Updating Profile ...</span>
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </Button>
                            {error && (
                                <Alert className="mt-1" color="failure" icon={HiInformationCircle}>
                                    {error}
                                </Alert>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

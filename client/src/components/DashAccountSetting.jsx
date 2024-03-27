import { Alert, Button, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/user/userSlice.js';
import { useNavigate, Link } from 'react-router-dom';

export default function DashAccountSetting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);
    const error = useSelector((state) => state.user.error);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(oldPassword, newPassword, confirmNewPassword);
        setShowModal(true);
    };

    const handleChangePassword = async () => {
        setShowModal(false);
    };

    // const handleDeleteAccount = async () => {
    //     dispatch(deleteUserStart());
    //     setShowModal(false);
    //     try {
    //         ////////////////////////////////////// Coi laji chuaw delete dduwocj
    //         const res = await fetch(`/api/user/delete-account/${currentUser._id}`, {
    //             method: 'DELETE',
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         const data = await res.json();
    //         if (res.status === 403) {
    //             dispatch(signOutSuccess());
    //             return navigate('/sign-in');
    //         } else if (res.status === 200) {
    //             dispatch(deleteUserSuccess());
    //             return navigate('/sign-in');
    //         } else if (data.success === false) {
    //             dispatch(deleteUserFailure(data.message));
    //             return;
    //         }
    //     } catch (error) {
    //         dispatch(deleteUserFailure(error.message));
    //         return;
    //     }
    // };

    if (currentUser.emailVerified.method === 'password') {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="h-full px-4">
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p className="border-b-2 text-lg w-fit py-2 px-4">Account Setting</p>
                    </div>

                    {/* <Button outline gradientDuoTone="greenToBlue" onClick={() => setShowModal(true)}>
                    Delete Account
                </Button> */}
                    <div className="flex flex-col items-center justify-center">
                        <i className="text-xl font-bold my-4">Change Password</i>
                        <form onSubmit={handleSubmit} className="w-full max-w-xs">
                            <div className="mb-4">
                                <Label value="Password confirm" />
                                <TextInput
                                    className="mt-2"
                                    type="password"
                                    placeholder="Enter old password"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <Label value="New Password" />
                                <TextInput
                                    className="mt-2"
                                    type="password"
                                    placeholder="Enter new password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <Label value="Confirm New Password" />
                                <TextInput
                                    className="mt-2"
                                    type="password"
                                    placeholder="Confirm new password"
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-center">
                                <Button type="submit" gradientDuoTone="greenToBlue">
                                    Change Password
                                </Button>
                            </div>

                            <div className="mt-4 text-center">
                                <Link
                                    to="/forgot-password"
                                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </form>
                    </div>

                    {error && (
                        <Alert color="failure" className="mt-5">
                            {error}
                        </Alert>
                    )}

                    <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                    Are you sure you want to change password?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button color="failure" onClick={handleChangePassword}>
                                        Yes, I am sure
                                    </Button>
                                    <Button color="gray" onClick={() => setShowModal(false)}>
                                        No, I am not
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="h-full px-4">
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p className="border-b-2 text-lg w-fit py-2 px-4">Account Setting</p>
                    </div>
                    <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                        <p className="font-bold">Reset Password Not Required</p>
                        <p>
                            You are registered with Google Authentication. There is no need to reset a password. Please
                            use Google to sign in directly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

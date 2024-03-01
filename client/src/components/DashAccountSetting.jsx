import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

export default function DashAccountSetting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);
    const error = useSelector((state) => state.user.error);
    const handleDeleteAccount = async () => {
        dispatch(deleteUserStart());
        setShowModal(false);
        try {
            ////////////////////////////////////// Coi laji chuaw delete dduwocj
            const res = await fetch(`/api/user/delete-account/${currentUser._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                navigate('/sign-in');
            } else if (res.status === 200) {
                dispatch(deleteUserSuccess());
                navigate('/sign-in');
            } else if (res.status === 201) {
                const returnToken = data;
                document.cookie = `access_token=${returnToken.newToken}`;
                document.cookie = `refresh_token=${returnToken.refToken}`;
                handleDeleteAccount();
            } else if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
            return;
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="h-full px-4">
                <div className="w-full h-fit border-b-2 border-neutral-300">
                    <p className="border-b-2 text-lg w-fit py-2 px-4">Account Setting</p>
                </div>

                <Button outline gradientDuoTone="greenToBlue" onClick={() => setShowModal(true)}>
                    Delete Account
                </Button>
                {error && (
                    <Alert color="failure" className="mt-5">
                        {error}
                    </Alert>
                )}
                <TextInput placeholder="Your password" />
                <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete your account?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={handleDeleteAccount}>
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
}

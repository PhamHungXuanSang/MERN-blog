import { Alert, Button, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ChangePassword() {
    const [showModal, setShowModal] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);
    const error = useSelector((state) => state.user.error);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [arrValid, setArrValid] = useState([false, false, false, false, false]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (oldPassword.length <= 0 || newPassword.length <= 0 || confirmNewPassword.length <= 0) {
            return toast.error('Plese enter all field', { duration: 3000 });
        }
        if (arrValid.some((item) => item == false)) {
            return toast.error('Please enter a password that meets the requirements', { duration: 4000 });
        }
        if (newPassword != confirmNewPassword) {
            return toast.error('Password confirm not match', { duration: 3000 });
        }
        setShowModal(true);
    };

    const handleChangePassword = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/changePassword/${currentUser.email}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                return toast.success(data.message, { duration: 6000 });
            } else {
                return toast.error(data.message, { duration: 6000 });
            }
        } catch (error) {
            console.log(error);
        }
    };

    let validationRegex = [
        { regex: /.{6,}/ },
        { regex: /[0-9]/ },
        { regex: /[a-z]/ },
        { regex: /[A-Z]/ },
        { regex: /[^A-Za-z0-9]/ },
    ];

    if (currentUser.emailVerified.method === 'password') {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="h-full min-h-screen">
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

                            <div className="mb-4 relative">
                                <Label value="New Password" />
                                <TextInput
                                    className="mt-2"
                                    type="password"
                                    placeholder="Enter new password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onFocus={() => setShowPasswordValidation(true)}
                                    onBlur={() => setShowPasswordValidation(false)}
                                    onKeyUp={(e) => {
                                        const newValidityArray = validationRegex.map((item) =>
                                            item.regex.test(e.target.value),
                                        );
                                        setArrValid(newValidityArray);
                                    }}
                                    required
                                />
                                <div
                                    className={`transition-opacity duration-300 transform ${
                                        showPasswordValidation
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-96'
                                    } password-checklist absolute top-20 w-full z-10 py-2 px-4 dark:bg-slate-500 bg-slate-100 rounded-3xl`}
                                >
                                    <i className="checklist-title text-lg">Password should be</i>
                                    <ul className="checklist list-none ml-2">
                                        <li
                                            className={`flex items-center gap-2${arrValid[0] ? ' opacity-100' : ' opacity-50'}`}
                                        >
                                            {arrValid[0] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                            <p>At least 6 characters long</p>
                                        </li>
                                        <li
                                            className={`flex items-center gap-2${arrValid[1] ? ' opacity-100' : ' opacity-50'}`}
                                        >
                                            {arrValid[1] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                            <p>At least 1 number</p>
                                        </li>
                                        <li
                                            className={`flex items-center gap-2${arrValid[2] ? ' opacity-100' : ' opacity-50'}`}
                                        >
                                            {arrValid[2] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                            <p>At least 1 lowercase letter</p>
                                        </li>
                                        <li
                                            className={`flex items-center gap-2${arrValid[3] ? ' opacity-100' : ' opacity-50'}`}
                                        >
                                            {arrValid[3] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                            <p>At least 1 uppercase letter</p>
                                        </li>
                                        <li
                                            className={`flex items-center gap-2${arrValid[4] ? ' opacity-100' : ' opacity-50'}`}
                                        >
                                            {arrValid[4] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                            <p>At least 1 special characters</p>
                                        </li>
                                    </ul>
                                </div>
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
            <div className="container mx-auto py-8 px-4">
                <div className="h-full">
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

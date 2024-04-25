import { Button, Label, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import toast from 'react-hot-toast';
import { FaTimes, FaCheck } from 'react-icons/fa';

let currentOTPIndex = 0;
export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [OTP, setOTP] = useState(new Array(4).fill(''));
    const inputRef = useRef(null);
    const [activeOTPIndex, setActiveOTPIndex] = useState(0);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);

    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [arrValid, setArrValid] = useState([false, false, false, false, false]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (currentUser && currentUser.emailVerified.method !== 'password') {
            return navigate('/');
        }
    }, []);

    const handleSendCode = async () => {
        if (currentUser && email != currentUser.email) {
            return toast.error('Please enter the email you registered with');
        }
        try {
            const res = await fetch(`/api/email/sendEmailOTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status === 200) {
                toast.success('OTP code has been send to your email');
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyDown = (e, index) => {
        currentOTPIndex = index;
        if (e.key === 'Backspace') {
            setActiveOTPIndex(currentOTPIndex - 1);
        }
    };

    const handleInputCode = (e) => {
        const newOTP = [...OTP];
        newOTP[currentOTPIndex] = e.target.value.substring(e.target.value.length - 1);
        if (!e.target.value) {
            setActiveOTPIndex(currentOTPIndex - 1);
        } else {
            setActiveOTPIndex(currentOTPIndex + 1);
        }
        setOTP(newOTP);
    };

    useEffect(() => {
        if (OTP.every((item) => item !== '')) {
            setCode(OTP.join(''));
        }
    }, [OTP]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOTPIndex]);

    const handleVerifyCode = async () => {
        if (code.length === 4) {
            try {
                const res = await fetch(`/api/email/verifyEmailOTP`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, OTP: code }),
                });
                const data = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                }
                if (res.status === 200) {
                    toast.success('OTP authentication successful 👍');
                    setStep(3);
                } else {
                    return toast.error(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            return toast.error('Please enter all OTP characters');
        }
    };

    const handleResetPassword = async () => {
        if (newPassword == '' || confirmNewPassword == '') {
            return toast.error('Please enter password and password confirm');
        }
        if (arrValid.some((item) => item == false)) {
            return toast.error('Please enter a password that meets the requirements');
        }
        if (newPassword !== confirmNewPassword) {
            return toast.error('Password confirm not match');
        }
        try {
            const res = await fetch(`/api/user/resetPassword/${email}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword, confirmNewPassword }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status === 200) {
                return toast.success('Password has been reset');
            } else {
                return toast.error(data.message);
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

    return (
        <div className="flex flex-col items-center gap-6 py-12 min-h-screen">
            <i className="text-xl font-bold my-4">Forgot Password</i>
            {step === 1 && (
                <div className="shadow-md rounded mb-4 flex flex-col w-[70%] md:w-[30%]">
                    <div className="mb-4">
                        <Label value="Email address" />
                        <TextInput
                            className="mt-2"
                            type="email"
                            placeholder="Enter your registered email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button gradientDuoTone="greenToBlue" type="button" onClick={handleSendCode}>
                        Receive Code
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="shadow-md rounded mb-4 flex flex-col w-[70%] md:w-[30%]">
                    <div className="mb-4 flex">
                        {OTP.map((otp, index) => {
                            return (
                                <div key={index} className="mx-auto">
                                    <input
                                        ref={index === activeOTPIndex ? inputRef : null}
                                        type="number"
                                        className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition spin-button-none"
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onChange={handleInputCode}
                                        value={OTP[index]}
                                    ></input>
                                </div>
                            );
                        })}
                    </div>
                    <Button gradientDuoTone="greenToBlue" type="button" onClick={handleVerifyCode}>
                        Verify Code
                    </Button>
                </div>
            )}

            {step === 3 && (
                <div className="shadow-md rounded mb-4 flex flex-col w-[70%] md:w-[30%]">
                    <div className="mb-4 relative">
                        <Label value="New Password" />
                        <TextInput
                            className="mt-2"
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => setShowPasswordValidation(true)}
                            onBlur={() => setShowPasswordValidation(false)}
                            onKeyUp={(e) => {
                                const newValidityArray = validationRegex.map((item) => item.regex.test(e.target.value));
                                setArrValid(newValidityArray);
                            }}
                        />
                        <div
                            className={`transition-opacity duration-300 transform ${
                                showPasswordValidation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-96'
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
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    <Button gradientDuoTone="greenToBlue" type="button" onClick={handleResetPassword}>
                        Reset Password
                    </Button>
                </div>
            )}
        </div>
    );
}

import { Button, Label, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import toast from 'react-hot-toast';

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

    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (currentUser.emailVerified.method !== 'password') {
            return navigate('/');
        }
    }, []);

    const handleSendCode = async () => {
        if (email != currentUser.email) {
            return toast.error('Please enter the email you registered with');
        }
        try {
            const res = await fetch(`/api/email/sendEmailOTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id, email }),
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
                    body: JSON.stringify({ userId: currentUser._id, OTP: code }),
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
        if (newPassword !== confirmNewPassword) {
            return toast.error('Password confirm not match');
        }
        try {
            const res = await fetch(`/api/user/resetPassword/${currentUser._id}`, {
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

    return (
        <div className="flex flex-col items-center justify-center">
            <i className="text-xl font-bold my-4">Forgot Password</i>
            {step === 1 && (
                <div className="shadow-md rounded mb-4 flex flex-col md:w-[30%]">
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
                <div className="shadow-md rounded mb-4 flex flex-col md:w-[30%]">
                    <div className="mb-4 flex">
                        {/* <Label value="Verification Code" />
                        <TextInput
                            className="mt-2"
                            type="text"
                            placeholder="Enter the code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        /> */}
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
                <div className="shadow-md rounded mb-4 flex flex-col md:w-[30%]">
                    <div className="mb-4">
                        <Label value="New Password" />
                        <TextInput
                            className="mt-2"
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
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

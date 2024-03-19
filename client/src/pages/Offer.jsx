import { Button, Card } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess, successfullyPurchase } from '../redux/user/userSlice.js';
import toast from 'react-hot-toast';

export default function Offer() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [showTrial, setShowTrial] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCheckFreeTrial = async () => {
        try {
            const res = await fetch(`/api/transaction/checkFreeTrial/${currentUser._id}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                if (data.isTrialed == false) {
                    setShowTrial(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Lấy về thông tin về transaction của người dùng
    useEffect(() => {
        handleCheckFreeTrial();
    }, []);

    const handleGetFreeTrial = async () => {
        // call api đổi isTrialed = true và expTime bằng +7 ngày và gán lại redux currentUser createPermission thành true
        try {
            const res = await fetch(`/api/transaction/getFreeTrial/${currentUser._id}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                // Gửi thông báo bằng toast và gửi email bằng node mailer đến người dùng
                dispatch(successfullyPurchase(data));
                toast.success('You have successfully purchased the package');
                return navigate('/dash-board?tab=create-blog');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="container mx-auto min-h-screen h-fit py-12">
            <div className="flex flex-col sm:flex-row flex-wrap gap-10 mx-auto">
                <div className="w-full sm:w-[30%] flex flex-col gap-16">
                    <i className="text-2xl font-semibold block">
                        Unlock Your Creative Potential with Our Blogging Platform! ✍️
                    </i>
                    <p>
                        Ever dreamt of sharing your thoughts with the world or becoming a recognized blogger? Your
                        journey begins here! With our intuitive and user-friendly blogging platform, crafting and
                        showcasing your ideas has never been easier.
                    </p>
                    {showTrial && (
                        <Button outline gradientDuoTone="pinkToOrange" className="mx-auto" onClick={handleGetFreeTrial}>
                            Get free trial in 7 days
                        </Button>
                    )}
                </div>
                <div className="w-full sm:w-[30%]">
                    <Card className="max-w-sm mx-auto">
                        <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                            Use within 1 month
                        </h5>
                        <div className="flex items-baseline text-gray-900 dark:text-white">
                            <span className="text-3xl font-semibold">$</span>
                            <span className="text-5xl font-extrabold tracking-tight">10</span>
                            <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/1month</span>
                        </div>
                        <ul className="my-7 space-y-5">
                            <li className="flex space-x-3">
                                <svg
                                    className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                    Freely create and post your favorite blogs
                                </span>
                            </li>
                            <li className="flex space-x-3">
                                <svg
                                    className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                    View statistical information of personal blogs
                                </span>
                            </li>
                        </ul>
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                        >
                            Choose plan
                        </button>
                    </Card>
                </div>
                {/* Sau này dùng map qua các package return OfferCard có hiệu ứng trượt từ trên xuống */}
                <div className="w-full sm:w-[30%]">
                    <Card className="max-w-sm mx-auto">
                        <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                            Use within 1 month
                        </h5>
                        <div className="flex items-baseline text-gray-900 dark:text-white">
                            <span className="text-3xl font-semibold">$</span>
                            <span className="text-5xl font-extrabold tracking-tight">10</span>
                            <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/1month</span>
                        </div>
                        <ul className="my-7 space-y-5">
                            <li className="flex space-x-3">
                                <svg
                                    className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                    Freely create and post your favorite blogs
                                </span>
                            </li>
                            <li className="flex space-x-3">
                                <svg
                                    className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                    View statistical information of personal blogs
                                </span>
                            </li>
                        </ul>
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                        >
                            Choose plan
                        </button>
                    </Card>
                </div>
            </div>
        </section>
    );
}

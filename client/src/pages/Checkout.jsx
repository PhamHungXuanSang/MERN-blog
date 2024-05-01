import { useDispatch, useSelector } from 'react-redux';
import PaypalCheckoutButton from '../components/PaypalCheckoutButton.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { signOutSuccess } from '../redux/user/userSlice.js';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';
import { Spinner } from 'flowbite-react';
import formatDate from '../utils/formatDate.js';
import { IoIosArrowBack } from 'react-icons/io';
import { setSelectedPackage } from '../redux/selectedPackage/selectedPackageSlice.js';

export default function Checkout() {
    const [userTransactionInfo, setUserTransactionInfo] = useState(null);
    const selectedPackage = useSelector((state) => state.selectedPackage.selectedPackage);
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedPackage == null || !currentUser) {
            return navigate('*');
        }
        const fetchUsage = async () => {
            try {
                const res = await fetch(`/api/transaction/get-transaction-history/${currentUser._id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                }
                if (res.ok) {
                    setUserTransactionInfo(data.userTransactionInfo);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsage();
    }, []);

    return (
        <div className="py-8 px-4">
            <div className="paypal rounded-lg border border-teal-500 md:max-w-[50%] mx-auto p-4">
                <div
                    className="flex items-center gap-1 cursor-pointer w-fit opacity-50 hover:opacity-100 mb-2"
                    onClick={() => {
                        dispatch(setSelectedPackage(null));
                        return navigate('/offer');
                    }}
                >
                    <IoIosArrowBack />
                    <p>Back</p>
                </div>
                {userTransactionInfo != null ? (
                    new Date(userTransactionInfo.expirationDate).getFullYear() < 2100 ? (
                        <>
                            <div className="border border-gray-500 rounded-lg p-4">
                                <div className="bg-slate-300 p-2 rounded-lg text-black flex flex-col gap-1">
                                    <p>
                                        <img
                                            src={currentUser.userAvatar}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full inline-block"
                                        ></img>{' '}
                                        {currentUser.username}
                                    </p>
                                    <p className="line-clamp-3 break-words">Email: {currentUser.email}</p>
                                    <p>
                                        Package expiration date: {dateToDateAndTime(userTransactionInfo.expirationDate)}
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <span className="font-semibold text-xl">Billing Information</span>
                                    <div className="flex flex-col md:flex-row justify-between border p-2 mt-2 rounded-lg">
                                        <div>
                                            <p>
                                                <i>Package name: </i>
                                                {selectedPackage.packageName}
                                            </p>
                                            <p>
                                                <i>Package duration:</i>{' '}
                                                {selectedPackage.packageExpiry <= 365
                                                    ? selectedPackage.packageExpiry + ' days'
                                                    : 'Forever'}
                                            </p>
                                            <p>
                                                <i>Transaction type:</i>{' '}
                                                {userTransactionInfo.expirationDate > new Date()
                                                    ? 'Extended use'
                                                    : 'Register to use'}
                                            </p>
                                            <p>
                                                <i>Estimated</i>
                                                {selectedPackage.packageExpiry <= 365
                                                    ? userTransactionInfo.expirationDate < new Date()
                                                        ? ': ' +
                                                          formatDate(new Date()) +
                                                          ' - ' +
                                                          formatDate(
                                                              new Date(
                                                                  new Date().getTime() +
                                                                      selectedPackage.packageExpiry *
                                                                          24 *
                                                                          60 *
                                                                          60 *
                                                                          1000,
                                                              ),
                                                          )
                                                        : ': ' +
                                                          formatDate(new Date(userTransactionInfo.expirationDate)) +
                                                          ' - ' +
                                                          formatDate(
                                                              new Date(
                                                                  new Date(
                                                                      userTransactionInfo.expirationDate,
                                                                  ).getTime() +
                                                                      selectedPackage.packageExpiry *
                                                                          24 *
                                                                          60 *
                                                                          60 *
                                                                          1000,
                                                              ),
                                                          )
                                                    : ': Lifetime use'}
                                            </p>
                                        </div>
                                        <div className="text-right opacity-80 md:pl-4 md:border-l">
                                            <i className="block">Package price: {selectedPackage.packagePrice}$</i>
                                            <i className="block">Discount: 0%</i>
                                            <i className="block">
                                                Into money:{' '}
                                                <p className="inline-block font-bold text-3xl text-red-600">
                                                    {selectedPackage.packagePrice}$
                                                </p>
                                            </i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-[240px] mx-auto mt-6">
                                <PaypalCheckoutButton pack={selectedPackage} />
                            </div>
                        </>
                    ) : (
                        <div className="h-full">
                            <div
                                className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
                                role="alert"
                            >
                                <p className="font-bold">Your account is Lifetime use</p>
                                <p>Your account has purchased our lifetime plan. Thank you for joining us</p>
                            </div>
                        </div>
                    )
                ) : (
                    <Spinner className="block mx-auto mt-4" size="xl" />
                )}
            </div>
        </div>
    );
}

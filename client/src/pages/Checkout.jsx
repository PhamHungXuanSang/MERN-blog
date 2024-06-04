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
import toast from 'react-hot-toast';
import { BsQrCode } from 'react-icons/bs';

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

    const handleBankTransferPayment = async () => {
        try {
            const res = await fetch('/api/transaction/create-payment-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedPackage),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                window.location.href = data.checkoutUrl;
            } else {
                return toast.error('Can not create payment link');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="paypal rounded-lg border border-teal-500 md:max-w-[50%] mx-auto md:p-4 p-1">
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
                    !userTransactionInfo.expirationDate ||
                    (userTransactionInfo.expirationDate &&
                        new Date(userTransactionInfo.expirationDate).getFullYear() < 2100) ? (
                        <>
                            <div className="border border-gray-500 rounded-lg md:p-4 p-1">
                                <div className="bg-slate-300 p-2 rounded-lg text-black flex flex-col gap-1">
                                    <p>
                                        <img
                                            src={currentUser.userAvatar}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full inline-block"
                                        ></img>
                                        <b>
                                            {' @'}
                                            {currentUser.username}
                                        </b>
                                    </p>
                                    <p className="line-clamp-3 break-words">
                                        Email: <b>{currentUser.email}</b>
                                    </p>
                                    {userTransactionInfo.expirationDate ? (
                                        <p>
                                            Package expiration date:{' '}
                                            <b>{dateToDateAndTime(userTransactionInfo.expirationDate)}</b>
                                        </p>
                                    ) : (
                                        <p>
                                            Package expiration date: <b>Not available</b>
                                        </p>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <span className="font-semibold text-xl">Billing Information</span>
                                    <div className="flex flex-col md:flex-row justify-between border p-2 mt-2 rounded-lg">
                                        <div>
                                            <p>
                                                <i>Package name: </i>
                                                <b>{selectedPackage.packageName}</b>
                                            </p>
                                            <p>
                                                <i>Package duration:</i>{' '}
                                                <b>
                                                    {selectedPackage.packageExpiry <= 365
                                                        ? selectedPackage.packageExpiry + ' days'
                                                        : 'Forever'}
                                                </b>
                                            </p>
                                            {userTransactionInfo.expirationDate ? (
                                                <p>
                                                    <i>Transaction type:</i>{' '}
                                                    <b>
                                                        {new Date(userTransactionInfo.expirationDate) > new Date()
                                                            ? 'Extended'
                                                            : 'Register'}
                                                    </b>
                                                </p>
                                            ) : (
                                                <p>
                                                    <i>Transaction type:</i> <b>Register</b>
                                                </p>
                                            )}
                                            {userTransactionInfo.expirationDate ? (
                                                <p>
                                                    <i>Estimated</i>
                                                    <b>
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
                                                                  formatDate(
                                                                      new Date(userTransactionInfo.expirationDate),
                                                                  ) +
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
                                                    </b>
                                                </p>
                                            ) : (
                                                <p>
                                                    <i>Estimated</i>
                                                    <b>
                                                        {selectedPackage.packageExpiry <= 365
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
                                                            : ': Lifetime use'}
                                                    </b>
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right opacity-80 md:pl-4 md:border-l">
                                            <i className="block">
                                                Package price: <b>{selectedPackage.packagePrice}$</b>
                                            </i>
                                            <i className="block">
                                                Discount: <b>0%</b>
                                            </i>
                                            <i className="block">
                                                Into money:{' '}
                                                <p className="inline-block font-bold text-3xl text-red-600">
                                                    <b>{selectedPackage.packagePrice}$</b>
                                                </p>
                                            </i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 p-4 md:py-6">
                                <div className="w-full md:max-w-xs lg:max-w-sm mx-auto rounded-2xl overflow-hidden h-12 hover:scale-110 duration-300">
                                    <PaypalCheckoutButton pack={selectedPackage} />
                                </div>
                                <button
                                    className="flex-shrink lg:flex-shrink-0 w-full md:w-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-2 px-6 md:px-8 rounded-2xl shadow transition-all duration-300 ease-in-out transform hover:scale-105"
                                    onClick={handleBankTransferPayment}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <BsQrCode size={32} />
                                        <span className="text-xl">Scan QR Code</span>
                                    </div>
                                </button>
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

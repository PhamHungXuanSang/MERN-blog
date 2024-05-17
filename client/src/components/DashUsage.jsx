/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';

export default function DashUsage() {
    const [userTransactions, setUserTransactions] = useState(null);
    const [userTransactionInfo, setUserTransactionInfo] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getTransactionHistory = async () => {
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
                    setUserTransactions(data.allUserTransactionHistorys);
                    setUserTransactionInfo(data.userTransactionInfo);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getTransactionHistory();
    }, []);

    function totalAmount(userTransactions) {
        let totalAmount = 0;
        userTransactions.forEach((tran) => (totalAmount += tran.packagePrice));
        return totalAmount;
    }

    return (
        <div className="py-8 px-4">
            {userTransactionInfo != null ? (
                <>
                    <div className="w-full h-fit border-b-2 border-neutral-300">
                        <p className="border-b-2 text-lg w-fit py-2 px-4">Account usage</p>
                    </div>
                    <div className="flex flex-col md:flex-row flex-wrap justify-between items-center border border-teal-500 p-4 my-4 rounded-lg">
                        <p className="font-semibold">
                            Free trial:{' '}
                            <p
                                className={`inline${userTransactionInfo.isTrialed ? ' text-red-600' : ' text-green-600'}`}
                            >
                                {userTransactionInfo.isTrialed ? 'Tried' : "Haven't tried"}
                            </p>
                        </p>
                        <p className="font-semibold">
                            Permission create blog:{' '}
                            <p
                                className={`inline${userTransactionInfo.createPermission ? ' text-green-600' : ' text-red-600'}`}
                            >
                                {userTransactionInfo.createPermission ? 'Allow' : 'Not allow'}
                            </p>
                        </p>
                        <p className="font-semibold text-center">
                            Creation expiration:{' '}
                            <p
                                className={`inline${new Date(userTransactionInfo.expirationDate) > new Date() ? ' text-green-600' : ' text-red-600'}`}
                            >
                                {userTransactionInfo.expirationDate
                                    ? new Date(userTransactionInfo.expirationDate).getFullYear() < 2100
                                        ? dateToDateAndTime(userTransactionInfo.expirationDate)
                                        : 'Lifetime use'
                                    : 'NaN'}
                            </p>
                        </p>
                        <p className="font-semibold">
                            Total amount: <p className="inline text-teal-600">{totalAmount(userTransactions)} $</p>
                        </p>
                    </div>
                </>
            ) : null}
        </div>
    );
}

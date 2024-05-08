/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './NotFound';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';
import BackToTopButton from './BackToTopButton.jsx';

export default function DashTransaction() {
    const [userTransactions, setUserTransactions] = useState(null);
    const [showMore, setShowMore] = useState(true);
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
                    setUserTransactions(data.userTransactionHistorys);
                    if (
                        userTransactions != null &&
                        data.userTransactionHistorys.length + userTransactions.length >=
                            data.allUserTransactionHistorys.length
                    ) {
                        setShowMore(false);
                    }
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getTransactionHistory();
    }, []);

    const handleShowMore = async () => {
        const startIndex = userTransactions.length;
        try {
            const res = await fetch(
                `/api/transaction/get-transaction-history/${currentUser._id}?startIndex=${startIndex}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                },
            );
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setUserTransactions((prev) => [...prev, ...data.userTransactionHistorys]);
                if (
                    userTransactions != null &&
                    data.userTransactionHistorys.length + userTransactions.length >=
                        data.allUserTransactionHistorys.length
                ) {
                    setShowMore(false);
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="w-full h-fit border-b-2 border-neutral-300 mb-4">
                <p className="border-b-2 text-lg w-fit py-2 px-4">All transaction</p>
            </div>
            {userTransactions != null ? (
                userTransactions?.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md text-center" striped>
                            <Table.Head>
                                <Table.HeadCell>Package Name</Table.HeadCell>
                                <Table.HeadCell>Package Duration</Table.HeadCell>
                                <Table.HeadCell>Package Price</Table.HeadCell>
                                <Table.HeadCell>Date Of Payment</Table.HeadCell>
                                <Table.HeadCell>Transaction Type</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {userTransactions.map((tran, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell>{tran.packageName}</Table.Cell>
                                            <Table.Cell>
                                                {tran.packageExpiry <= 365 ? tran.packageExpiry + ' days' : 'Forever'}
                                            </Table.Cell>
                                            <Table.Cell>{tran.packagePrice} $</Table.Cell>
                                            <Table.Cell>{dateToDateAndTime(tran.paymentDate)}</Table.Cell>
                                            <Table.Cell>{tran.transactionType.toUpperCase()}</Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                        {showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                                Show more
                            </button>
                        )}
                    </>
                ) : (
                    <NotFound object={'You have not made any transactions yet'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <BackToTopButton />
        </div>
    );
}

/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './NotFound';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import dateToDateAndTime from '../utils/dateToDateAndTime.js';
import BackToTopButton from './BackToTopButton.jsx';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashTransaction() {
    const [userTransactions, setUserTransactions] = useState(null);
    const [showMore, setShowMore] = useState(true);
    const [packagesName, setPackagesName] = useState(null);
    const [packagesCount, setPackagesCount] = useState(null);
    const [packageRenewalCount, setPackageRenewalCount] = useState(0);
    const [packageBuyCount, setPackageBuyCount] = useState(0);
    const [eachPackageTotalMoney, setEachPackageTotalMoney] = useState(null);
    const [totalTransactions, setTotalTransactions] = useState(0);
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
                    setPackagesName(data.packagesName);
                    setPackagesCount(data.totalBuyCountEachPackage);
                    setEachPackageTotalMoney(data.eachPackageTotalMoney);
                    setPackageRenewalCount(data.packageRenewalCount);
                    setPackageBuyCount(data.packageBuyCount);
                    setTotalTransactions(data.allUserTransactionHistorys.length);
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

    const data = {
        labels: packagesName,
        datasets: [
            {
                data: packagesCount,
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue', 'aqua', 'gray'],
            },
        ],
    };

    const options = {};

    useEffect(() => {
        if (userTransactions?.length >= totalTransactions) {
            setShowMore(false);
        }
    }, [userTransactions]);

    return (
        <div className="py-8 px-4">
            <div className="flex items-center justify-between w-full h-fit border-b-2 border-neutral-300 mb-4">
                <p className="border-b-2 text-lg w-fit py-2 px-4">All transaction</p>
                <p>
                    Rows <b>{userTransactions?.length}</b> of <b>{totalTransactions}</b>
                </p>
            </div>
            <div className="border rounded-lg border-teal-500 mb-4 p-4">
                {eachPackageTotalMoney != null ? (
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <div className="flex flex-wrap gap-2">
                            {eachPackageTotalMoney.map((pack, idx) => (
                                <div
                                    key={idx}
                                    className="w-fit h-min md:p-4 p-2 dark:bg-slate-800 rounded-md shadow-md"
                                >
                                    <div className="flex justify-between gap-2">
                                        <div>
                                            <h3 className="text-gray-500 md:text-lg text-base uppercase">
                                                {pack.packageName}
                                            </h3>
                                            <p className="md:text-2xl text-lg text-teal-600">{pack.packagePrice} $</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="w-fit h-min md:p-4 p-2 dark:bg-slate-800 rounded-md shadow-md">
                                <div className="flex justify-between gap-2">
                                    <div>
                                        <h3 className="text-gray-500 md:text-lg text-base uppercase">
                                            Package Renewal Count
                                        </h3>
                                        <p className="md:text-2xl text-lg text-teal-600">{packageRenewalCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-fit h-min md:p-4 p-2 dark:bg-slate-800 rounded-md shadow-md">
                                <div className="flex justify-between gap-2">
                                    <div>
                                        <h3 className="text-gray-500 md:text-lg text-base uppercase">
                                            Package Buy Count
                                        </h3>
                                        <p className="md:text-2xl text-lg text-teal-600">{packageBuyCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data.labels.length > 0 && (
                            <div className="max-w-[280px] text-center mx-auto">
                                <p>Chart of package purchase rate</p>
                                <Pie data={data} options={options}></Pie>
                            </div>
                        )}
                    </div>
                ) : (
                    <Spinner className="block mx-auto mt-4" size="md" />
                )}
            </div>
            {userTransactions != null ? (
                userTransactions?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <Table hoverable className="shadow-md text-center w-full min-w-[600px]" striped>
                                <Table.Head>
                                    <Table.HeadCell>Package Name</Table.HeadCell>
                                    <Table.HeadCell>Package Duration</Table.HeadCell>
                                    <Table.HeadCell>Package Price</Table.HeadCell>
                                    <Table.HeadCell>Date Of Payment</Table.HeadCell>
                                    <Table.HeadCell>Transaction Type</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {userTransactions.map((tran, i) => (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell>{tran.packageName}</Table.Cell>
                                            <Table.Cell>
                                                {tran.packageExpiry <= 365 ? tran.packageExpiry + ' days' : 'Forever'}
                                            </Table.Cell>
                                            <Table.Cell>{tran.packagePrice} $</Table.Cell>
                                            <Table.Cell>{dateToDateAndTime(tran.paymentDate)}</Table.Cell>
                                            <Table.Cell>{tran.transactionType.toUpperCase()}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
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

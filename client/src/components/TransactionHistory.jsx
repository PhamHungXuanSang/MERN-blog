import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { HiArrowNarrowUp } from 'react-icons/hi';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { MdOutlineAutorenew } from 'react-icons/md';
import { BiSolidPurchaseTag } from 'react-icons/bi';
import { Spinner, Table } from 'flowbite-react';
import NotFound from './NotFound';
import dateToDateAndTime from '../utils/dateToDateAndTime';
import { Link } from 'react-router-dom';
import BackToTopButton from './BackToTopButton';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function TransactionHistory() {
    const [allUserPaymentHistory, setAllUserPaymentHistory] = useState(null);
    const [packagesName, setPackagesName] = useState(null);
    const [packagesCount, setPackagesCount] = useState(null);
    const [thisMonthMoney, setThisMonthMoney] = useState(null);
    const [totalMoney, setTotalMoney] = useState(null);
    const [countRenewal, setCountRenewal] = useState(null);
    const [countRenewalThisMonth, setCountRenewalThisMonth] = useState(null);
    const [countNewPurchases, setCountNewPurchases] = useState(null);
    const [countNewPurchasesThisMonth, setCountNewPurchasesThisMonth] = useState(null);

    const handleGetAdminViewAllTransaction = async () => {
        const res = await fetch(`/api/transaction/admin-view-all-transaction`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        if (res.status == 200) {
            setAllUserPaymentHistory(data.allPayment);
            setPackagesName(data.packages);
            setPackagesCount(data.totalBuyCountEachPackage);
            setThisMonthMoney(data.thisMonthMoney);
            setTotalMoney(data.totalMoney);
            setCountRenewal(data.countRenewal);
            setCountRenewalThisMonth(data.countRenewalThisMonth);
            setCountNewPurchases(data.countNewPurchases);
            setCountNewPurchasesThisMonth(data.countNewPurchasesThisMonth);
        } else {
            return toast.error(data.message);
        }
    };
    useEffect(() => {
        handleGetAdminViewAllTransaction();
    }, []);

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

    return (
        <div className="py-8 px-4">
            <div className="w-full h-fit border-b-2 border-neutral-300">
                <p className="border-b-2 text-lg w-fit py-2 px-4">Transaction History</p>
            </div>
            <div className="border-teal-500 border mt-4 rounded-xl p-4 flex justify-between px-8">
                <div className="flex flex-wrap items-center justify-center gap-10">
                    {totalMoney != null && thisMonthMoney != null ? (
                        <div className="w-fit h-min p-4 dark:bg-slate-800 rounded-md shadow-md">
                            <div className="flex justify-between gap-2">
                                <div>
                                    <h3 className="text-gray-500 text-lg uppercase">Total Revenue</h3>
                                    <p className="text-2xl">{totalMoney}$</p>
                                </div>
                                <FaMoneyCheckAlt className="bg-teal-600 text-white rounded-full p-3 text-5xl shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm mt-2">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {thisMonthMoney}$
                                </span>
                                <div className="text-gray-500">This month</div>
                            </div>
                        </div>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="md" />
                    )}
                    {countRenewal != null && countRenewalThisMonth != null ? (
                        <div className="w-fit h-min p-4 dark:bg-slate-800 rounded-md shadow-md">
                            <div className="flex justify-between gap-2">
                                <div>
                                    <h3 className="text-gray-500 text-lg uppercase">Count Renewal</h3>
                                    <p className="text-2xl">{countRenewal}</p>
                                </div>
                                <MdOutlineAutorenew className="bg-lime-600 text-white rounded-full p-3 text-5xl shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm mt-2">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {countRenewalThisMonth}
                                </span>
                                <div className="text-gray-500">This month</div>
                            </div>
                        </div>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="md" />
                    )}
                    {countNewPurchases != null && countNewPurchasesThisMonth != null ? (
                        <div className="w-fit h-min p-4 dark:bg-slate-800 rounded-md shadow-md">
                            <div className="flex justify-between gap-2">
                                <div>
                                    <h3 className="text-gray-500 text-lg uppercase">Count New Purchases</h3>
                                    <p className="text-2xl">{countNewPurchases}</p>
                                </div>
                                <BiSolidPurchaseTag className="bg-indigo-600 text-white rounded-full p-3 text-5xl shadow-lg" />
                            </div>
                            <div className="flex gap-2 text-sm mt-2">
                                <span className="text-green-500 flex items-center">
                                    <HiArrowNarrowUp />
                                    {countNewPurchasesThisMonth}
                                </span>
                                <div className="text-gray-500">This month</div>
                            </div>
                        </div>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="md" />
                    )}
                </div>
                <div className="w-[300px] text-center">
                    <p>Chart of proportion distribution of packages</p>
                    <Pie data={data} options={options}></Pie>
                </div>
            </div>
            {allUserPaymentHistory != null ? (
                allUserPaymentHistory?.length > 0 ? (
                    <div className="mt-4">
                        <Table hoverable className="shadow-md text-center" striped>
                            <Table.Head>
                                <Table.HeadCell>User</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Package Name</Table.HeadCell>
                                <Table.HeadCell>Package Price</Table.HeadCell>
                                <Table.HeadCell>Date Of Payment</Table.HeadCell>
                                <Table.HeadCell>Transaction Type</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {allUserPaymentHistory.map((tran, i) => {
                                    return (
                                        <Table.Row key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell>
                                                <Link to={`/user/${tran.userId.username}`}>
                                                    <div className="flex gap-1 items-center">
                                                        <img
                                                            src={tran.userId.userAvatar}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        {tran.userId.username}
                                                    </div>
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>{tran.userId.email}</Table.Cell>
                                            <Table.Cell>{tran.packageName}</Table.Cell>
                                            <Table.Cell>{tran.packagePrice} $</Table.Cell>
                                            <Table.Cell>{dateToDateAndTime(tran.paymentDate)}</Table.Cell>
                                            <Table.Cell>{tran.transactionType.toUpperCase()}</Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                ) : (
                    <NotFound object={'No payment history found'} />
                )
            ) : (
                <Spinner className="block mx-auto mt-4" size="xl" />
            )}
            <BackToTopButton />
        </div>
    );
}

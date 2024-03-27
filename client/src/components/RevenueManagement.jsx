import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RevenueManagement() {
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);
    const [userCountForEachPackage, setUserCountForEachPackage] = useState(null);
    const [userCountForEachPackageInThisMonth, setUserCountForEachPackageInThisMonth] = useState(null);
    const [revenueByPackage, setRevenueByPackage] = useState(null);
    const [revenue, setRevenue] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getStatistical = async () => {
            const res = await fetch(`/api/statistical/get-statistical`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year, month, day }),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status === 200) {
                setUserCountForEachPackage(data.userCountForEachPackage);
                setUserCountForEachPackageInThisMonth(data.userCountForEachPackageInThisMonth);
                setRevenueByPackage(data.revenueByPackage);
                setRevenue(data.revenue);
            } else {
                console.log(data.message);
            }
        };
        getStatistical();
    }, []);

    // let data = {};
    // if (revenueByPackage != null) {
    //     // Tạo một object để lưu trữ dữ liệu tạm theo packageName
    //     const tempData = revenueByPackage.reduce((acc, current) => {
    //         current.package.forEach((pkg) => {
    //             if (!acc[pkg.packageName]) {
    //                 acc[pkg.packageName] = [];
    //             }
    //             acc[pkg.packageName].push(pkg.totalRevenue);
    //         });
    //         return acc;
    //     }, {});
    //     console.log(
    //         Object.entries(tempData).map(([packageName, revenues]) => ({
    //             label: `${packageName}`,
    //             data: revenues,
    //             backgroundColor: `aqua`,
    //             borderColor: 'black',
    //             borderWidth: 1,
    //         })),
    //     );
    //     data = {
    //         labels: revenueByPackage.map((pack) => pack._id.monthYear),
    //         datasets: Object.entries(tempData).map(([packageName, revenues]) => ({
    //             label: `${packageName}`,
    //             data: revenues,
    //             backgroundColor: `aqua`,
    //             borderColor: 'black',
    //             borderWidth: 1,
    //         })),
    //     };
    // }

    return (
        <div className="py-12 px-4 md:mx-auto">
            <div className="flex-wrap flex gap-4 justify-center">
                {userCountForEachPackage != null ? (
                    userCountForEachPackage.map((pack, i) => {
                        return (
                            <div
                                key={i}
                                className="flex justify-between flex-col p-3 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md"
                            >
                                <div className="flex justify-between">
                                    <h3 className="text-gray-500 text-lg uppercase">{pack.packageName}</h3>
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                    <p className="text-2xl">{pack.count}</p>
                                    <div className="flex gap-2">
                                        <span className="text-green-500 flex items-center">
                                            <HiArrowNarrowUp />
                                            {userCountForEachPackageInThisMonth[i].count}
                                        </span>
                                        <div className="text-gray-500">Last month</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Spinner className="block mx-auto mt-4" size="xl" />
                )}
            </div>
            <div className="flex-wrap flex gap-4 justify-center mt-4">
                {/* {revenueByPackage && (
                    <Bar
                        style={{ padding: '20px', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}
                        data={data}
                    ></Bar>
                )} */}
                <div className="flex justify-between flex-col p-4 dark:bg-slate-800 md:w-[44%] w-full rounded-md shadow-2xl">
                    {revenueByPackage ? (
                        <div className="flex flex-col gap-3 justify-between">
                            <div className="flex justify-between items-center">
                                <h3 className="text-gray-500 text-lg uppercase">Revenue for each package</h3>
                                <Link to="/admin?tab=revenue-each-package">
                                    <Button outline gradientDuoTone="greenToBlue">
                                        View
                                    </Button>
                                </Link>
                            </div>
                            <img
                                className="rounded-lg"
                                src="https://p16-flow-sign-va.ciciai.com/ocean-cloud-tos-us/cb1591a656de4c0c93e65bf18910f420.png~tplv-6bxrjdptv7-image.png?rk3s=18ea6f23&x-expires=1743000521&x-signature=Wi%2FYL3lk%2BFoFtCSIFwbcapxw6F4%3D"
                            />
                        </div>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    )}
                </div>
                <div className="flex justify-between flex-col p-4 dark:bg-slate-800 md:w-[44%] w-full rounded-md shadow-2xl">
                    {revenueByPackage ? (
                        <div className="flex flex-col gap-3 justify-between">
                            <div className="flex justify-between items-center">
                                <h3 className="text-gray-500 text-lg uppercase">Revenue</h3>
                                <Link to="/admin?tab=revenue-package">
                                    <Button outline gradientDuoTone="greenToBlue">
                                        View
                                    </Button>
                                </Link>
                            </div>
                            <img
                                className="rounded-lg"
                                src="https://p16-flow-sign-va.ciciai.com/ocean-cloud-tos-us/cd905938cea849bc9cb0b7dee13d21a5.png~tplv-6bxrjdptv7-image.png?rk3s=18ea6f23&x-expires=1743000691&x-signature=aKflIXkLOAJZoEQx%2FRHqAiNjcDo%3D"
                            />
                        </div>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    )}
                </div>
            </div>
        </div>
    );
}

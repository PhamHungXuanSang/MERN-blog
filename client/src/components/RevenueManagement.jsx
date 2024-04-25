import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowNarrowUp } from 'react-icons/hi';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RevenueManagement() {
    const [userCountForEachPackage, setUserCountForEachPackage] = useState(null);
    const [userCountForEachPackageInThisMonth, setUserCountForEachPackageInThisMonth] = useState(null);
    const [revenueByPackage, setRevenueByPackage] = useState(null);
    const [revenue, setRevenue] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getStatistical = async () => {
            try {
                const res = await fetch(`/api/statistical/get-statistical`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
            } catch (error) {
                console.log(error);
            }
        };
        getStatistical();
    }, []);

    let dataEachPackage = {};
    if (revenueByPackage != null) {
        // Tạo một mảng chỉ số để theo dõi tháng
        const monthIndices = revenueByPackage.map((pack) => pack._id.monthYear);

        // Sử dụng reduce để xây dựng tempData
        const tempData = revenueByPackage.reduce((acc, current) => {
            const monthIndex = current._id.monthYear;
            current.package.forEach((pkg) => {
                if (!acc[pkg.packageName]) {
                    // Nếu packageName chưa tồn tại, tạo một mảng mới với chiều dài bằng monthIndices
                    // và fill tất cả các giá trị với 0
                    acc[pkg.packageName] = Array(monthIndices.length).fill(0);
                }
                // Tìm chỉ số của tháng hiện hành trong mảng chỉ số
                const index = monthIndices.indexOf(monthIndex);
                // Cập nhật revenue cho tháng này, thay thế giá trị 0 nếu không tồn tại
                acc[pkg.packageName][index] = pkg.totalRevenue || 0;
            });
            return acc;
        }, {});

        // Xây dựng đối tượng dataEachPackage cho việc hiển thị
        dataEachPackage = {
            labels: monthIndices,
            datasets: Object.entries(tempData).map(([packageName, revenues], i) => ({
                label: packageName,
                data: revenues,
                backgroundColor:
                    i == 1
                        ? 'red'
                        : i == 2
                          ? 'yellow'
                          : i == 3
                            ? 'orange'
                            : i == 4
                              ? 'green'
                              : i == 5
                                ? 'blue'
                                : i == 6
                                  ? 'purple'
                                  : 'aqua',
                borderColor: 'black',
                borderWidth: 1,
            })),
        };
    }

    let data = {};
    if (revenue != null) {
        data = {
            labels: revenue.map((pack) => pack._id.monthYear),
            datasets: [
                {
                    label: ['Total money for the month'],
                    data: revenue.map((pack) => pack.revenue),
                    backgroundColor: `aqua`,
                    borderColor: 'black',
                    borderWidth: 1,
                },
            ],
        };
    }

    return (
        <div className="py-8 px-4 md:mx-auto">
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
                            <div>
                                {revenueByPackage && (
                                    <Bar
                                        style={{
                                            padding: '20px',
                                            width: '100%',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                        data={dataEachPackage}
                                    ></Bar>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    )}
                </div>
                <div className="flex justify-between flex-col p-4 dark:bg-slate-800 md:w-[44%] w-full rounded-md shadow-2xl">
                    {revenue ? (
                        <div className="flex flex-col gap-3 justify-between">
                            <div className="flex justify-between items-center">
                                <h3 className="text-gray-500 text-lg uppercase">Revenue</h3>
                                <Link to="/admin?tab=revenue-package">
                                    <Button outline gradientDuoTone="greenToBlue">
                                        View
                                    </Button>
                                </Link>
                            </div>
                            <div>
                                {revenue && (
                                    <Bar
                                        style={{
                                            padding: '20px',
                                            width: '100%',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                        data={data}
                                    ></Bar>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Spinner className="block mx-auto mt-4" size="xl" />
                    )}
                </div>
            </div>
        </div>
    );
}

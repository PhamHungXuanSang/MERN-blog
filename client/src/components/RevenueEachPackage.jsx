import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Label, TextInput } from 'flowbite-react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import ModalConfirm from './ModalConfirm.jsx';
import toast from 'react-hot-toast';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RevenueEachPackage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [revenueByPackage, setRevenueByPackage] = useState(null);
    const [packages, setPackages] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileName, setFileName] = useState('statistical-data');

    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDayOfMonth;
    });
    useEffect(() => {
        const getStatistical = async () => {
            const year = startDate.getFullYear();
            const month = startDate.getMonth() + 1;
            const day = startDate.getDate();
            try {
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
                    setRevenueByPackage(data.revenueByPackage);
                    setPackages(data.packages);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getStatistical();
    }, [startDate]);

    let data = {};
    if (revenueByPackage != null) {
        // Tạo một mảng chỉ số để theo dõi tháng
        const monthIndices = revenueByPackage.map((pack) => pack._id.monthYear);
        const tempData = revenueByPackage.reduce((acc, current) => {
            const monthIndex = current._id.monthYear;
            current.package.forEach((pkg) => {
                if (!acc[pkg.packageName]) {
                    // Nếu packageName chưa tồn tại, tạo một mảng mới với chiều dài bằng monthIndices
                    // và fill tất cả các giá trị với 0
                    acc[pkg.packageName] = Array(monthIndices.length).fill(0);
                }
                const index = monthIndices.indexOf(monthIndex);
                acc[pkg.packageName][index] = pkg.totalRevenue || 0;
            });
            return acc;
        }, {});

        data = {
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

    const handleExportExcel = () => {
        function getMonthYearArray(startDate) {
            const start = new Date(startDate);
            const current = new Date();
            let months = [];

            while (start <= current) {
                // Thêm "1" vì getMonth() trả về tháng từ 0-11
                let month = String(start.getMonth() + 1).padStart(2, '0');
                let year = start.getFullYear();

                months.push(`${month}-${year}`);
                start.setMonth(start.getMonth() + 1);
            }

            return months;
        }
        // lấy mảng chứa các tháng-năm từ startDate đến hiện tại
        const months = getMonthYearArray(new Date(startDate));
        let excelData = [];
        months.forEach((month) => {
            // Với mỗi tháng lặp qua packages
            packages.forEach((pkg) => {
                let a = {
                    monthYear: month,
                    packageName: pkg.packageName,
                    packagePrice: pkg.packagePrice,
                    totalMoneyInThisMonth: 0,
                };
                revenueByPackage.forEach((revenueMonth) => {
                    if (revenueMonth._id.monthYear == month) {
                        revenueMonth.package.some((p) => {
                            if (p.packageName === pkg.packageName) {
                                a = { ...a, totalMoneyInThisMonth: p.totalRevenue };
                            }
                        });
                    }
                });
                a = {
                    ...a,
                    buyCountInThisMonth: a.totalMoneyInThisMonth / a.packagePrice,
                    totalMoneyInThisMonth: a.totalMoneyInThisMonth,
                };
                excelData.push(a);
            });
        });

        setExcelData(excelData);
        setShowModal(true);
    };

    const headers = [
        { label: 'Month', key: 'monthYear' },
        { label: 'Package Name', key: 'packageName' },
        { label: 'Package Price', key: 'packagePrice' },
        { label: 'Number Of Users Purchasing', key: 'buyCountInThisMonth' },
        { label: 'Into Money', key: 'totalMoneyInThisMonth' },
    ];

    const handleChangeFileName = (e) => {
        setFileName(e.target.value);
    };

    return (
        <div className="py-12 px-4 md:mx-auto">
            <div className="flex gap-4 items-center">
                <Label>Choose start time: </Label>
                <DatePicker
                    className="rounded-md dark:bg-[#1f2937]"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat={'dd/MM/yyyy'}
                    maxDate={new Date()}
                />
                <Button gradientMonochrome="success" onClick={handleExportExcel}>
                    Export to Excel
                </Button>
                {excelData ? (
                    <CSVLink
                        id="csvLink"
                        className="hidden"
                        data={excelData}
                        headers={headers}
                        filename={fileName}
                        target="_blank"
                    >
                        Export
                    </CSVLink>
                ) : null}
            </div>
            <div>
                {revenueByPackage && (
                    <Bar
                        style={{ padding: '20px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}
                        data={data}
                    ></Bar>
                )}
            </div>

            {showModal ? (
                <ModalConfirm
                    showModal={showModal}
                    setShowModal={setShowModal}
                    title={`You want to export data to an excel file?\nPlease choose file name`}
                    onConfirm={() => {
                        if (document.querySelector('#fileName').value.trim() != '') {
                            document.querySelector('#csvLink').click();
                            setShowModal(false);
                        } else {
                            return toast.error('Please enter file name');
                        }
                    }}
                    onNoConfirm={() => setShowModal(false)}
                    confirm="Yes I am sure"
                    noConfirm="No, I'm not sure"
                >
                    <div className="flex justify-center items-center gap-1 mb-4">
                        <TextInput
                            defaultValue={fileName}
                            required
                            id="fileName"
                            onChange={handleChangeFileName}
                        ></TextInput>
                        <span>.csv</span>
                    </div>
                </ModalConfirm>
            ) : (
                ''
            )}
        </div>
    );
}

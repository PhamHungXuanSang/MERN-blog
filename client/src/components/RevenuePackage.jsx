import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { Button, Label } from 'flowbite-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RevenuePackage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [revenue, setRevenue] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    useEffect(() => {
        const getStatistical = async () => {
            const year = startDate.getFullYear();
            const month = startDate.getMonth() + 1;
            const day = startDate.getDate();
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
                setRevenue(data.revenue);
            } else {
                console.log(data.message);
            }
        };
        getStatistical();
    }, [startDate]);

    let data = {};
    if (revenue != null) {
        data = {
            labels: revenue.map((pack) => pack._id.monthYear),
            datasets: [
                {
                    label: ['Statistics by month'],
                    data: revenue.map((pack) => pack.revenue),
                    backgroundColor: `aqua`,
                    borderColor: 'black',
                    borderWidth: 1,
                },
            ],
        };
    }

    const handleExportExcel = () => {
        console.log('Exported');
        // điều hướng qua trang khác tạo một table rồi dùng js export ra excel
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
            </div>
            <div>
                {revenue && (
                    <Bar
                        style={{ padding: '20px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}
                        data={data}
                    ></Bar>
                )}
            </div>
        </div>
    );
}

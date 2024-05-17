import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOutSuccess, successfullyPurchase } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPackage } from '../redux/selectedPackage/selectedPackageSlice';
import toast from 'react-hot-toast';

export default function SuccessfulTransaction() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedPackage = useSelector((state) => state.selectedPackage.selectedPackage);

    useEffect(() => {
        const handleCheckPaymentStatus = async () => {
            const url = new URL(window.location.href);
            const searchParams = new URLSearchParams(url.search);
            const params = {};
            searchParams.forEach((value, key) => {
                params[key] = value;
            });
            if (
                params.code == '00' &&
                params.cancel == 'false' &&
                params.status == 'PAID' &&
                params.id != '' &&
                params.orderCode != ''
            ) {
                try {
                    const res = await fetch(`/api/transaction/get-payment-info/${params.orderCode}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const data = await res.json();
                    if (res.status === 200) {
                        if (params.id == data.id) {
                            const res = await fetch('/api/transaction/store-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(selectedPackage),
                            });
                            const data = await res.json();
                            if (res.status === 403) {
                                dispatch(signOutSuccess());
                                return navigate('/sign-in');
                            }
                            if (res.status == 200) {
                                dispatch(successfullyPurchase(data));
                                dispatch(setSelectedPackage(null));
                                toast.success('Successful transaction. Check your email for more detail', {
                                    duration: 6000,
                                });
                            } else {
                                toast.error('An error occurred, payment cannot be completed', { duration: 6000 });
                                return;
                            }
                        } else {
                            console.log('3');
                            navigate('/order-status-cancel');
                        }
                    } else {
                        console.log('2');
                        navigate('/order-status-cancel');
                    }
                } catch (error) {
                    console.log(error);
                }
            } else if (Object.keys(params).length === 0) {
                dispatch(setSelectedPackage(null));
                toast.success('Successful transaction. Check your email for more detail', {
                    duration: 6000,
                });
            } else {
                navigate('/order-status-cancel');
            }
        };

        handleCheckPaymentStatus();
    }, []);

    const openGmail = () => {
        window.open('https://www.gmail.com', '_blank');
    };

    return (
        <div
            className="h-full relative p-10 flex flex-col items-center gap-10 text-center"
            style={{ animation: 'fadeIn 2s' }}
        >
            <img
                src="/transaction-successful.png"
                className="select-none border-2 border-gray-300 w-48 aspect-square object-cover rounded"
            />
            <div>
                <h1 className="text-4xl leading-7">Payment success!</h1>
                <p className="text-sm md:text-base lg:text-lg mt-4">
                    Thank you for using our service. A confirmation email has been sent to your inbox.
                </p>
                <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 transition duration-300 text-sm md:text-base lg:text-lg font-semibold"
                    onClick={openGmail}
                >
                    Check your email
                </button>
                <p className="text-xl leading-7 mt-4">
                    Start blogging now{' '}
                    <Link to={'/dash-board?tab=create-blog'} className="font-semibold underline hover:text-teal-500">
                        Create Blog
                    </Link>
                </p>
            </div>

            <div className="mt-auto">
                <span className="seft-center font-semibold text-sm sm:text-xl dark:text-white px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                    MERN Blog
                </span>
                <p className="mt-5">
                    Explore the creative community, read unique articles, and engage in diverse, informative
                    conversations.
                </p>
            </div>
        </div>
    );
}

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
    `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`,
    styleSheet.cssRules.length,
);

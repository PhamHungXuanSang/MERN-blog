/* eslint-disable react/prop-types */
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess, successfullyPurchase } from '../redux/user/userSlice.js';
import { setSelectedPackage } from '../redux/selectedPackage/selectedPackageSlice.js';

export default function PaypalCheckoutButton(props) {
    const { pack } = props;
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleApprove = async (orderID) => {
        if (orderID) {
            const res = await fetch('/api/transaction/paypal-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pack),
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.status == 200) {
                dispatch(successfullyPurchase(data));
                dispatch(setSelectedPackage(null));
                toast.success('Successful transaction. Check your email for more detail', { duration: 6000 });
                return navigate('/order-status-success');
            } else {
                toast.error(error, { duration: 6000 });
                return;
            }
        }
    };

    return (
        <PayPalButtons
            style={{ color: 'silver', height: 48, shape: 'pill' }}
            onClick={(data, actions) => {
                return actions.resolve();
            }}
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            description: pack.packageName,
                            amount: {
                                value: pack.packagePrice,
                            },
                        },
                    ],
                });
            }}
            onApprove={async (data, actions) => {
                const order = await actions.order.capture();
                console.log(order);

                handleApprove(data.orderID);
            }}
            onCancel={() => {
                toast.error('Transaction canceled', { duration: 4000 });
            }}
            onError={(err) => {
                setError(err);
            }}
        />
    );
}

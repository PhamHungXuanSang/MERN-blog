import { useSelector } from 'react-redux';
import PaypalCheckoutButton from '../components/PaypalCheckoutButton.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Checkout() {
    const selectedPackage = useSelector((state) => state.selectedPackage.selectedPackage);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(selectedPackage);
        if (selectedPackage == null) {
            return navigate('*');
        }
    }, []);

    return (
        <div className="py-8 px-4 text-center">
            <div className="paypal">
                <p className="checkout-title p-4">Pay with Paypal</p>
                <div className="paypal-button-container max-w-[240px] mx-auto">
                    <PaypalCheckoutButton pack={selectedPackage} />
                </div>
            </div>
        </div>
    );
}

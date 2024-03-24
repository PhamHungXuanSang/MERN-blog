import { useSelector } from 'react-redux';
import PaypalCheckoutButton from '../components/PaypalCheckoutButton.jsx';

export default function Checkout() {
    const selectedPackage = useSelector((state) => state.selectedPackage.selectedPackage);
    
    return (
        <div className="py-12 px-4 text-center">
            <div className="paypal">
                <p className="checkout-title p-4">Pay with Paypal</p>
                <div className="paypal-button-container max-w-[240px] mx-auto">
                    <PaypalCheckoutButton pack={selectedPackage} />
                </div>
            </div>
        </div>
    );
}

import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOutSuccess, successfullyPurchase } from '../redux/user/userSlice.js';
import { setSelectedPackage, removeSelectedPackage } from '../redux/selectedPackage/selectedPackageSlice.js';
import toast from 'react-hot-toast';
import OfferCard from '../components/OfferCard.jsx';
import ModalConfirm from '../components/ModalConfirm.jsx';

export default function Offer() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [showTrial, setShowTrial] = useState(false);
    const [packages, setPackages] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [choosePlan, setChoosePlan] = useState(null);

    const handleCheckFreeTrial = async () => {
        try {
            const res = await fetch(`/api/transaction/checkFreeTrial/${currentUser._id}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                if (data.isTrialed == false) {
                    setShowTrial(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetAllPackage = async () => {
        try {
            const res = await fetch('/api/package/get-all-not-blocked-packages', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            }
            if (res.ok) {
                setPackages(data.packages);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleCheckFreeTrial();
        handleGetAllPackage();
        dispatch(setSelectedPackage(null));
    }, []);

    const handleGetFreeTrial = async () => {
        // call api đổi isTrialed = true và expTime bằng +7 ngày và gán lại redux currentUser createPermission thành true
        try {
            const res = await fetch(`/api/transaction/getFreeTrial/${currentUser._id}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (res.status === 403) {
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                dispatch(successfullyPurchase(data));
                toast.success('You have successfully registered for a free trial to create a blog', { duration: 6000 });
                return navigate('/order-status-success');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePay = () => {
        setShowModal(false);
        dispatch(setSelectedPackage(choosePlan));
        return navigate('/checkout');
    };

    const handleBuy = (pack) => {
        dispatch(removeSelectedPackage());
        setShowModal(true);
        setChoosePlan(pack);
    };

    return (
        <div className="container mx-auto min-h-screen h-fit py-12 px-2 md:px-0">
            <div className="flex flex-col sm:flex-row flex-wrap gap-10 mx-auto">
                <div className="w-full sm:w-[30%] flex flex-col justify-center gap-12">
                    <i className="text-2xl font-semibold block">
                        Unlock Your Creative Potential with Our Blogging Platform! ✍️
                    </i>
                    <p>
                        Ever dreamt of sharing your thoughts with the world or becoming a recognized blogger? Your
                        journey begins here! With our intuitive and user-friendly blogging platform, crafting and
                        showcasing your ideas has never been easier.
                    </p>
                    {showTrial && (
                        <Button outline gradientDuoTone="pinkToOrange" className="mx-auto" onClick={handleGetFreeTrial}>
                            Get free trial in 7 days
                        </Button>
                    )}
                </div>
                {packages != null ? (
                    packages.map((pack, i) => {
                        return (
                            <div className="w-full sm:w-[30%]" key={i}>
                                <OfferCard
                                    packageName={pack.packageName}
                                    packagePrice={pack.packagePrice}
                                    packageDescription={pack.packageDescription}
                                    packageExpiry={pack.packageExpiry}
                                    handleBuy={() => handleBuy(pack)}
                                />
                            </div>
                        );
                    })
                ) : (
                    <Spinner className="block mx-auto mt-4" size="xl" />
                )}
            </div>
            <ModalConfirm
                showModal={showModal}
                setShowModal={setShowModal}
                title={`To use the Create Blog feature, users must comply with these key terms:
- Account Eligibility: Must have a valid registered account.
- Content Ownership: Must own or have rights to all published content.
- Prohibited Content: No posting of unlawful or offensive content.
- No Spam Policy: No spamming or redundant messages.
- Intellectual Property: Must not violate intellectual property rights.
- User Conduct: Maintain professionalism and respect within the community.
- Fact-Checking: Ensure accuracy of any stated facts or claims.
- Platform Rights: We reserve the right to remove content, or suspend or terminate access for violations.
- Liability: The platform isn't liable for damages from using the Create Blog feature.

Usage of the Create Blog function signifies agreement to these condensed terms and the platform's Terms of Service.`}
                onConfirm={handlePay}
                onNoConfirm={() => {
                    setShowModal(false);
                    dispatch(removeSelectedPackage());
                }}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
        </div>
    );
}

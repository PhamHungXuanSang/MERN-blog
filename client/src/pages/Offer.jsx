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
            const res = await fetch('/api/package/get-all-packages', {
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

    // Lấy về thông tin về transaction của người dùng
    useEffect(() => {
        handleCheckFreeTrial();
        handleGetAllPackage();
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
                // Gửi thông báo bằng toast và gửi email bằng node mailer đến người dùng
                dispatch(successfullyPurchase(data));
                toast.success('You have successfully purchased the package');
                return navigate('/dash-board?tab=create-blog');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePay = () => {
        setShowModal(false);
        dispatch(setSelectedPackage(choosePlan));
        return navigate('/checkout');
        // Điều hướng qua trang checkout
        // Gọi api thanh toán
    };

    const handleBuy = (pack) => {
        dispatch(removeSelectedPackage());
        setShowModal(true);
        setChoosePlan(pack);
    };

    return (
        <section className="container mx-auto min-h-screen h-fit py-12">
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
                title={`To use the Create Blog functionality on our platform, users must agree to abide by the following terms:
- Account Eligibility: User must have a registered account in good standing on our platform to access the Create Blog feature.
- Content Ownership: User asserts that they have ownership or the necessary licenses, rights, consents, and permissions to all content published.
- Prohibited Content: User agrees not to post content that is unlawful, threatening, abusive, libelous, defamatory, obscene, vulgar, pornographic, profane, or indecent.
- No Spam Policy: User agrees not to publish redundant messages or spam in their blog posts.
- Intellectual Property: User agrees not to infringe upon any intellectual property rights, including copyright, trademark, patents, or trade secrets.
- User Conduct: User agrees to conduct themselves in a professional and respectful manner when interacting with other community members in the blog section.
- Fact-Checking: User agrees to ensure that any facts or statements made in blog posts are accurate and provide sources where applicable.
- Commercial Activity: Any commercial activity such as advertising or promoting products and services must be approved in advance by our platform administrators.
- Platform Rights: The platform reserves the right to remove any content that violates these terms and to suspend or terminate the user’s access to the Create Blog functionality.
- Changes to Terms: The platform reserves the right to make changes to these terms at any time without prior notice to users.
- Liability Limitation: The platform is not liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the user's use of the Create Blog function.
By using the Create Blog function, users confirm their agreement to these terms and the overall Terms of Service of the platform.`}
                onConfirm={handlePay}
                onNoConfirm={() => {
                    setShowModal(false);
                    dispatch(removeSelectedPackage());
                }}
                confirm="Yes I am sure"
                noConfirm="No, I'm not sure"
            />
        </section>
    );
}

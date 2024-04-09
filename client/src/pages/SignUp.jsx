import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from 'react-icons/hi';
import { FaTimes, FaCheck } from 'react-icons/fa';
import OAuth from '../components/OAuth';
import MoveFromTopEffect from '../components/MoveFromTopEffect';
import toast from 'react-hot-toast';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [arrValid, setArrValid] = useState([false, false, false, false, false]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmitSignUp = async (e) => {
        e.preventDefault(); // Ngừng hành động tải lại trang khi nhấn submit
        // Kiểm tra nếu tất cả điều kiện password chưa thỏa thì không sign up được
        if (arrValid.some((item) => item == false)) {
            setError('Please enter a password that meets the requirements');
            return;
        }
        setError(null);
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please enter all fields');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password minimum 6 characters');
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            setError('Password confirm not match');
            return;
        }
        try {
            setLoading(true);
            const res = await fetch('api/auth/signup', {
                // Cần cấu hình proxy trong vite
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }
            if (res.ok) {
                toast('Sign up success.\nPlease log in to gmail to verify your email.', {
                    duration: 6000,
                });
                return navigate('/sign-in');
            }
        } catch (err) {
            setLoading(false);
            setError('Something went wrong please try again');
            return;
        }
    };

    let validationRegex = [
        { regex: /.{6,}/ },
        { regex: /[0-9]/ },
        { regex: /[a-z]/ },
        { regex: /[A-Z]/ },
        { regex: /[^A-Za-z0-9]/ },
    ];

    return (
        <div className="min-h-screen mt-20">
            <div className="flex flex-col md:flex-row p-3 max-w-3xl mx-auto md-items-center">
                {/*Left */}
                <div className="flex-1 sm:pr-8">
                    <Link to="/" className="font-bold sm:text-xl dark:text-white">
                        <span className="text-xl md:text-3xl px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                            MERN Blog
                        </span>
                    </Link>
                    <i className="text-sm sm:text-base lg:text-lg mt-5 sm:mt-10 block text-gray-500">
                        Welcome to the blog website - a place to share passion and knowledge. Explore the creative
                        community, read unique articles, and engage in diverse, informative conversations.
                    </i>
                </div>
                {/*Right */}
                <div className="flex-1">
                    <MoveFromTopEffect>
                        <i className="text-2xl lg:text-5xl text-center block text-gray-500">Join us now!</i>
                    </MoveFromTopEffect>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmitSignUp}>
                        <div>
                            <Label value="Your username" />
                            <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
                        </div>
                        <div>
                            <Label value="Your email" />
                            <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} />
                        </div>
                        <div className="relative">
                            <Label value="Your password" />
                            <TextInput
                                type="password"
                                placeholder="Password"
                                id="password"
                                onChange={handleChange}
                                onFocus={() => setShowPasswordValidation(true)}
                                onBlur={() => setShowPasswordValidation(false)}
                                onKeyUp={(e) => {
                                    const newValidityArray = validationRegex.map((item) =>
                                        item.regex.test(e.target.value),
                                    );
                                    setArrValid(newValidityArray);
                                }}
                            />
                            <div
                                className={`transition-opacity duration-300 transform ${
                                    showPasswordValidation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-96'
                                } password-checklist absolute top-20 w-full z-10 w-fit py-2 px-4 dark:bg-slate-500 bg-slate-100 rounded-3xl`}
                            >
                                <i className="checklist-title text-lg">Password should be</i>
                                <ul className="checklist list-none ml-2">
                                    <li
                                        className={`flex items-center gap-2${arrValid[0] ? ' opacity-100' : ' opacity-50'}`}
                                    >
                                        {arrValid[0] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                        <p>At least 6 characters long</p>
                                    </li>
                                    <li
                                        className={`flex items-center gap-2${arrValid[1] ? ' opacity-100' : ' opacity-50'}`}
                                    >
                                        {arrValid[1] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                        <p>At least 1 number</p>
                                    </li>
                                    <li
                                        className={`flex items-center gap-2${arrValid[2] ? ' opacity-100' : ' opacity-50'}`}
                                    >
                                        {arrValid[2] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                        <p>At least 1 lowercase letter</p>
                                    </li>
                                    <li
                                        className={`flex items-center gap-2${arrValid[3] ? ' opacity-100' : ' opacity-50'}`}
                                    >
                                        {arrValid[3] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                        <p>At least 1 uppercase letter</p>
                                    </li>
                                    <li
                                        className={`flex items-center gap-2${arrValid[4] ? ' opacity-100' : ' opacity-50'}`}
                                    >
                                        {arrValid[4] ? <FaCheck fill="green" /> : <FaTimes fill="red" />}
                                        <p>At least 1 special characters</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <Label value="Password confirm" />
                            <TextInput
                                type="password"
                                placeholder="Password confirm"
                                id="passwordConfirm"
                                onChange={handleChange}
                            />
                        </div>
                        <Button gradientDuoTone="greenToBlue" type="submit">
                            {loading ? (
                                <>
                                    <Spinner aria-label="Spinner button example" size="sm" />
                                    <span className="ml-3">Loading ...</span>
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                        {error && (
                            <Alert className="mt-1" color="failure" icon={HiInformationCircle}>
                                {error}
                            </Alert>
                        )}
                        <hr />
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>You have an account?</span>
                        <Link to="/sign-in" className="text-blue-500">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from 'react-icons/hi';
import OAuth from '../components/OAuth';
import MoveFromTopEffect from '../components/MoveFromTopEffect';
import toast from 'react-hot-toast';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmitSignUp = async (e) => {
        e.preventDefault(); // Ngừng hành động tải lại trang khi nhấn submit
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
                        <div>
                            <Label value="Your password" />
                            <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
                        </div>
                        {/* <div className="mb-6">
                            <button
                                data-popover-target="popover-default"
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Default popover
                            </button>

                            <div
                                data-popover
                                id="popover-default"
                                role="tooltip"
                                className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                            >
                                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Popover title</h3>
                                </div>
                                <div className="px-3 py-2">
                                    <p>Right?</p>
                                </div>
                                <div data-popper-arrow></div>
                            </div>
                        </div> */}
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

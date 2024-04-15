import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from 'react-icons/hi';
import { useRef, useState } from 'react';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';
import MoveFromTopEffect from '../components/MoveFromTopEffect.jsx';
import { socket } from '../utils/socket.js';

import ReCAPTCHA from 'react-google-recaptcha';

export default function SignIn() {
    let [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const { darkMode } = useSelector((state) => state.darkMode);
    const reRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmitSignIn = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || formData.email === '' || formData.password === '') {
            dispatch(signInFailure('Please enter all fields'));
            return;
        }

        try {
            dispatch(signInStart());

            const token = await reRef.current.getValue();
            reRef.current.reset();
            formData = { ...formData, token };

            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }
            if (res.ok) {
                socket.emit('newUserLogin', data._id);
                dispatch(signInSuccess(data));
                return navigate('/');
            } else {
                dispatch(signInFailure(data.message));
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
            return;
        }
    };

    return (
        <div className="min-h-screen mt-4">
            <div className="flex flex-col md:flex-row p-3 max-w-3xl mx-auto md:items-center">
                {/*Left */}
                <div className="flex-1 sm:pr-8">
                    <MoveFromTopEffect>
                        <Link to="/" className="font-bold sm:text-xl dark:text-white">
                            <span className="text-xl md:text-3xl px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                                MERN Blog
                            </span>
                        </Link>
                        <i className="text-sm sm:text-base lg:text-lg mt-5 sm:mt-10 block text-gray-500">
                            Welcome to the blog website - a place to share passion and knowledge. Explore the creative
                            community, read unique articles, and engage in diverse, informative conversations.
                        </i>
                    </MoveFromTopEffect>
                </div>
                {/*Right */}
                <div className="flex-1">
                    <MoveFromTopEffect>
                        <i className="text-2xl lg:text-5xl text-center block text-gray-500">Welcome back!</i>
                    </MoveFromTopEffect>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmitSignIn}>
                        <div>
                            <Label value="Your email" />
                            <TextInput type="email" placeholder="Enter email" id="email" onChange={handleChange} />
                        </div>
                        <div>
                            <Label value="Your password" />
                            <TextInput
                                type="password"
                                placeholder="Enter Password"
                                id="password"
                                onChange={handleChange}
                            />
                        </div>
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_REACT_GG_RECAPTCHA_SITE_KEY}
                            ref={reRef}
                            theme={darkMode}
                        />
                        <Button gradientDuoTone="greenToBlue" type="submit">
                            {loading ? (
                                <>
                                    <Spinner aria-label="Spinner button example" size="sm" />
                                    <span className="ml-3">Loading ...</span>
                                </>
                            ) : (
                                'Sign In'
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
                        <span>Do not have an account?</span>
                        <Link to="/sign-up" className="text-blue-500">
                            Sign up
                        </Link>
                    </div>
                    {/* Quên mật khẩu */}
                    <div className="mt-5">
                        <span>Forgot your password? </span>
                        <Link
                            to="/forgot-password"
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        >
                            Reset password
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

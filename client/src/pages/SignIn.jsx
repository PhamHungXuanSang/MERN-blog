import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from 'react-icons/hi';
import { useState } from 'react';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';
import MoveFromTopEffect from '../components/MoveFromTopEffect.jsx';

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);

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
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
            return;
        }
    };

    return (
        <div className="min-h-screen mt-20">
            <div className="flex flex-col md:flex-row p-3 max-w-3xl mx-auto md-items-center">
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
                            <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} />
                        </div>
                        <div>
                            <Label value="Your password" />
                            <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
                        </div>
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
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Do not have an account?</span>
                        <Link to="/sign-up" className="text-blue-500">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

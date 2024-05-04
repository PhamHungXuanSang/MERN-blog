/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import toast, { Toaster } from 'react-hot-toast';
import Search from './pages/Search';
import PageNotFound from './pages/PageNotFound';
import UserProfile from './pages/UserProfile';
import ReadBlog from './pages/ReadBlog';
import Editor from './pages/Editor';
import ScrollToTop from './components/ScrollToTop.jsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Offer from './pages/Offer.jsx';
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx';
import Admin from './pages/Admin.jsx';
import Checkout from './pages/Checkout.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Notification from './pages/Notification.jsx';
import { setCurrentUser, signOutSuccess } from './redux/user/userSlice.js';
import { io } from 'socket.io-client';
import ChangePassword from './pages/ChangePassword.jsx';
import ScheduleEditor from './pages/ScheduleEditor.jsx';
import Introduction from './pages/Introduction.jsx';
import Contact from './pages/Contact.jsx';
import AllUser from './pages/AllUser.jsx';
import CancelledTransaction from './pages/CancelledTransaction.jsx';
import SuccessfulTransaction from './pages/SuccessfulTransaction.jsx';
export const socket = io('http://localhost:3000');

export default function App() {
    const initialOptions = {
        'client-id': import.meta.env.VITE_REACT_APP_PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
    };
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    let { system, like, comment, reply, rate, subscriber, newBlog } = useSelector((state) => state.notiSetting);
    let filterStateMapping = {
        'new blog': newBlog,
        system: system,
        like: like,
        comment: comment,
        reply: reply,
        subscriber: subscriber,
        rate: rate,
    };

    useEffect(() => {
        if (currentUser) {
            //setInterval(() => {
            socket.emit('refreshBrower', currentUser._id);
            //}, [15000]);
            socket.on('newNotification', (data) => {
                dispatch(setCurrentUser({ ...currentUser, newNotification: true }));
                let { userAvatar, thumb, title, message, type } = data;
                if (filterStateMapping[type]) {
                    toast.custom(
                        (t) => (
                            <div
                                className={`${
                                    t.visible ? 'animate-enter' : 'animate-leave'
                                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                            >
                                <div className="flex-1 w-0 p-4">
                                    <div className="flex items-start">
                                        {userAvatar != null && (
                                            <div className="flex-shrink-0 pt-0.5">
                                                <img className="h-10 w-10 rounded-full" src={userAvatar} alt="img" />
                                            </div>
                                        )}
                                        {thumb != null && (
                                            <div className="flex-shrink-0 pt-0.5">
                                                <img className="h-10 w-10" src={thumb} alt="img" />
                                            </div>
                                        )}
                                        <div className="ml-3 flex-1">
                                            {title != null && (
                                                <p className="text-sm font-medium text-gray-900">{title}</p>
                                            )}
                                            {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex border-l border-gray-200">
                                    <button
                                        onClick={() => {
                                            toast.dismiss(t.id);
                                        }}
                                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ),
                        {
                            duration: 6000,
                        },
                    );
                }
            });
            socket.on('forcedLogout', () => {
                dispatch(signOutSuccess());
                return toast.error('Your account has been blocked', { duration: 6000 });
            });
        }
    }, []);

    return (
        <PayPalScriptProvider options={initialOptions}>
            <BrowserRouter>
                <ScrollToTop />
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/search/:query" element={<Search />} />
                    <Route path="/user/:username" element={<UserProfile />} />
                    <Route path="/blog/:slug" element={<ReadBlog />} />
                    <Route element={<PrivateRoute />}>
                        <Route
                            path="/notification"
                            element={<Notification filterStateMapping={filterStateMapping} />}
                        />
                        <Route path="/dash-board" element={<Dashboard />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/editor/:slug" element={<Editor />} />
                        <Route path="/schedule-editor/:slug" element={<ScheduleEditor />} />
                        <Route path="/offer" element={<Offer />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-status-cancel" element={<CancelledTransaction />} />
                        <Route path="/order-status-success" element={<SuccessfulTransaction />} />
                    </Route>
                    <Route element={<AdminPrivateRoute />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/introduction-page" element={<Introduction />} />
                    <Route path="/contact-us-page" element={<Contact />} />
                    <Route path="/all-user" element={<AllUser />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                <Footer />
                <Toaster position="top-center" />
            </BrowserRouter>
        </PayPalScriptProvider>
    );
}

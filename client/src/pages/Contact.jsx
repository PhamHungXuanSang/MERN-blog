import { Button, TextInput, Textarea } from 'flowbite-react';
import { useState } from 'react';
import MoveFromTopEffect from '../components/MoveFromTopEffect';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/email/send-contact-us-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formData }),
            });
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    message: '',
                });
                return toast.success(data.message);
            } else {
                return toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-wrap items-center mx-3 overflow-hidden dark:bg-slate-800 rounded-3xl">
                {/* Left side */}
                <div className="flex-1 sm:px-8">
                    <MoveFromTopEffect>
                        <Link to="/" className="font-bold sm:text-xl dark:text-white">
                            <span className="text-xl md:text-3xl px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                                MERN Blog
                            </span>
                        </Link>
                        <i className="text-sm sm:text-base lg:text-lg mt-5 sm:mt-10 block text-gray-500">
                            We, the team operating the MERN blog website, are ready to assist you with any issues you
                            may have regarding the use of our platform.
                        </i>
                        <i className="text-sm sm:text-base lg:text-lg sm:mt-4 block text-gray-500">
                            Please ask and we will respond to you as soon as possible.
                        </i>
                    </MoveFromTopEffect>
                </div>

                {/* Right side */}
                <div className="w-full md:w-1/2 px-3 mb-6">
                    <div className="p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2" htmlFor="name">
                                    FullName
                                </label>
                                <TextInput
                                    id="name"
                                    type="text"
                                    placeholder="User A"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <label className="block text-sm font-bold mb-2" htmlFor="phoneRegion">
                                Phone Number
                            </label>
                            <TextInput
                                id="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="0123456789"
                                name="phoneNumber"
                                className="placeholder:text-gray-500 text-teal-500"
                            />

                            <div className="my-6">
                                <label className="block text-sm font-bold mb-2">Message</label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    type="text"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help you"
                                    rows={3}
                                    className="mt-2 w-full border-2 border-gray-100 placeholder:text-gray-300 text-teal-500 rounded-md"
                                ></Textarea>
                            </div>

                            <Button type="submit" gradientDuoTone={'greenToBlue'} className="w-full">
                                Send email
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

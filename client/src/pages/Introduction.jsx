import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BackToTopButton from '../components/BackToTopButton';

const features = [
    {
        title: 'Premium Blogging',
        description: 'Unlock the full potential of blogging with our premium packages.',
        icon: '👑',
    },
    {
        title: 'AI Image Generation',
        description: 'Create stunning images for your blog posts with our AI generator.',
        icon: '🎨',
    },
    {
        title: 'Social Integration',
        description: 'Share your stories easily on social media and grow your audience.',
        icon: '🔗',
    },
    {
        title: 'Custom Profiles',
        description: 'Personalize your profile to tell your story your way.',
        icon: '🙆‍♂️',
    },
];

export default function Introduction() {
    const darkModeObj = useSelector((state) => state.darkMode);
    const darkModeClass = darkModeObj.darkMode === 'dark' ? 'dark' : '';

    return (
        <div className={`${darkModeClass} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100`}>
            <div className="container mx-auto px-6 py-10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl text-center font-bold mb-10">Our History</h2>
                    <div className="space-y-6">
                        <div className="timeline-container hover:scale-105 duration-200 hover:cursor-pointer">
                            <div className="timeline-pointer" aria-hidden="true"></div>
                            <div className="bg-white dark:bg-gray-700 rounded-lg px-6 py-4 shadow-md">
                                <span className="text-lg font-semibold">1. Founded [2020]</span>
                                <i className="block mt-1">
                                    The journey started when a group of passionate writers decided to create a platform
                                    to share their thoughts and stories.
                                </i>
                            </div>
                        </div>
                        <div className="timeline-container hover:scale-105 duration-200 hover:cursor-pointer">
                            <div className="timeline-pointer" aria-hidden="true"></div>
                            <div className="bg-white dark:bg-gray-700 rounded-lg px-6 py-4 shadow-md">
                                <span className="text-lg font-semibold">2. First Milestone [2021]</span>
                                <i className="block mt-1">
                                    Achieved a significant readership with engaging content and started to gain a loyal
                                    community.
                                </i>
                            </div>
                        </div>
                        <div className="timeline-container hover:scale-105 duration-200 hover:cursor-pointer">
                            <div className="timeline-pointer" aria-hidden="true"></div>
                            <div className="bg-white dark:bg-gray-700 rounded-lg px-6 py-4 shadow-md">
                                <span className="text-lg font-semibold">3. Expansion [2022]</span>
                                <i className="block mt-1">
                                    Expanded our team and included diverse categories to cater to a wider audience.
                                </i>
                            </div>
                        </div>
                        <div className="timeline-container hover:scale-105 duration-200 hover:cursor-pointer">
                            <div className="timeline-pointer" aria-hidden="true"></div>
                            <div className="bg-white dark:bg-gray-700 rounded-lg px-6 py-4 shadow-md">
                                <span className="text-lg font-semibold">4. Advanced Functionality [2023]</span>
                                <i className="block mt-1">
                                    Develop advanced functionality to create a great user experience.
                                </i>
                            </div>
                        </div>
                        <div className="timeline-container hover:scale-105 duration-200 hover:cursor-pointer">
                            <div className="timeline-pointer" aria-hidden="true"></div>
                            <div className="bg-white dark:bg-gray-700 rounded-lg px-6 py-4 shadow-md">
                                <span className="text-lg font-semibold">5. Operating On Website [2024]</span>
                                <i className="block mt-1">Successfully operating on website with thousands of users.</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center h-96 bg-fixed bg-[url('/aboutUsBackgroundImage.jpg')] bg-cover">
                <h1 className="text-5xl text-black uppercase font-extrabold bg-orange-500">
                    Please explore our website
                </h1>
            </div>
            <div className="container mx-auto px-6 py-10">
                <h2 className="text-4xl text-center font-bold mb-10">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileInView={{ opacity: [0, 1], translateY: [100, 0] }}
                            transition={{ duration: 0.8 }}
                            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
                        >
                            <div className="hover:scale-110 hover:cursor-pointer duration-300">
                                <div className="text-6xl">{feature.icon}</div>
                                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                                <p className="mt-2">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="container mx-auto px-6 py-10">
                <div className="bg-blue-500 text-white text-center p-5 rounded-lg shadow-md dark:bg-blue-600">
                    <h3 className="text-2xl font-bold">Exclusive Membership</h3>
                    <p className="my-2">Get unlimited access to all articles and premium customer support.</p>
                    <Link
                        to={'/offer'}
                        className="mt-3 px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 ease-in-out"
                    >
                        Subscribe Now
                    </Link>
                </div>
            </div>
            <footer className="text-center p-10 mt-10 border-t border-gray-200 dark:border-gray-700">
                <p>Made with love by the Blog Team</p>
            </footer>
            <BackToTopButton />
        </div>
    );
}

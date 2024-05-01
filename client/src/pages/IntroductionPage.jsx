import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

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

const IntroductionPage = () => {
    const darkModeObj = useSelector((state) => state.darkMode);
    const darkModeClass = darkModeObj.darkMode === 'dark' ? 'dark' : '';

    return (
        <div className={`${darkModeClass} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100`}>
            <section className="container mx-auto px-6 py-10">
                <h2 className="text-4xl text-center font-bold mb-10">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileInView={{ opacity: [0, 1], translateY: [50, 0] }}
                            transition={{ duration: 0.5 }}
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
            </section>
            <div className="container mx-auto px-6 py-10">
                <div className="bg-blue-500 text-white text-center p-5 rounded-lg shadow-md dark:bg-blue-600">
                    <h3 className="text-2xl font-bold">Exclusive Membership</h3>
                    <p className="my-2">Get unlimited access to all articles and premium customer support.</p>
                    <button className="mt-3 px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 ease-in-out">
                        Subscribe Now
                    </button>
                </div>
            </div>
            <footer className="text-center p-10 mt-10 border-t border-gray-200 dark:border-gray-700">
                <p>Made with love by the Blog Team</p>
            </footer>
        </div>
    );
};

export default IntroductionPage;

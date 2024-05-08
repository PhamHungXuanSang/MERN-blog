import { useEffect, useState } from 'react';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

export default function BackToTopButton() {
    const [backToTop, setBackToTop] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                setBackToTop(true);
            } else {
                setBackToTop(false);
            }
        });
    }, []);

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {backToTop && (
                <button
                    onClick={scrollUp}
                    className="fixed flex justify-center items-center bottom-12 right-12 text-2xl p-3 dark:bg-slate-600 bg-slate-100 rounded-full z-50"
                >
                    <FaRegArrowAltCircleUp size={24} />
                </button>
            )}
        </>
    );
}

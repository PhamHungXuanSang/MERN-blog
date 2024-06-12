import { memo, useEffect, useState } from 'react';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

function BackToTopButton() {
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
                    className="fixed flex justify-center items-center bottom-14 right-2 md:bottom-28 md:right-12 text-2xl md:p-3 p-2 dark:bg-slate-600 bg-slate-100 rounded-full z-40 opacity-30 hover:opacity-90"
                >
                    <FaRegArrowAltCircleUp size={24} />
                </button>
            )}
        </>
    );
}

export default memo(BackToTopButton);

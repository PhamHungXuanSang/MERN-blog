import { useEffect, useState } from 'react';

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
                    className="fixed bottom-12 right-12 h-12 w-12 text-2xl p-4 dark:bg-slate-800 bg-slate-100 rounded-full"
                >
                    ^
                </button>
            )}
        </>
    );
}

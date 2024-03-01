import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MoveFromTopEffect({ children }) {
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsRevealed(true), 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: isRevealed ? 0 : -100, opacity: isRevealed ? 1 : 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="text-xl font-bold text-gray-500"
        >
            {children}
        </motion.div>
    );
}

import { motion } from 'framer-motion';

export default function OneByOneAppearFromRightEffect({ transition, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition}
            // className="flex-grow"
        >
            {children}
        </motion.div>
    );
}

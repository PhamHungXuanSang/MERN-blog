import { motion } from 'framer-motion';

export default function OneByOneAppearEffect({ transition, children }) {
    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            {children}
        </motion.div>
    );
}

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

type AnimatedDivProps = HTMLMotionProps<'div'>;

export const AnimatedDiv: React.FC<AnimatedDivProps> = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

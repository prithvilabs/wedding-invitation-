import React from 'react';
import { motion } from 'framer-motion';
import { scrollSectionVariants } from './variants';

export default function AnimatedSection({ children, className = '', id = '', delay = 0 }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: delay
          }
        }
      }}
    >
      {children}
    </motion.section>
  );
}

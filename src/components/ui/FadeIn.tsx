'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '',
  style = {}
}: { 
  children: ReactNode, 
  delay?: number, 
  direction?: 'up' | 'down' | 'left' | 'right' | 'none', 
  className?: string,
  style?: React.CSSProperties
}) {
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', ...directions[direction] }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}


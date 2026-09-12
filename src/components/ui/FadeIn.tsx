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

  // Sempre renderiza a mesma árvore (motion.div) no servidor e no cliente:
  // ramificar em prefers-reduced-motion aqui causava um mismatch de hidratação
  // que o React não corrige (o conteúdo ficava preso em opacity:0 pra sempre).
  // O respeito ao reduced-motion é feito via CSS global (data-fade-in em globals.css),
  // que roda fora do ciclo de hidratação do React.
  // Anima só opacity/transform (propriedades compositadas pela GPU) — animar `filter`
  // força repaint na thread principal a cada frame, reprovado pelo Lighthouse como
  // "animação não composta" nas várias instâncias de FadeIn da página.
  return (
    <motion.div
      data-fade-in
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}


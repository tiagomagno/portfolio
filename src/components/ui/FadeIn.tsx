'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.55,
  className = '',
  style = {}
}: {
  children: ReactNode,
  delay?: number,
  direction?: 'up' | 'down' | 'left' | 'right' | 'none',
  duration?: number,
  className?: string,
  style?: React.CSSProperties
}) {
  const offsets = {
    up: [0, 16],
    down: [0, -16],
    left: [16, 0],
    right: [-16, 0],
    none: [0, 0],
  } as const;
  const [offsetX, offsetY] = offsets[direction];

  // Sempre renderiza a mesma árvore (motion.div) no servidor e no cliente:
  // ramificar em prefers-reduced-motion aqui causava um mismatch de hidratação
  // que o React não corrige (o conteúdo ficava preso em opacity:0 pra sempre).
  // O respeito ao reduced-motion é feito via CSS global (data-fade-in em globals.css),
  // que roda fora do ciclo de hidratação do React.
  // Anima só opacity/transform (propriedades compositadas pela GPU) — animar `filter`
  // força repaint na thread principal a cada frame, reprovado pelo Lighthouse como
  // "animação não composta" nas várias instâncias de FadeIn da página.
  // O deslocamento é uma string `transform` (e não os atalhos x/y do Framer): os atalhos rodam
  // na thread principal e perdem quadros sob carga; a string `transform` é animada pelo
  // navegador (WAAPI). transitionEnd volta a `none` pra não deixar um translate(0,0) em repouso,
  // que criaria contexto de empilhamento e bloco de contenção pros filhos.
  return (
    <motion.div
      data-fade-in
      initial={{ opacity: 0, transform: `translate(${offsetX}px, ${offsetY}px)` }}
      whileInView={{ opacity: 1, transform: 'translate(0px, 0px)', transitionEnd: { transform: 'none' } }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}


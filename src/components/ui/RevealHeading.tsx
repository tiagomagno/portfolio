'use client';

import { motion } from 'framer-motion';
import { Children, type CSSProperties, type ReactNode } from 'react';

const EASE = [0.23, 1, 0.32, 1] as const;

/** Palavras que sobem de dentro de uma máscara, uma após a outra. Só anima transform (compositor).
 * `data-fade-in` faz o CSS global de reduced-motion (globals.css) mostrar o texto já no lugar final. */
export function RevealWords({ text, delay = 0, step = 0.05 }: { text: string; delay?: number; step?: number }) {
  let index = 0;
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.split(' ').filter(Boolean).map((word, wi) => {
            const d = delay + index++ * step;
            return (
              <span key={wi}>
                {wi > 0 && ' '}
                <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.16em', marginBottom: '-0.16em' }}>
                  <motion.span
                    data-fade-in
                    style={{ display: 'inline-block' }}
                    initial={{ transform: 'translateY(108%)' }}
                    whileInView={{ transform: 'translateY(0%)', transitionEnd: { transform: 'none' } }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.7, delay: d, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

/** Título de seção (h2) com revelação palavra por palavra. Acessível: o texto completo vai no aria-label. */
export default function RevealHeading({ children, style, delay = 0.1 }: { children: ReactNode; style?: CSSProperties; delay?: number }) {
  const text = Children.toArray(children).join('');
  return (
    <h2 style={style} aria-label={text.split('\n').join(' ')}>
      <span aria-hidden="true">
        <RevealWords text={text} delay={delay} />
      </span>
    </h2>
  );
}

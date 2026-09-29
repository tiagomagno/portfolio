'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Logo from './ui/Logo';

const SESSION_KEY = 'intro-splash-shown';

export default function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // A marcação de "já mostrado" só acontece ao final (não logo no início do efeito):
    // o React StrictMode do Next dev invoca este efeito duas vezes (mount → cleanup →
    // mount) de propósito, e marcar cedo demais faria a segunda invocação real abortar
    // achando que já tinha sido exibido, sem o usuário nunca ver a animação.
    if (sessionStorage.getItem(SESSION_KEY)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }

    setVisible(true);
    document.body.style.overflow = 'hidden';

    const exitTimer = setTimeout(() => setExiting(true), 1300);
    const doneTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 2000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Logo variant="wordmark" height={44} />
      </motion.div>
    </motion.div>
  );
}

'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

/** Vídeo de fundo decorativo: só toca enquanto está na tela e fica parado (no quadro de capa) para quem
 * pediu menos movimento. Evita decodificar 5 MB de vídeo fora da viewport. */
export default function AutoVideo({ src, poster, style, eager = false }: { src: string; poster?: string; style?: CSSProperties; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload={eager ? 'auto' : 'metadata'} aria-hidden="true" tabIndex={-1} style={style} />;
}

'use client';

import { useLang } from '@/context/LangContext';

export default function Hero() {
    const { t } = useLang();

    const scrollTo = (href: string) => {
        const target = document.querySelector(href);
        if (target) {
            const offset = (target as HTMLElement).offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    return (
        <section className="hero" id="home">
            <div className="container hero-container" style={{
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'space-between',
                gap: '2rem'
            }}>
                {/* Coluna 1: Texto à Esquerda */}
                <div className="hero-content" style={{
                    flex: '1 1 50%',
                    maxWidth: '600px',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingBottom: '80px' // Compensar pro texto ficar no meio optico considerando o scroll indicator
                }}>
                    <h1 className="hero-title" style={{ fontSize: '4rem' }}>
                        <span>{t('hero.title')}</span>
                    </h1>

                    <h2 className="hero-subtitle-role" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                        {t('hero.subtitle.role')}
                    </h2>

                    <p className="hero-description" style={{ margin: '0 0 2rem 0', fontSize: '1rem' }}>
                        {t('hero.subtitle')}
                    </p>

                    <div className="hero-buttons">
                        <a
                            href="#contact"
                            className="btn btn-primary btn-sm"
                            onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
                        >
                            {t('hero.cta.primary')}
                        </a>
                        <a
                            href="#process"
                            className="btn btn-outline btn-sm"
                            onClick={(e) => { e.preventDefault(); scrollTo('#process'); }}
                        >
                            {t('hero.cta.secondary')}
                        </a>
                    </div>
                </div>

                {/* Coluna 2: Imagem à Direita */}
                <div className="hero-image-wrapper" style={{
                    flex: '1 1 50%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end' // Encosta a imagem na base
                }}>
                    <img
                        src="/eu.jpg"
                        alt="Tiago Magno"
                        style={{
                            maxWidth: '100%',
                            height: 'calc(100vh - 80px)', // Ocupa exatamente do navbar até o fundo
                            objectFit: 'contain',
                            objectPosition: 'bottom right'
                        }}
                    />
                </div>

                <div className="scroll-indicator" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                    <div className="mouse-icon">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

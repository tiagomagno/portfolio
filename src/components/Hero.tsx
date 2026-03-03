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
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span>{t('hero.title')}</span>
                    </h1>

                    <h2 className="hero-subtitle-role">
                        {t('hero.subtitle.role')}
                    </h2>

                    <p className="hero-description">
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

                <div className="scroll-indicator">
                    <div className="mouse-icon">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

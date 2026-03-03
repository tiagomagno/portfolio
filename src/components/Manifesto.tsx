'use client';

import { useLang } from '@/context/LangContext';

export default function Manifesto() {
    const { t } = useLang();

    const scrollTo = (href: string) => {
        const target = document.querySelector(href);
        if (target) {
            const offset = (target as HTMLElement).offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    const text = t('manifesto.text');
    const parts = text.split(/(Design Estratégico|Experiência do Usuário|Strategic Design|User Experience)/g);

    return (
        <section className="section manifesto-section">
            <div className="container">
                <div className="manifesto-content">
                    <h3 className="manifesto-text">
                        {parts.map((part, i) =>
                            ['Design Estratégico', 'Experiência do Usuário', 'Strategic Design', 'User Experience'].includes(part) ? (
                                <span key={i} className="manifesto-highlight">{part}</span>
                            ) : (
                                <span key={i}>{part}</span>
                            )
                        )}
                    </h3>
                    <a
                        href="#contact"
                        className="cta-link-minimal"
                        onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
                    >
                        {t('manifesto.cta')} <span className="cta-arrow">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

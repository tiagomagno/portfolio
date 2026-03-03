'use client';

import { useRef } from 'react';
import { useLang } from '@/context/LangContext';
import { cases } from '@/lib/data';

export default function Cases() {
    const { t } = useLang();
    const trackRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'prev' | 'next') => {
        if (trackRef.current) {
            trackRef.current.scrollBy({ left: dir === 'next' ? 400 : -400, behavior: 'smooth' });
        }
    };

    return (
        <section className="section dark-section" id="cases">
            <div className="container">
                <div className="cases-header-flex">
                    <div className="cases-title-wrapper">
                        <span className="cases-label">{t('cases.label')}</span>
                        <h2 className="section-title cases-title">{t('cases.title')}</h2>
                    </div>
                    <div className="cases-nav">
                        <button
                            className="cases-nav-btn"
                            onClick={() => scroll('prev')}
                            aria-label="Anterior"
                        >
                            <span>←</span>
                        </button>
                        <button
                            className="cases-nav-btn"
                            onClick={() => scroll('next')}
                            aria-label="Próximo"
                        >
                            <span>→</span>
                        </button>
                    </div>
                </div>

                <div className="cases-carousel" ref={trackRef}>
                    {cases.map((c) => (
                        <div key={c.id} className="case-card">
                            <div className="case-image-placeholder">
                                <span>Poster Vertical</span>
                            </div>
                            <div className="case-info">
                                <h3 className="case-client">{c.client}</h3>
                                <p className="case-service">{c.service}</p>
                                <div className="case-tags">
                                    {c.tags.map((tag) => (
                                        <span key={tag} className="case-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

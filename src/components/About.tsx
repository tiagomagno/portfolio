'use client';

import { useLang } from '@/context/LangContext';

export default function About() {
    const { t } = useLang();

    return (
        <section className="section" id="about">
            <div className="container">
                {/* Part 1: Intro */}
                <div className="split-layout">
                    <div className="split-visual">
                        <h2 className="split-title">{t('about.title')}</h2>
                        <div className="about-badge-placeholder">
                            <div className="badge-circle">
                                <span>Digital Partner</span>
                            </div>
                        </div>
                    </div>
                    <div className="split-content">
                        <div className="text-block">
                            <p>{t('about.text1')}</p>
                            <p>{t('about.text2')}</p>
                        </div>
                    </div>
                </div>

                {/* Part 2: Stats */}
                <div className="split-layout" style={{ marginTop: '10rem' }}>
                    <div className="split-visual">
                        <h2 className="split-title">{t('stats.title')}</h2>
                        <p className="split-subtitle">{t('stats.subtitle')}</p>
                    </div>
                    <div className="split-content">
                        <div className="stats-grid-compact">
                            <div className="stat-item-compact">
                                <span className="stat-num">{t('stats.1.number')}</span>
                                <span className="stat-lbl">{t('stats.1.label')}</span>
                            </div>
                            <div className="stat-item-compact">
                                <span className="stat-num">{t('stats.2.number')}</span>
                                <span className="stat-lbl">{t('stats.2.label')}</span>
                            </div>
                            <div className="stat-item-compact">
                                <span className="stat-num">{t('stats.3.number')}</span>
                                <span className="stat-lbl">{t('stats.3.label')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

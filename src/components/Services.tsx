'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { services } from '@/lib/data';

export default function Services() {
    const { lang, t } = useLang();
    const [activeId, setActiveId] = useState('strategy');

    const active = services.find((s) => s.id === activeId)!;
    const tags = lang === 'pt-BR' ? active.tags : active.tagsEn;
    const description = lang === 'pt-BR' ? active.description : active.descriptionEn;

    return (
        <section className="section" id="process">
            <div className="container">
                <div className="services-header">
                    <div className="services-label-line"></div>
                    <span className="services-label-text">{t('services.label')}</span>
                    <h2 className="services-title">{t('services.title')}</h2>
                    <p className="services-subtitle">{t('services.subtitle')}</p>
                </div>

                <div className="services-tabs-layout">
                    {/* Tabs menu */}
                    <div className="services-menu">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                className={`service-tab${activeId === service.id ? ' active' : ''}`}
                                onClick={() => setActiveId(service.id)}
                            >
                                {lang === 'pt-BR' ? service.label : service.labelEn}
                            </button>
                        ))}
                    </div>

                    {/* Content panel */}
                    <div className="service-content-panel">
                        <div className="tags-container">
                            {tags.map((tag) => (
                                <span key={tag} className="pill">{tag}</span>
                            ))}
                        </div>
                        <p className="service-description">{description}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

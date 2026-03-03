'use client';

import { useLang } from '@/context/LangContext';

export default function Insights() {
    const { t } = useLang();

    return (
        <section className="section" id="insights">
            <div className="container">
                <h2 className="section-title">{t('insights.title')}</h2>
                <p className="section-subtitle">{t('insights.subtitle')}</p>
                <div className="insights-placeholder">
                    <p className="insights-soon">{t('insights.soon')}</p>
                </div>
            </div>
        </section>
    );
}

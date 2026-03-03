'use client';

import { useLang } from '@/context/LangContext';

const workIcons: Record<string, JSX.Element> = {
    monitor: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    ),
    layers: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    ),
    code: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    cart: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    ),
    users: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
};

const workItemKeys = ['work.item1', 'work.item2', 'work.item3', 'work.item4', 'work.item5'];
const workIconKeys = ['monitor', 'layers', 'code', 'cart', 'users'];

export default function Work() {
    const { t } = useLang();

    return (
        <section className="section dark-section" id="work">
            <div className="container">
                <h2 className="section-title">{t('work.title')}</h2>
                <p className="section-subtitle">{t('work.subtitle')}</p>
                <p className="work-intro">{t('work.intro')}</p>

                <div className="work-list">
                    {workItemKeys.map((key, i) => (
                        <div key={key} className="work-item">
                            <div className="work-icon">{workIcons[workIconKeys[i]]}</div>
                            <p>{t(key)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

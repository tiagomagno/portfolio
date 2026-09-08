'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, translations } from '@/lib/translations';

interface LangContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
    lang: 'pt-BR',
    setLang: () => { },
    t: (key) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>('pt-BR');
    const [overrides, setOverrides] = useState<Record<string, { pt: string; en: string }>>({});

    useEffect(() => {
        const saved = localStorage.getItem('preferredLanguage') as Lang;
        if (saved && translations[saved]) setLangState(saved);
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    // Textos sobrescritos em /admin/textos. Sem overrides (ou banco fora do ar),
    // o site usa translations.ts normalmente.
    useEffect(() => {
        fetch('/api/content')
            .then((r) => r.json())
            .then((data) => setOverrides(data.content ?? {}))
            .catch(() => {});
    }, []);

    const setLang = (newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem('preferredLanguage', newLang);
    };

    const t = (key: string): string => {
        const override = overrides[key];
        if (override) return lang === 'en-US' ? override.en : override.pt;
        const dict = translations[lang] as Record<string, string>;
        return dict[key] ?? key;
    };

    return (
        <LangContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LangContext.Provider>
    );
}

export const useLang = () => useContext(LangContext);

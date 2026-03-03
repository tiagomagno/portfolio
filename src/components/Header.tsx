'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

export default function Header() {
    const { lang, setLang, t } = useLang();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { href: '#about', key: 'nav.about' },
        { href: '#process', key: 'nav.process' },
        { href: '#work', key: 'nav.work' },
        { href: '#cases', key: 'nav.cases' },
        { href: '#insights', key: 'nav.insights' },
    ];

    const scrollTo = (href: string) => {
        const target = document.querySelector(href);
        if (target) {
            const offset = (target as HTMLElement).offsetTop - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
        setMenuOpen(false);
    };

    return (
        <header
            className={`header${scrolled ? ' scrolled' : ''}`}
            id="header"
        >
            <div className="container">
                <nav className="nav">
                    <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}>
                        Tiago<span>Magno</span>
                    </a>

                    <ul className={`nav-menu${menuOpen ? ' active' : ''}`}>
                        {navLinks.map((link) => (
                            <li key={link.key}>
                                <a
                                    href={link.href}
                                    className="nav-link"
                                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                                >
                                    {t(link.key)}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="header-actions">
                        <div className="language-switcher">
                            <button
                                className={`lang-btn${lang === 'pt-BR' ? ' active' : ''}`}
                                onClick={() => setLang('pt-BR')}
                            >
                                PT
                            </button>
                            <span className="lang-divider">|</span>
                            <button
                                className={`lang-btn${lang === 'en-US' ? ' active' : ''}`}
                                onClick={() => setLang('en-US')}
                            >
                                EN
                            </button>
                        </div>

                        <Link
                            href="/briefing"
                            className="nav-contact-btn"
                        >
                            <span>Briefing</span>
                            <span className="arrow">→</span>
                        </Link>
                    </div>

                    <button
                        className={`mobile-menu-toggle${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </div>
        </header>
    );
}

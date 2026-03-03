'use client';

import { useLang } from '@/context/LangContext';

export default function Footer() {
    const { t } = useLang();

    return (
        <footer className="footer-minimal">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <a href="#home">
                            Tiago<span>Magno</span>
                            <span className="footer-role">{t('footer.role')}</span>
                        </a>
                    </div>
                    <a href="#home" className="back-to-top">
                        {t('footer.totop')} <span>↑</span>
                    </a>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="copyright">{t('footer.copyright')}</div>
                    <div className="footer-links-row">
                        <a href="#insights">Insights</a>
                        <a href="#">Carreiras</a>
                        <a href="#">Política de Privacidade</a>
                        <a href="#">Código de ética</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

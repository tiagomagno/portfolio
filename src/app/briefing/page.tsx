import type { Metadata } from 'next';
import { BriefingForm } from '@/components/briefing/BriefingForm';

export const metadata: Metadata = {
    title: 'Briefing | Tiago Magno — UX Designer Sênior',
    description:
        'Compartilhe seu projeto comigo. Preencha o formulário de briefing e vamos conversar sobre como posso ajudar.',
};

export default function BriefingPage() {
    return (
        <div className="briefing-page">
            {/* Header mínimo */}
            <div className="briefing-page-header">
                <a href="/" className="logo">
                    Tiago<span>Magno</span>
                </a>
            </div>

            {/* Hero */}
            <section className="briefing-hero">
                <div className="container briefing-hero-inner">
                    <span className="briefing-badge">Briefing</span>
                    <h1 className="briefing-hero-title">
                        Conte-me sobre seu <span className="text-orange-500">projeto</span>
                    </h1>
                    <p className="briefing-hero-subtitle">
                        Preencha o formulário abaixo com as informações do seu projeto. Quanto mais detalhes,
                        melhor poderei entender como posso agregar valor.
                    </p>
                </div>
            </section>

            {/* Formulário */}
            <section className="briefing-form-section">
                <div className="container">
                    <div className="briefing-form-container">
                        <BriefingForm />
                    </div>
                </div>
            </section>
        </div>
    );
}

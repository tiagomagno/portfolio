'use client';

import { UseFormRegister, UseFormWatch, FieldError } from 'react-hook-form';
import { BriefingFormData, MAIN_CHALLENGES } from '@/lib/briefing';

const DYNAMIC_FEATURES: Record<(typeof MAIN_CHALLENGES)[number], Array<{ value: string; label: string }>> = {
  branding: [
    { value: 'novo-logo', label: 'Novo Logotipo' },
    { value: 'manual-marca', label: 'Manual da Marca' },
    { value: 'rebranding', label: 'Rebranding (Atualização da Marca)' },
    { value: 'papelaria', label: 'Papelaria e Materiais Gráficos' },
    { value: 'naming', label: 'Criação de Nome (Naming)' },
  ],
  website: [
    { value: 'site-institucional', label: 'Site Institucional' },
    { value: 'loja-virtual', label: 'Loja Virtual (E-commerce)' },
    { value: 'landing-page', label: 'Landing Page de Vendas' },
    { value: 'sistema-web', label: 'Sistema Web Sob Medida' },
    { value: 'agendamento', label: 'Agendamento Online' },
    { value: 'integracao-whatsapp', label: 'Integração com WhatsApp' },
    { value: 'area-cliente', label: 'Área do Cliente' },
  ],
  social: [
    { value: 'gestao-mensal', label: 'Gestão Completa (Mensal)' },
    { value: 'estrategia', label: 'Estratégia e Planejamento' },
    { value: 'criacao-conteudo', label: 'Criação de Conteúdo' },
    { value: 'design-posts', label: 'Design de Posts / Templates' },
  ],
  growth: [
    { value: 'trafego-google', label: 'Anúncios no Google (Google Ads)' },
    { value: 'trafego-meta', label: 'Anúncios no Face/Insta (Meta Ads)' },
    { value: 'automacao-leads', label: 'Automação de Leads (RD Station etc)' },
    { value: 'dashboards', label: 'Dashboards de BI' },
  ],
  uxui: [
    { value: 'pesquisa-usuarios', label: 'Pesquisa com Usuários (UX Research)' },
    { value: 'wireframes', label: 'Wireframes e Fluxos' },
    { value: 'design-system', label: 'Criação de Design System' },
    { value: 'testes-usabilidade', label: 'Testes de Usabilidade' },
  ],
  audiovisual: [
    { value: 'foto-institucional', label: 'Fotografia Institucional / Retratos' },
    { value: 'video-campanha', label: 'Vídeo para Campanhas' },
    { value: 'cobertura-evento', label: 'Cobertura de Evento' },
    { value: 'conteudo-redes', label: 'Conteúdo Rápido para Redes Sociais' },
  ],
};

interface Props {
  register: UseFormRegister<BriefingFormData>;
  watch: UseFormWatch<BriefingFormData>;
  error?: FieldError;
}

export function BriefingStep4({ register, watch, error }: Props) {
  const challenge = watch('mainChallenge');
  const selectedFeatures = watch('features') ?? [];
  const options = challenge ? DYNAMIC_FEATURES[challenge] : DYNAMIC_FEATURES.website;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <div>
        <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>
          Quais itens melhor descrevem o que você busca?
        </h3>
        <p style={{ fontSize: '14px', color: '#a8a29e', margin: 0 }}>
          Selecione todos que se aplicam.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {options.map((opt) => {
          const isSelected = selectedFeatures.includes(opt.value);
          return (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: isSelected ? 'rgba(255,86,37,0.08)' : '#131313',
                border: `1px solid ${isSelected ? '#ff5625' : '#2a2a2a'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: isSelected ? '#fff' : '#a8a29e',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="checkbox"
                value={opt.value}
                {...register('features')}
                style={{ width: '16px', height: '16px', flexShrink: 0, accentColor: '#ff5625', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
            </label>
          );
        })}
      </div>

      {error && (
        <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

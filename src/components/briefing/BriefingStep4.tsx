'use client';

import { UseFormRegister, UseFormWatch, FieldError } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { cn } from '@/lib/utils';
import { MAIN_CHALLENGES } from '@/lib/briefing';

const DYNAMIC_FEATURES: Record<(typeof MAIN_CHALLENGES)[number], Array<{value: string, label: string}>> = {
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
    { value: 'sistema-web', label: 'Sistema Web Submedida' },
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
    { value: 'tráfego-google', label: 'Anúncios no Google (Google Ads)' },
    { value: 'tráfego-meta', label: 'Anúncios no Face/Insta (Meta Ads)' },
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
  ]
};

interface Props {
  register: UseFormRegister<BriefingFormData>;
  watch: UseFormWatch<BriefingFormData>;
  error?: FieldError;
}

export function BriefingStep4({ register, watch, error }: Props) {
  const challenge = watch('mainChallenge');
  const selectedFeatures = watch('features') ?? [];

  // Se o usuário ainda não tiver selecionado um desafio, mostramos as opções de website como fallback ou nada.
  // Como as regras indicam, a pessoa deve ter passado do step 2 para cá.
  const options = challenge ? DYNAMIC_FEATURES[challenge] : DYNAMIC_FEATURES.website;

  return (
    <div className="flex flex-col gap-8 mt-4">
      <h3 className="text-xl md:text-2xl font-bold text-heading-light dark:text-heading-dark">
        Quais itens melhor descrevem o que você busca?
      </h3>
      <p className="text-text-light dark:text-text-dark text-sm">
        Selecione todos que se aplicam.
      </p>
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all',
              'border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark',
              'hover:border-primary/50 hover:shadow-sm',
              selectedFeatures.includes(opt.value) && 'border-primary ring-2 ring-primary/20'
            )}
          >
            <input
              type="checkbox"
              value={opt.value}
              {...register('features')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-heading-light dark:text-heading-dark font-medium">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

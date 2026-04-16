'use client';

import { UseFormRegister, FieldError, useFormContext } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';

const OPTIONS = [
  { value: 'branding', label: 'Criar / Modernizar minha Identidade Visual' },
  { value: 'website', label: 'Desenvolver um Novo Site, Loja ou Sistema' },
  { value: 'social', label: 'Profissionalizar minhas Redes Sociais' },
  { value: 'growth', label: 'Atrair mais Clientes e Aumentar Vendas com Anúncios' },
  { value: 'uxui', label: 'Melhorar a experiência / Design de um App ou Software' },
  { value: 'audiovisual', label: 'Realizar produção de Fotos ou Vídeos institucionais' },
];

interface Props {
  register: UseFormRegister<BriefingFormData>;
  error?: FieldError;
}

export function BriefingStep3({ register, error }: Props) {
  const { watch } = useFormContext<BriefingFormData>();
  const selected = watch('mainChallenge');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>
        Em qual área você precisa de mais ajuda hoje?
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
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
                type="radio"
                value={opt.value}
                {...register('mainChallenge')}
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

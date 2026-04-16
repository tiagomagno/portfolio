'use client';

import { UseFormRegister, FieldError, useFormContext } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';

const AUDIENCE_OPTIONS = [
  { value: 'pf', label: 'Pessoa Física (B2C)' },
  { value: 'pj', label: 'Empresas (B2B)' },
  { value: 'ambos', label: 'Ambos' },
];

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#a8a29e',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#131313',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#fff',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  resize: 'vertical',
  minHeight: '110px',
};

interface Props {
  register: UseFormRegister<BriefingFormData>;
  errors: {
    targetAudience?: FieldError;
    idealCustomer?: FieldError;
    differential?: FieldError;
  };
}

export function BriefingStep5({ register, errors }: Props) {
  const { watch } = useFormContext<BriefingFormData>();
  const selected = watch('targetAudience');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>
        Sobre o Seu Negócio
      </h3>

      {/* Target audience pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Quem é o seu público-alvo principal?</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {AUDIENCE_OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  background: isSelected ? 'rgba(255,86,37,0.08)' : '#131313',
                  border: `1px solid ${isSelected ? '#ff5625' : '#2a2a2a'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? '#ff5625' : '#a8a29e',
                  transition: 'all 0.15s',
                  textAlign: 'center',
                }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('targetAudience')}
                  style={{ display: 'none' }}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {errors.targetAudience && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {errors.targetAudience.message}
          </p>
        )}
      </div>

      {/* Ideal customer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="idealCustomer" style={labelStyle}>
          Como você descreve seu cliente ideal?
        </label>
        <textarea
          id="idealCustomer"
          {...register('idealCustomer')}
          placeholder="Ex: Clínicas médicas de médio porte, ou jovens de 20 a 30 anos que gostam de esportes..."
          style={textareaStyle}
        />
        {errors.idealCustomer && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {errors.idealCustomer.message}
          </p>
        )}
      </div>

      {/* Differential */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="differential" style={labelStyle}>
          O que torna sua empresa única? (Qual seu diferencial?)
        </label>
        <textarea
          id="differential"
          {...register('differential')}
          placeholder="Por que os clientes compram de você e não do concorrente?"
          style={textareaStyle}
        />
        {errors.differential && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {errors.differential.message}
          </p>
        )}
      </div>
    </div>
  );
}

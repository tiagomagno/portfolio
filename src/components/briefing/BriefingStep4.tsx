'use client';

import { UseFormRegister, FieldError, useFormContext } from 'react-hook-form';
import { BriefingFormData, PROJECT_GOAL_OPTIONS } from '@/lib/briefing';

interface Props {
  register: UseFormRegister<BriefingFormData>;
  error?: FieldError;
  descriptionError?: FieldError;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-text-muted)',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--color-bg-high)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: 'var(--color-text)',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  resize: 'vertical',
  minHeight: '110px',
};

export function BriefingStep4({ register, error, descriptionError }: Props) {
  const { watch } = useFormContext<BriefingFormData>();
  const selected = watch('projectGoal');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.2 }}>
        O que você espera desse projeto?
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PROJECT_GOAL_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: isSelected ? 'rgba(255,86,37,0.08)' : 'var(--color-bg-high)',
                border: `1px solid ${isSelected ? '#ff5625' : 'var(--color-border)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                value={opt.value}
                {...register('projectGoal')}
                style={{ width: '16px', height: '16px', flexShrink: 0, accentColor: '#ff5625', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
            </label>
          );
        })}
        {error && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {error.message}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="goalDescription" style={labelStyle}>
          Descreva em poucas palavras o objetivo principal
        </label>
        <textarea
          id="goalDescription"
          {...register('goalDescription')}
          placeholder="Ex: Reduzir a fricção no checkout, ou estruturar o design system antes de escalar o time."
          style={textareaStyle}
        />
        {descriptionError && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {descriptionError.message}
          </p>
        )}
      </div>
    </div>
  );
}

'use client';

import { UseFormRegister, FieldError, useFormContext } from 'react-hook-form';
import { BriefingFormData, BUDGET_RANGE_OPTIONS, ENGAGEMENT_FORMAT_OPTIONS } from '@/lib/briefing';

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-text-muted)',
};

const inputStyle: React.CSSProperties = {
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
  height: '46px',
};

interface Props {
  register: UseFormRegister<BriefingFormData>;
  errors: {
    deadline?: FieldError;
    engagementFormat?: FieldError;
  };
}

export function BriefingStep5({ register, errors }: Props) {
  const { watch } = useFormContext<BriefingFormData>();
  const selectedBudget = watch('budgetRange');
  const selectedFormat = watch('engagementFormat');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.2 }}>
        Prazo e formato de trabalho
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="deadline" style={labelStyle}>Prazo desejado</label>
        <input
          id="deadline"
          type="text"
          autoComplete="off"
          placeholder="Ex: 30 dias, próximo trimestre…"
          style={inputStyle}
          {...register('deadline')}
        />
        {errors.deadline && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {errors.deadline.message}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Formato de trabalho preferido</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ENGAGEMENT_FORMAT_OPTIONS.map((opt) => {
            const isSelected = selectedFormat === opt.value;
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
                  {...register('engagementFormat')}
                  style={{ width: '16px', height: '16px', flexShrink: 0, accentColor: '#ff5625', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
        {errors.engagementFormat && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {errors.engagementFormat.message}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>Faixa de investimento estimada (opcional)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {BUDGET_RANGE_OPTIONS.map((opt) => {
            const isSelected = selectedBudget === opt.value;
            return (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  background: isSelected ? 'rgba(255,86,37,0.08)' : 'var(--color-bg-high)',
                  border: `1px solid ${isSelected ? '#ff5625' : 'var(--color-border)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('budgetRange')}
                  style={{ width: '15px', height: '15px', flexShrink: 0, accentColor: '#ff5625', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

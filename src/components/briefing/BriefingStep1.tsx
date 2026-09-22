'use client';

import { UseFormRegister, FieldError, useFormContext } from 'react-hook-form';
import { BriefingFormData, COMPANY_STAGE_OPTIONS, TEAM_SIZE_OPTIONS } from '@/lib/briefing';
import { useLang } from '@/context/LangContext';

interface Props {
  register: UseFormRegister<BriefingFormData>;
  error?: FieldError;
  teamSizeError?: FieldError;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-text-muted)',
};

export function BriefingStep1({ register, error, teamSizeError }: Props) {
  const { t } = useLang();
  const { watch } = useFormContext<BriefingFormData>();
  const selectedStage = watch('companyStage');
  const selectedTeamSize = watch('teamSize');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.2 }}>
        {t('briefing.step1.title')}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>{t('briefing.step1.companyStageLabel')}</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {COMPANY_STAGE_OPTIONS.map((opt) => {
            const isSelected = selectedStage === opt.value;
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
                  {...register('companyStage')}
                  style={{ width: '16px', height: '16px', flexShrink: 0, accentColor: '#ff5625', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: isSelected ? 600 : 400 }}>{t(`briefing.options.companyStage.${opt.value}`)}</span>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>{t('briefing.step1.teamSizeLabel')}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {TEAM_SIZE_OPTIONS.map((opt) => {
            const isSelected = selectedTeamSize === opt.value;
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
                  {...register('teamSize')}
                  style={{ width: '15px', height: '15px', flexShrink: 0, accentColor: '#ff5625', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: isSelected ? 600 : 400 }}>{t(`briefing.options.teamSize.${opt.value}`)}</span>
              </label>
            );
          })}
        </div>
        {teamSizeError && (
          <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
            {teamSizeError.message}
          </p>
        )}
      </div>
    </div>
  );
}

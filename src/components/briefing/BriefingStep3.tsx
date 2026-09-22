'use client';

import { UseFormRegister, FieldError, useFormContext } from 'react-hook-form';
import { BriefingFormData, MAIN_CHALLENGE_OPTIONS } from '@/lib/briefing';
import { Input } from '@/components/ui/Input';
import { useLang } from '@/context/LangContext';

interface Props {
  register: UseFormRegister<BriefingFormData>;
  error?: FieldError;
  otherError?: FieldError;
}

export function BriefingStep3({ register, error, otherError }: Props) {
  const { t } = useLang();
  const { watch } = useFormContext<BriefingFormData>();
  const selected = watch('mainChallenge') ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <div>
        <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px', lineHeight: 1.2 }}>
          {t('briefing.step3.title')}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0 }}>
          {t('briefing.step3.subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {MAIN_CHALLENGE_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.value);
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
                type="checkbox"
                value={opt.value}
                {...register('mainChallenge')}
                style={{ width: '16px', height: '16px', flexShrink: 0, accentColor: '#ff5625', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: isSelected ? 600 : 400 }}>{t(`briefing.options.mainChallenge.${opt.value}`)}</span>
            </label>
          );
        })}
      </div>

      {selected.includes('outro') && (
        <Input
          {...register('mainChallengeOther')}
          label={t('briefing.step3.otherLabel')}
          placeholder={t('briefing.step3.otherPlaceholder')}
          required
          error={otherError?.message}
        />
      )}

      {error && (
        <p style={{ fontSize: '12px', color: '#ef4444' }} role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

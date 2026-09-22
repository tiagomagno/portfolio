'use client';

import React from 'react';
import {
  UseFormRegister,
  FieldErrors,
  useFormContext,
} from 'react-hook-form';
import { BriefingFormData, PREFERRED_CONTACT_OPTIONS } from '@/lib/briefing';
import { useLang } from '@/context/LangContext';

interface Props {
  register: UseFormRegister<BriefingFormData>;
  errors: FieldErrors<BriefingFormData>;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--color-text-muted)',
};

export function BriefingStep6({ register, errors }: Props) {
  const { t } = useLang();
  const { formState: { submitCount }, watch } = useFormContext<BriefingFormData>();
  const whatsappReg = register('whatsapp');
  const selectedContact = watch('preferredContact');

  // Campos que o usuário tocou manualmente neste step (via blur)
  const [blurred, setBlurred] = React.useState<Set<string>>(new Set());
  const markBlurred = (field: string) =>
    setBlurred((prev) => new Set(prev).add(field));

  // Só mostra erro se: o campo foi tocado neste step OU o usuário já clicou em "Enviar"
  const err = (field: keyof BriefingFormData): string | undefined => {
    if (!blurred.has(field) && submitCount === 0) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (errors[field] as any)?.message;
  };

  const borderFor = (field: keyof BriefingFormData): string =>
    err(field) ? '#ef4444' : 'var(--color-border)';

  const simpleFields = [
    { id: 'name' as const,  label: t('briefing.step6.nameLabel'),  placeholder: t('briefing.step6.namePlaceholder'),  type: 'text',  autoComplete: 'name',  reg: register('name') },
    { id: 'email' as const, label: t('briefing.step6.emailLabel'), placeholder: t('briefing.step6.emailPlaceholder'), type: 'email', autoComplete: 'email', reg: register('email') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.2 }}>
        {t('briefing.step6.title')}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {simpleFields.map(({ id, label, placeholder, type, autoComplete, reg }) => (
          <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor={id} style={labelStyle}>{label}</label>
            <input
              id={id}
              type={type}
              autoComplete={autoComplete}
              placeholder={placeholder}
              style={{ ...inputStyle, borderColor: borderFor(id) }}
              {...reg}
              onBlur={(e) => { markBlurred(id); reg.onBlur(e); }}
            />
            {err(id) && (
              <p style={{ fontSize: '12px', color: '#ef4444' }}>{err(id)}</p>
            )}
          </div>
        ))}

        {/* WhatsApp com máscara */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="whatsapp" style={labelStyle}>{t('briefing.step6.whatsappLabel')}</label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            style={{ ...inputStyle, borderColor: borderFor('whatsapp') }}
            {...whatsappReg}
            onChange={(e) => {
              const masked = maskPhone(e.target.value);
              e.target.value = masked;
              whatsappReg.onChange(e);
            }}
            onBlur={(e) => { markBlurred('whatsapp'); whatsappReg.onBlur(e); }}
          />
          {err('whatsapp') && (
            <p style={{ fontSize: '12px', color: '#ef4444' }}>{err('whatsapp')}</p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={labelStyle}>{t('briefing.step6.preferredContactLabel')}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {PREFERRED_CONTACT_OPTIONS.map((opt) => {
            const isSelected = selectedContact === opt.value;
            return (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  background: isSelected ? 'rgba(255,86,37,0.08)' : 'var(--color-bg-high)',
                  border: `1px solid ${isSelected ? '#ff5625' : 'var(--color-border)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? '#ff5625' : 'var(--color-text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('preferredContact')}
                  className="sr-only-input"
                />
                {t(`briefing.options.preferredContact.${opt.value}`)}
              </label>
            );
          })}
        </div>
        {err('preferredContact') && (
          <p style={{ fontSize: '12px', color: '#ef4444' }}>{err('preferredContact')}</p>
        )}
      </div>
    </div>
  );
}

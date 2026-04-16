'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  FieldError,
  useFormContext,
} from 'react-hook-form';
import { BriefingFormData, BUSINESS_SEGMENT_OPTIONS } from '@/lib/briefing';
import { Input } from '@/components/ui/Input';
import { ChevronDown, Check } from 'lucide-react';

interface Props {
  register: UseFormRegister<BriefingFormData>;
  watch: UseFormWatch<BriefingFormData>;
  error?: FieldError;
  otherError?: FieldError;
}

export function BriefingStep1({ register, watch, error, otherError }: Props) {
  const selectedSegment = watch('businessSegment');
  const { clearErrors, setValue } = useFormContext<BriefingFormData>();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSegment !== 'outro') {
      clearErrors('businessSegmentOther');
    }
  }, [selectedSegment, clearErrors]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const groups = useMemo(() => {
    const ordered: {
      title: string;
      options: (typeof BUSINESS_SEGMENT_OPTIONS)[number][];
    }[] = [];
    const indexByTitle = new Map<string, number>();
    for (const opt of BUSINESS_SEGMENT_OPTIONS) {
      const idx = indexByTitle.get(opt.group);
      if (idx === undefined) {
        indexByTitle.set(opt.group, ordered.length);
        ordered.push({ title: opt.group, options: [opt] });
      } else {
        ordered[idx].options.push(opt);
      }
    }
    return ordered;
  }, []);

  const selectedLabel = selectedSegment
    ? (BUSINESS_SEGMENT_OPTIONS.find((o) => o.value === selectedSegment)?.label ?? 'Selecione o segmento…')
    : null;

  return (
    <div className="mt-2 flex flex-col gap-5">
      <h3 className="text-xl md:text-2xl font-bold text-heading-light dark:text-heading-dark">
        Qual o segmento da sua empresa?
      </h3>

      <div className="flex flex-col gap-3">
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a8a29e' }}>
          Segmento
        </label>

        {/* Custom dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '12px 16px',
              background: '#1c1c1c',
              border: `1px solid ${error ? '#ef4444' : '#2e2e2e'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: '14px', color: selectedLabel ? '#fff' : '#5a5a5a' }}>
              {selectedLabel ?? 'Selecione o segmento…'}
            </span>
            <ChevronDown
              size={16}
              style={{
                flexShrink: 0,
                color: '#5a5a5a',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {open && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                zIndex: 100,
                background: '#1c1c1c',
                border: '1px solid #2e2e2e',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                maxHeight: '320px',
                overflowY: 'auto',
                padding: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#333 transparent',
              }}
            >
              {groups.map(({ title, options }, groupIndex) => (
                <div key={title} style={{ marginTop: groupIndex === 0 ? 0 : '4px' }}>
                  {/* Group header */}
                  {groupIndex > 0 && (
                    <div style={{ height: '1px', background: '#252525', margin: '8px 4px' }} />
                  )}
                  <div
                    style={{
                      padding: '8px 12px 4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: '#4a4a4a',
                    }}
                  >
                    {title}
                  </div>

                  {/* Options */}
                  {options.map((opt) => {
                    const isSelected = selectedSegment === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setValue('businessSegment', opt.value as any);
                          clearErrors('businessSegment');
                          setOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          textAlign: 'left',
                          background: isSelected ? 'rgba(255,86,37,0.12)' : 'transparent',
                          color: isSelected ? '#ff5625' : '#ccc',
                          fontWeight: isSelected ? 600 : 400,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background 0.12s',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#252525';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        {opt.label}
                        {isSelected && <Check size={14} style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>
          Escolha o que melhor descreve seu negócio. Se não encontrar, use &quot;Outro segmento&quot;.
        </p>
      </div>

      {selectedSegment === 'outro' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Input
            {...register('businessSegmentOther', {
              validate: (value) => {
                const t = (value ?? '').trim();
                if (t.length < 2) {
                  return 'Informe o segmento do seu negócio (campo obrigatório).';
                }
                return true;
              },
            })}
            label="Qual o segmento do seu negócio?"
            placeholder="Ex.: estética automotiva, produtos pet…"
            required
            error={otherError?.message}
            className="mt-2"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

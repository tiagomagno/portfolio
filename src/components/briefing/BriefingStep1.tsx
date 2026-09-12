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

  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
      <h3 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        Qual o segmento da sua empresa?
      </h3>

      <div className="flex flex-col gap-3">
        <label id="briefing-segment-label" style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)' }}>
          Segmento
        </label>

        {/* Custom dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls="briefing-segment-listbox"
            aria-labelledby="briefing-segment-label"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '12px 16px',
              background: 'var(--color-bg-high)',
              border: `1px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: '14px', color: selectedLabel ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
              {selectedLabel ?? 'Selecione o segmento…'}
            </span>
            <ChevronDown
              size={16}
              style={{
                flexShrink: 0,
                color: 'var(--color-text-muted)',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {open && (
            <div
              id="briefing-segment-listbox"
              role="listbox"
              aria-labelledby="briefing-segment-label"
              data-lenis-prevent
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                zIndex: 100,
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                maxHeight: '320px',
                overflowY: 'auto',
                padding: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--color-border-subtle) transparent',
              }}
            >
              {groups.map(({ title, options }, groupIndex) => (
                <div key={title} style={{ marginTop: groupIndex === 0 ? 0 : '4px' }}>
                  {/* Group header */}
                  {groupIndex > 0 && (
                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '8px 4px' }} />
                  )}
                  <div
                    style={{
                      padding: '8px 12px 4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--color-text-dim)',
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
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setValue('businessSegment', opt.value as any);
                          clearErrors('businessSegment');
                          setOpen(false);
                          triggerRef.current?.focus();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontSize: '14px',
                          textAlign: 'left',
                          background: isSelected ? 'rgba(255,86,37,0.12)' : 'transparent',
                          color: isSelected ? '#ff5625' : 'var(--color-text)',
                          fontWeight: isSelected ? 600 : 400,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background 0.12s',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-high)';
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

        <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', margin: 0 }}>
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

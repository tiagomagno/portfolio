'use client';

import { useEffect, useMemo } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  FieldError,
  useFormContext,
} from 'react-hook-form';
import { BriefingFormData, BUSINESS_SEGMENT_OPTIONS } from '@/lib/briefing';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';

interface Props {
  register: UseFormRegister<BriefingFormData>;
  watch: UseFormWatch<BriefingFormData>;
  error?: FieldError;
  otherError?: FieldError;
}

export function BriefingStep1({ register, watch, error, otherError }: Props) {
  const selectedSegment = watch('businessSegment');
  const { clearErrors } = useFormContext<BriefingFormData>();

  useEffect(() => {
    if (selectedSegment !== 'outro') {
      clearErrors('businessSegmentOther');
    }
  }, [selectedSegment, clearErrors]);

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

  return (
    <div className="flex flex-col gap-8 mt-4">
      <h3 className="text-xl md:text-2xl font-bold text-heading-light dark:text-heading-dark">
        Qual o segmento da sua empresa?
      </h3>

      <div className="flex flex-col gap-3">
        <label
          htmlFor="briefing-business-segment"
          className="block text-sm font-medium text-heading-light dark:text-heading-dark"
        >
          Segmento
        </label>
        <select
          id="briefing-business-segment"
          {...register('businessSegment')}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-base font-medium transition-all',
            'border-gray-200 bg-white text-heading-light',
            'dark:border-gray-700 dark:bg-background-dark dark:text-heading-dark',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-400 focus:ring-red-300 dark:border-red-500'
          )}
        >
          <option value="" hidden>
            Selecione o segmento…
          </option>
          {groups.map(({ title, options }) => (
            <optgroup key={title} label={title}>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="text-xs text-gray-500 dark:text-gray-400">
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
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

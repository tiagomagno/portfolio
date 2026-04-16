'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { cn } from '@/lib/utils';

const AUDIENCE_OPTIONS = [
  { value: 'pf', label: 'Pessoa Física (B2C)' },
  { value: 'pj', label: 'Empresas (B2B)' },
  { value: 'ambos', label: 'Ambos' },
];

interface Props {
  register: UseFormRegister<BriefingFormData>;
  errors: {
    targetAudience?: FieldError;
    idealCustomer?: FieldError;
    differential?: FieldError;
  };
}

export function BriefingStep5({ register, errors }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-4">
          Sobre o Seu Negócio
        </h3>
        
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quem é o seu público-alvo principal?
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {AUDIENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all',
                  'border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark',
                  'hover:border-primary/50',
                  'has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary'
                )}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('targetAudience')}
                  className="sr-only" // Hidden visually but available for logic
                />
                <span className="font-medium text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.targetAudience && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.targetAudience.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label htmlFor="idealCustomer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Como você descreve seu cliente ideal?
        </label>
        <textarea
          id="idealCustomer"
          {...register('idealCustomer')}
          placeholder="Ex: Clínicas médicas de médio porte, ou jovens de 20 a 30 anos que gostam de esportes..."
          className="w-full min-h-[100px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-4 text-text-light dark:text-text-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
        {errors.idealCustomer && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.idealCustomer.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label htmlFor="differential" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          O que torna sua empresa única? (Qual seu diferencial?)
        </label>
        <textarea
          id="differential"
          {...register('differential')}
          placeholder="Por que os clientes compram de você e não do concorrente?"
          className="w-full min-h-[100px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-4 text-text-light dark:text-text-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
        {errors.differential && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.differential.message}
          </p>
        )}
      </div>
    </div>
  );
}

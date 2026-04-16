'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'branding', label: 'Criar / Modernizar minha Identidade Visual' },
  { value: 'website', label: 'Desenvolver um Novo Site, Loja ou Sistema' },
  { value: 'social', label: 'Profissionalizar minhas Redes Sociais' },
  { value: 'growth', label: 'Atrair mais Clientes e Aumentar Vendas com Anúncios' },
  { value: 'uxui', label: 'Melhorar a experiência / Design de um App ou Software' },
  { value: 'audiovisual', label: 'Realizar produção de Fotos ou Vídeos institucionais' },
];

interface Props {
  register: UseFormRegister<BriefingFormData>;
  error?: FieldError;
}

export function BriefingStep3({ register, error }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark">
        Em qual área você precisa de mais ajuda hoje?
      </h3>
      <div className="grid gap-3 sm:grid-cols-1">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all',
              'border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark',
              'hover:border-primary/50 hover:shadow-sm',
              'has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20'
            )}
          >
            <input
              type="radio"
              value={opt.value}
              {...register('mainChallenge')}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-heading-light dark:text-heading-dark font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

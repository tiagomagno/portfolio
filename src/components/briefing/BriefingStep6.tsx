'use client';

import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { Input } from '@/components/ui/Input';

interface Props {
  register: UseFormRegister<BriefingFormData>;
  errors: FieldErrors<BriefingFormData>;
  setValue: UseFormSetValue<BriefingFormData>;
  getValues: UseFormGetValues<BriefingFormData>;
  /** Campos que o usuário já tocou (blur) */
  touchedFields: Partial<Record<keyof BriefingFormData, boolean>>;
  /** true após a primeira tentativa de submit */
  isSubmitted: boolean;
}

/** Aplica máscara brasileira de celular: (XX) XXXXX-XXXX */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function BriefingStep6({
  register,
  errors,
  setValue,
  getValues,
  touchedFields,
  isSubmitted,
}: Props) {
  const whatsappReg = register('whatsapp');

  /**
   * Retorna a mensagem de erro SOMENTE se o campo foi tocado pelo usuário
   * ou se houve uma tentativa de envio. Evita exibição prematura de erros
   * causada pela validação em cascata do Zod nas etapas anteriores.
   */
  const err = (field: keyof BriefingFormData): string | undefined => {
    if (!touchedFields[field] && !isSubmitted) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (errors[field] as any)?.message;
  };

  return (
    <div className="flex flex-col gap-8 mt-4">
      <h3 className="text-xl md:text-2xl font-bold text-heading-light dark:text-heading-dark">
        Falta pouco! Como podemos contatar você?
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Input
            id="name"
            label="Seu Nome / Empresa"
            {...register('name')}
            placeholder="João Silva"
            error={err('name')}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Input
            id="email"
            type="email"
            label="E-mail Profissional"
            {...register('email')}
            placeholder="joao@empresa.com"
            error={err('email')}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Input
            id="whatsapp"
            label="WhatsApp (com DDD)"
            placeholder="(11) 99999-9999"
            inputMode="numeric"
            error={err('whatsapp')}
            {...whatsappReg}
            onChange={(e) => {
              const masked = maskPhone(e.target.value);
              e.target.value = masked;
              whatsappReg.onChange(e);
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Input
            id="deadline"
            label="Prazo Desejado"
            {...register('deadline')}
            placeholder="Ex: 30 dias, Para o próximo mês"
            error={err('deadline')}
          />
        </div>
      </div>
    </div>
  );
}

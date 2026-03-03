'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { cn } from '@/lib/utils';

const OPTIONS = [
    { value: 'advocacia', label: 'Escritório de Advocacia' },
    { value: 'saude', label: 'Clínica / Saúde' },
    { value: 'servicos', label: 'Empresa de Serviços' },
    { value: 'comercio', label: 'Comércio / E-commerce' },
    { value: 'outro', label: 'Outro' },
];

interface Props {
    register: UseFormRegister<BriefingFormData>;
    error?: FieldError;
}

export function BriefingStep1({ register, error }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="briefing-step-title">Qual é o segmento do seu negócio?</h3>
            <div className="grid gap-3">
                {OPTIONS.map((opt) => (
                    <label key={opt.value} className={cn('briefing-option-card')}>
                        <input
                            type="radio"
                            value={opt.value}
                            {...register('businessSegment')}
                            className="h-4 w-4 border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                        />
                        <span className="font-medium text-white">{opt.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-sm text-red-400" role="alert">{error.message}</p>}
        </div>
    );
}

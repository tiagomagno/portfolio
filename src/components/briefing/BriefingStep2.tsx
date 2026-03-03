'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { cn } from '@/lib/utils';

const OPTIONS = [
    { value: 'presenca-institucional', label: 'Presença institucional' },
    { value: 'gerar-clientes', label: 'Gerar mais clientes / leads' },
    { value: 'modernizar-marca', label: 'Modernizar marca / identidade' },
    { value: 'ferramenta-estrategica', label: 'Transformar em ferramenta estratégica' },
];

interface Props {
    register: UseFormRegister<BriefingFormData>;
    error?: FieldError;
}

export function BriefingStep2({ register, error }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="briefing-step-title">Qual o principal objetivo do projeto?</h3>
            <div className="grid gap-3">
                {OPTIONS.map((opt) => (
                    <label key={opt.value} className={cn('briefing-option-card')}>
                        <input
                            type="radio"
                            value={opt.value}
                            {...register('siteObjective')}
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

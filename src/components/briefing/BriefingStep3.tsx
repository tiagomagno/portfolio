'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

const OPTIONS = [
    { value: 'pf', label: 'Pessoa Física' },
    { value: 'pj', label: 'Empresas (B2B)' },
    { value: 'ambos', label: 'Ambos' },
];

interface Props {
    register: UseFormRegister<BriefingFormData>;
    errors: { targetAudience?: FieldError; idealCustomer?: FieldError };
}

export function BriefingStep3({ register, errors }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="briefing-step-title">Quem é seu público-alvo?</h3>
            <div className="grid gap-3">
                {OPTIONS.map((opt) => (
                    <label key={opt.value} className={cn('briefing-option-card')}>
                        <input
                            type="radio"
                            value={opt.value}
                            {...register('targetAudience')}
                            className="h-4 w-4 border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                        />
                        <span className="font-medium text-white">{opt.label}</span>
                    </label>
                ))}
            </div>
            {errors.targetAudience && (
                <p className="text-sm text-red-400" role="alert">{errors.targetAudience.message}</p>
            )}
            <div className="pt-2">
                <Textarea
                    label="Descreva seu cliente ideal"
                    placeholder="Ex: Empresários de médio porte que buscam soluções de produto e UX para crescer digitalmente..."
                    {...register('idealCustomer')}
                    error={errors.idealCustomer?.message}
                    required
                    rows={4}
                />
            </div>
        </div>
    );
}

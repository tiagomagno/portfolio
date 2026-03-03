'use client';

import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { BriefingFormData, FEATURES } from '@/lib/briefing';
import { cn } from '@/lib/utils';

const FEATURE_LABELS: Record<(typeof FEATURES)[number], string> = {
    'agendamento-online': 'Agendamento online',
    'area-cliente': 'Área do cliente (login)',
    blog: 'Blog / Artigos',
    'diagnostico-online': 'Diagnóstico / Quiz interativo',
    whatsapp: 'Integração com WhatsApp',
    'captacao-leads': 'Captação de leads estruturada',
};

interface Props {
    register: UseFormRegister<BriefingFormData>;
    watch: UseFormWatch<BriefingFormData>;
}

export function BriefingStep5({ register, watch }: Props) {
    const selected = watch('features') ?? [];

    return (
        <div className="space-y-6">
            <h3 className="briefing-step-title">Quais funcionalidades você precisa?</h3>
            <p className="text-sm text-gray-400">Selecione todas que se aplicam. Nenhuma seleção é obrigatória.</p>
            <div className="grid gap-3 sm:grid-cols-2">
                {FEATURES.map((value) => (
                    <label
                        key={value}
                        className={cn(
                            'briefing-option-card',
                            selected.includes(value) && 'border-orange-500 ring-2 ring-orange-500/20'
                        )}
                    >
                        <input
                            type="checkbox"
                            value={value}
                            {...register('features')}
                            className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                        />
                        <span className="font-medium text-white">{FEATURE_LABELS[value]}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

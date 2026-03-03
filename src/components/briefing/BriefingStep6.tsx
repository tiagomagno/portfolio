'use client';

import { UseFormRegister } from 'react-hook-form';
import { BriefingFormData, ATUACAO_AREAS } from '@/lib/briefing';
import { cn } from '@/lib/utils';

const AREA_LABELS: Record<(typeof ATUACAO_AREAS)[number], string> = {
    civil: 'Civil',
    trabalhista: 'Trabalhista',
    consumidor: 'Consumidor',
    empresarial: 'Empresarial',
    familia: 'Família',
    imobiliario: 'Imobiliário',
    outros: 'Outros',
};

const OPTIONS_ATENDIMENTO = [
    { value: 'online', label: 'Online' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'ambos', label: 'Ambos' },
];

const OPTIONS_QUALIFICAR = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
];

const OPTIONS_CASOS = [
    { value: 'volume', label: 'Volume de casos' },
    { value: 'estrategicos', label: 'Casos estratégicos' },
];

interface Props {
    register: UseFormRegister<BriefingFormData>;
    errors: {
        juridicoAreas?: { message?: string };
        atendimentoTipo?: { message?: string };
        qualificarClientes?: { message?: string };
        tipoCasos?: { message?: string };
    };
}

export function BriefingStep6({ register, errors }: Props) {
    return (
        <div className="space-y-8">
            <h3 className="briefing-step-title">Módulo Jurídico — Informações adicionais</h3>

            <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Áreas de atuação (selecione as que se aplicam)</p>
                <div className="grid gap-2 sm:grid-cols-2">
                    {ATUACAO_AREAS.map((value) => (
                        <label key={value} className={cn('briefing-option-card py-3')}>
                            <input
                                type="checkbox"
                                value={value}
                                {...register('juridicoAreas')}
                                className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                            />
                            <span className="text-sm text-white">{AREA_LABELS[value]}</span>
                        </label>
                    ))}
                </div>
                {errors.juridicoAreas && (
                    <p className="mt-2 text-sm text-red-400" role="alert">{errors.juridicoAreas.message}</p>
                )}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Atendimento online ou presencial?</p>
                <div className="flex flex-wrap gap-3">
                    {OPTIONS_ATENDIMENTO.map((opt) => (
                        <label key={opt.value} className={cn('briefing-option-card py-2 px-4')}>
                            <input
                                type="radio"
                                value={opt.value}
                                {...register('atendimentoTipo')}
                                className="h-4 w-4 border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                            />
                            <span className="text-white">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Deseja qualificar clientes antes da reunião?</p>
                <div className="flex gap-3">
                    {OPTIONS_QUALIFICAR.map((opt) => (
                        <label key={opt.value} className={cn('briefing-option-card py-2 px-4')}>
                            <input
                                type="radio"
                                value={opt.value}
                                {...register('qualificarClientes')}
                                className="h-4 w-4 border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                            />
                            <span className="text-white">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Prefere volume de casos ou casos estratégicos?</p>
                <div className="flex flex-wrap gap-3">
                    {OPTIONS_CASOS.map((opt) => (
                        <label key={opt.value} className={cn('briefing-option-card py-2 px-4')}>
                            <input
                                type="radio"
                                value={opt.value}
                                {...register('tipoCasos')}
                                className="h-4 w-4 border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                            />
                            <span className="text-white">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

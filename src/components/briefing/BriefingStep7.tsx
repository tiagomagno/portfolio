'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const DEADLINE_OPTIONS = [
    { value: 'urgente', label: 'Urgente (até 1 mês)' },
    { value: '1-3-meses', label: '1 a 3 meses' },
    { value: '3-6-meses', label: '3 a 6 meses' },
    { value: 'acima-6-meses', label: 'Acima de 6 meses' },
    { value: 'flexivel', label: 'Flexível / Sem urgência' },
];

const BUDGET_OPTIONS = [
    { value: '', label: 'Não informar' },
    { value: 'ate-10k', label: 'Até R$ 10.000' },
    { value: '10k-30k', label: 'R$ 10.000 - R$ 30.000' },
    { value: '30k-50k', label: 'R$ 30.000 - R$ 50.000' },
    { value: 'acima-50k', label: 'Acima de R$ 50.000' },
];

interface Props {
    register: UseFormRegister<BriefingFormData>;
    errors: FieldErrors<BriefingFormData>;
}

export function BriefingStep7({ register, errors }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="briefing-step-title">Informações finais de contato</h3>

            <div className="grid gap-6 sm:grid-cols-2">
                <Input
                    label="Nome"
                    type="text"
                    placeholder="Seu nome completo"
                    {...register('name')}
                    error={errors.name?.message}
                    required
                />
                <Input
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                />
            </div>

            <Input
                label="WhatsApp"
                type="tel"
                placeholder="(00) 00000-0000"
                {...register('whatsapp')}
                error={errors.whatsapp?.message}
                required
            />

            <div className="grid gap-6 sm:grid-cols-2">
                <Select
                    label="Prazo desejado"
                    options={DEADLINE_OPTIONS}
                    {...register('deadline')}
                    error={errors.deadline?.message}
                    required
                />
                <Select
                    label="Orçamento estimado (opcional)"
                    options={BUDGET_OPTIONS}
                    {...register('budget')}
                    error={errors.budget?.message}
                />
            </div>
        </div>
    );
}

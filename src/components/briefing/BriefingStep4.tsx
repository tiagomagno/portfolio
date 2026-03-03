'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';
import { BriefingFormData } from '@/lib/briefing';
import { Textarea } from '@/components/ui/Textarea';

interface Props {
    register: UseFormRegister<BriefingFormData>;
    error?: FieldError;
}

export function BriefingStep4({ register, error }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="briefing-step-title">Qual o principal diferencial do seu projeto/empresa?</h3>
            <Textarea
                label="Diferencial"
                placeholder="O que torna seu negócio único? Por que um cliente escolheria você e não o concorrente?"
                {...register('differential')}
                error={error?.message}
                required
                rows={5}
            />
        </div>
    );
}

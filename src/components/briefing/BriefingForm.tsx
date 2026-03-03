'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { briefingSchema, type BriefingFormData } from '@/lib/briefing';
import { BriefingStep1 } from './BriefingStep1';
import { BriefingStep2 } from './BriefingStep2';
import { BriefingStep3 } from './BriefingStep3';
import { BriefingStep4 } from './BriefingStep4';
import { BriefingStep5 } from './BriefingStep5';
import { BriefingStep6 } from './BriefingStep6';
import { BriefingStep7 } from './BriefingStep7';

const STEPS = [
    { id: 1, key: 'step1', title: 'Negócio' },
    { id: 2, key: 'step2', title: 'Objetivo' },
    { id: 3, key: 'step3', title: 'Público' },
    { id: 4, key: 'step4', title: 'Diferencial' },
    { id: 5, key: 'step5', title: 'Funcionalidades' },
    { id: 6, key: 'step6', title: 'Jurídico' },
    { id: 7, key: 'step7', title: 'Contato' },
];

function getFieldsForStep(stepKey: string): (keyof BriefingFormData)[] {
    const map: Record<string, (keyof BriefingFormData)[]> = {
        step1: ['businessSegment'],
        step2: ['siteObjective'],
        step3: ['targetAudience', 'idealCustomer'],
        step4: ['differential'],
        step5: [],
        step6: ['juridicoAreas', 'atendimentoTipo', 'qualificarClientes', 'tipoCasos'],
        step7: ['name', 'email', 'whatsapp', 'deadline'],
    };
    return map[stepKey] ?? [];
}

export function BriefingForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const form = useForm<BriefingFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(briefingSchema) as any,
        defaultValues: {
            idealCustomer: '',
            differential: '',
            features: [],
            name: '',
            email: '',
            whatsapp: '',
            deadline: '',
            budget: '',
        } as Partial<BriefingFormData>,
    });

    const { register, handleSubmit, watch, trigger, formState: { errors } } = form;
    const businessSegment = watch('businessSegment');
    const showJuridicoStep = businessSegment === 'advocacia';

    const visibleSteps = showJuridicoStep ? STEPS : STEPS.filter((s) => s.key !== 'step6');
    const totalSteps = visibleSteps.length;
    const progressPercent = (currentStep / totalSteps) * 100;
    const stepKeys = visibleSteps.map((s) => s.key);
    const currentStepKey = stepKeys[currentStep - 1];

    const goNext = async () => {
        const fieldsToValidate = getFieldsForStep(currentStepKey);
        const ok = await trigger(fieldsToValidate as (keyof BriefingFormData)[]);
        if (ok && currentStep < totalSteps) {
            setCurrentStep((s) => s + 1);
        }
    };

    const goPrev = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    };

    const onSubmit = async (data: BriefingFormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');
        try {
            const res = await fetch('/api/briefing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
                setErrorMessage(json.error ?? 'Não foi possível enviar. Tente novamente.');
            }
        } catch {
            setSubmitStatus('error');
            setErrorMessage('Erro de conexão. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="briefing-success" role="status" aria-live="polite">
                <div className="briefing-success-icon">
                    <CheckCircle size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Briefing recebido!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
                    Obrigado pelo seu interesse. Em breve entrarei em contato para conversarmos sobre o seu projeto.
                </p>
                <Link href="/" className="btn btn-primary btn-sm">
                    Voltar para Home
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="briefing-form-wrapper" noValidate>
            {/* Progresso */}
            <div className="briefing-progress-area">
                <div className="briefing-progress-labels">
                    <span>Etapa {currentStep} de {totalSteps}</span>
                    <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="briefing-progress-bar">
                    <div
                        className="briefing-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {/* Steps indicators */}
                <div className="briefing-steps-dots">
                    {visibleSteps.map((step, idx) => (
                        <div
                            key={step.key}
                            className={`briefing-dot ${idx + 1 <= currentStep ? 'active' : ''}`}
                            title={step.title}
                        />
                    ))}
                </div>
            </div>

            {/* Conteúdo do step */}
            <div className="briefing-step-content" key={currentStepKey}>
                {currentStepKey === 'step1' && <BriefingStep1 register={register} error={errors.businessSegment} />}
                {currentStepKey === 'step2' && <BriefingStep2 register={register} error={errors.siteObjective} />}
                {currentStepKey === 'step3' && (
                    <BriefingStep3
                        register={register}
                        errors={{ targetAudience: errors.targetAudience, idealCustomer: errors.idealCustomer }}
                    />
                )}
                {currentStepKey === 'step4' && <BriefingStep4 register={register} error={errors.differential} />}
                {currentStepKey === 'step5' && <BriefingStep5 register={register} watch={watch} />}
                {currentStepKey === 'step6' && showJuridicoStep && (
                    <BriefingStep6
                        register={register}
                        errors={{
                            juridicoAreas: errors.juridicoAreas ? { message: (errors.juridicoAreas as { message?: string }).message } : undefined,
                            atendimentoTipo: errors.atendimentoTipo,
                            qualificarClientes: errors.qualificarClientes,
                            tipoCasos: errors.tipoCasos,
                        }}
                    />
                )}
                {currentStepKey === 'step7' && <BriefingStep7 register={register} errors={errors} />}
            </div>

            {/* Erro de envio */}
            {submitStatus === 'error' && (
                <div className="briefing-error-box">
                    <p className="font-medium">Erro ao enviar</p>
                    <p className="text-sm opacity-80">{errorMessage}</p>
                </div>
            )}

            {/* Navegação */}
            <div className="briefing-nav">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={currentStep === 1}
                    className={`briefing-btn-back ${currentStep === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                    <ChevronLeft size={20} />
                    Voltar
                </button>

                {currentStep < totalSteps ? (
                    <button type="button" onClick={goNext} className="briefing-btn-next">
                        Próximo
                        <ChevronRight size={20} />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="briefing-btn-next disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            'Enviar briefing'
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}

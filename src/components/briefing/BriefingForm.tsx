'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import {
  briefingSchema,
  type BriefingFormData,
  getBusinessSegmentLabel,
  formatGenericRaioXPainPoints,
  SPECIALIZED_BRIEFING_SEGMENTS,
  GENERIC_RAIOX_PAIN_OPTIONS,
} from '@/lib/briefing';
import { BriefingStep1 } from './BriefingStep1';
import BriefingStep2 from './BriefingStep2';
import { BriefingStep3 } from './BriefingStep3';
import { BriefingStep4 } from './BriefingStep4';
import { BriefingStep5 } from './BriefingStep5';
import { BriefingStep6 } from './BriefingStep6';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, key: 'step1', title: 'Negócio' },
  { id: 2, key: 'step2', title: 'Raio-X' },
  { id: 3, key: 'step3', title: 'Desafio' },
  { id: 4, key: 'step4', title: 'Detalhes' },
  { id: 5, key: 'step5', title: 'A Empresa' },
  { id: 6, key: 'step6', title: 'Contato' },
];

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
      comercio_salesChannel: [],
      genericRaioXPainPoints: [],
    } as Partial<BriefingFormData>,
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, touchedFields, isSubmitted },
  } = form;

  const totalSteps = STEPS.length;
  const progressPercent = (currentStep / totalSteps) * 100;

  const stepKeys = STEPS.map((s) => s.key);
  const currentStepKey = stepKeys[currentStep - 1];

  // Limpa erros do step 6 sempre que o usuário chega nessa etapa,
  // evitando exibição prematura causada pela validação Zod de etapas anteriores.
  useEffect(() => {
    if (currentStep === 6) {
      clearErrors(['name', 'email', 'whatsapp', 'deadline']);
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = async () => {
    if (currentStepKey === 'step1') {
      const segment = getValues('businessSegment');
      const otherRaw = getValues('businessSegmentOther') ?? '';
      const other = typeof otherRaw === 'string' ? otherRaw.trim() : '';

      if (!segment) {
        await trigger('businessSegment');
        return;
      }

      if (segment === 'outro' && other.length < 2) {
        setError('businessSegmentOther', {
          type: 'manual',
          message:
            'Informe o segmento do seu negócio (campo obrigatório).',
        });
        return;
      }

      clearErrors('businessSegmentOther');
    }

    if (currentStepKey === 'step2') {
      const seg = getValues('businessSegment');
      if (seg && !SPECIALIZED_BRIEFING_SEGMENTS.has(seg)) {
        const pts = (getValues('genericRaioXPainPoints') ?? []) as string[];
        const allowed = new Set<string>(
          GENERIC_RAIOX_PAIN_OPTIONS.map((o) => o.id)
        );
        const painOk =
          pts.length >= 1 && pts.every((id) => allowed.has(id));
        if (!painOk) {
          setError('genericRaioXPainPoints', {
            type: 'manual',
            message:
              'Marque pelo menos uma opção que represente sua dor ou desafio',
          });
          return;
        }
        clearErrors('genericRaioXPainPoints');
      }
    }

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
      const resolvedSegment =
        data.businessSegment === 'outro'
          ? data.businessSegmentOther
          : getBusinessSegmentLabel(data.businessSegment);

      const emailParams = {
        Nome: data.name,
        Email: data.email,
        WhatsApp: data.whatsapp,
        Segmento: resolvedSegment,
        Desafio_Principal: data.mainChallenge,
        Publico_Alvo: data.targetAudience,
        Cliente_Ideal: data.idealCustomer,
        Diferencial: data.differential,
        Funcionalidades: (data.features || []).join(', '),
        Prazo: data.deadline,
        Dores_RaioX: formatGenericRaioXPainPoints(
          data.genericRaioXPainPoints
        ),
        Detalhes_Operacao:
          data.outro_operationDetails?.trim() || '—',
        _subject: 'Novo Briefing de Projeto! 🚀',
        _template: 'box'
      };

      const res = await fetch("https://formsubmit.co/ajax/tiagosilvamagno@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailParams)
      });
      
      const resData = await res.json();

      if (res.ok && resData.success === "true") {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(resData.message ?? 'Não foi possível enviar. Tente novamente.');
      }
    } catch (e: any) {
      console.error(e);
      setSubmitStatus('error');
      setErrorMessage(e?.message || 'Erro de conexão ou serviço não configurado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div
        className="rounded-2xl bg-white dark:bg-surface-dark p-8 md:p-12 text-center shadow-lg border border-gray-100 dark:border-gray-800 animate-in fade-in duration-500"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle size={40} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">
          Obrigado! Recebemos seu briefing.
        </h2>
        <p className="text-text-light dark:text-text-dark mb-8 max-w-md mx-auto">
          Em breve entraremos em contato para alinhar os próximos passos do seu projeto.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold bg-primary hover:bg-primary-hover transition-colors shadow-lg"
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-text-light dark:text-text-dark">
          <span>
            Etapa {currentStep} de {totalSteps}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div
        className="min-h-[320px] animate-in fade-in slide-in-from-right-4 duration-300"
        key={currentStepKey}
      >
        {currentStepKey === 'step1' && (
          <BriefingStep1 
            register={register} 
            watch={watch}
            error={errors.businessSegment} 
            otherError={errors.businessSegmentOther} 
          />
        )}
        {currentStepKey === 'step2' && (
          <BriefingStep2 />
        )}
        {currentStepKey === 'step3' && (
          <BriefingStep3 register={register} error={errors.mainChallenge} />
        )}
        {currentStepKey === 'step4' && (
          <BriefingStep4 register={register} watch={watch} error={errors.features as any} />
        )}
        {currentStepKey === 'step5' && (
          <BriefingStep5
            register={register}
            errors={errors}
          />
        )}
        {currentStepKey === 'step6' && (
          <BriefingStep6
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            touchedFields={touchedFields as any}
            isSubmitted={isSubmitted}
          />
        )}
      </div>

      {submitStatus === 'error' && (
        <div className="rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">
          <p className="font-medium">Erro ao enviar</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row gap-4 justify-between pt-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentStep === 1}
          className={cn(
            'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors',
            currentStep === 1
              ? 'text-gray-400 cursor-not-allowed dark:text-gray-600'
              : 'text-heading-light dark:text-heading-dark hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <ChevronLeft size={20} />
          Voltar
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
          >
            Próximo
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-primary hover:bg-primary-hover transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
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
    </FormProvider>
  );
}

function getFieldsForStep(stepKey: string): (keyof BriefingFormData)[] {
  const map: Record<string, (keyof BriefingFormData)[]> = {
    step1: ['businessSegment', 'businessSegmentOther'],
    step2: [
      'advocacia_practiceAreas', 'advocacia_format', 'advocacia_screening', 'advocacia_caseFocus',
      'saude_attendanceType', 'saude_mainVolume', 'saude_hasMedicalSoftware', 'saude_focus',
      'comercio_salesChannel', 'comercio_salesType', 'comercio_logistics', 'comercio_hasERP',
      'servicos_closureModel', 'servicos_proposalVolume', 'servicos_mainPainPoint',
      'genericRaioXPainPoints',
      'outro_operationDetails'
    ],
    step3: ['mainChallenge'],
    step4: ['features'],
    step5: ['targetAudience', 'idealCustomer', 'differential'],
    step6: ['name', 'email', 'whatsapp', 'deadline'],
  };
  return map[stepKey] ?? [];
}

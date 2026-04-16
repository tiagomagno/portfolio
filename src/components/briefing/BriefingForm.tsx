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
      if (!segment) { await trigger('businessSegment'); return; }
      if (segment === 'outro' && other.length < 2) {
        setError('businessSegmentOther', { type: 'manual', message: 'Informe o segmento do seu negócio (campo obrigatório).' });
        return;
      }
      clearErrors('businessSegmentOther');
    }

    if (currentStepKey === 'step2') {
      const seg = getValues('businessSegment');
      if (seg && !SPECIALIZED_BRIEFING_SEGMENTS.has(seg)) {
        const pts = (getValues('genericRaioXPainPoints') ?? []) as string[];
        const allowed = new Set<string>(GENERIC_RAIOX_PAIN_OPTIONS.map((o) => o.id));
        const painOk = pts.length >= 1 && pts.every((id) => allowed.has(id));
        if (!painOk) {
          setError('genericRaioXPainPoints', { type: 'manual', message: 'Marque pelo menos uma opção que represente sua dor ou desafio' });
          return;
        }
        clearErrors('genericRaioXPainPoints');
      }
    }

    const fieldsToValidate = getFieldsForStep(currentStepKey);
    const ok = await trigger(fieldsToValidate as (keyof BriefingFormData)[]);
    if (ok && currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      // Limpa erros do step 6 antes de navegar para ele, evitando
      // que a validação Zod do schema completo os mostre prematuramente.
      if (nextStep === totalSteps) {
        clearErrors(['name', 'email', 'whatsapp', 'deadline']);
      }
      setCurrentStep(nextStep);
    }
  };

  const goPrev = () => { if (currentStep > 1) setCurrentStep((s) => s - 1); };

  const onSubmit = async (data: BriefingFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      const resolvedSegment = data.businessSegment === 'outro'
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
        Dores_RaioX: formatGenericRaioXPainPoints(data.genericRaioXPainPoints),
        Detalhes_Operacao: data.outro_operationDetails?.trim() || '—',
        _subject: 'Novo Briefing de Projeto! 🚀',
        _template: 'box',
      };

      const res = await fetch('https://formsubmit.co/ajax/tiagosilvamagno@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(emailParams),
      });
      const resData = await res.json();
      if (res.ok && resData.success === 'true') {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(resData.message ?? 'Não foi possível enviar. Tente novamente.');
      }
    } catch (e: any) {
      setSubmitStatus('error');
      setErrorMessage(e?.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div style={{ padding: '48px 40px', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(255,86,37,0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', color: '#ff5625',
        }}>
          <CheckCircle size={36} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
          Obrigado! Recebemos seu briefing.
        </h2>
        <p style={{ fontSize: '14px', color: '#a8a29e', lineHeight: 1.7, marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          Em breve entraremos em contato para alinhar os próximos passos do seu projeto.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 32px', borderRadius: '100px',
            background: '#ff5625', color: '#fff', fontWeight: 700,
            fontSize: '15px', textDecoration: 'none',
          }}
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '40px' }}>

        {/* Progress bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a8a29e', marginBottom: '8px' }}>
            <span>Etapa {currentStep} de {totalSteps}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div style={{ height: '4px', borderRadius: '100px', background: '#2a2a2a', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '100px', background: '#ff5625',
              width: `${progressPercent}%`, transition: 'width 0.3s ease-out',
            }} />
          </div>
        </div>

        {/* Step content */}
        <div style={{ minHeight: '320px' }} key={currentStepKey}>
          {currentStepKey === 'step1' && (
            <BriefingStep1 register={register} watch={watch} error={errors.businessSegment} otherError={errors.businessSegmentOther} />
          )}
          {currentStepKey === 'step2' && <BriefingStep2 />}
          {currentStepKey === 'step3' && (
            <BriefingStep3 register={register} error={errors.mainChallenge} />
          )}
          {currentStepKey === 'step4' && (
            <BriefingStep4 register={register} watch={watch} error={errors.features as any} />
          )}
          {currentStepKey === 'step5' && (
            <BriefingStep5 register={register} errors={errors} />
          )}
          {currentStepKey === 'step6' && (
            <BriefingStep6
              register={register} errors={errors} setValue={setValue} getValues={getValues}
              touchedFields={touchedFields as any} isSubmitted={isSubmitted}
            />
          )}
        </div>

        {submitStatus === 'error' && (
          <div style={{
            marginTop: '24px', padding: '16px', borderRadius: '10px',
            border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)', color: '#f87171',
          }}>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Erro ao enviar</p>
            <p style={{ fontSize: '13px' }}>{errorMessage}</p>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #2a2a2a',
        }}>
          <button
            type="button"
            onClick={goPrev}
            disabled={currentStep === 1}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px', borderRadius: '10px', fontSize: '15px', fontWeight: 600,
              color: currentStep === 1 ? '#3a3a3a' : '#a8a29e',
              background: 'transparent', border: 'none',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={18} />
            Voltar
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={goNext}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
                color: '#fff', background: '#ff5625', border: 'none', cursor: 'pointer',
              }}
            >
              Próximo
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
                color: '#fff', background: '#ff5625', border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" />Enviando...</>
              ) : 'Enviar briefing'}
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
      'genericRaioXPainPoints', 'outro_operationDetails',
    ],
    step3: ['mainChallenge'],
    step4: ['features'],
    step5: ['targetAudience', 'idealCustomer', 'differential'],
    step6: ['name', 'email', 'whatsapp', 'deadline'],
  };
  return map[stepKey] ?? [];
}

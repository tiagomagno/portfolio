'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import {
  briefingSchema,
  type BriefingFormData,
  getCompanyStageLabel,
  getTeamSizeLabel,
  getProductTypeLabel,
  getProductStageLabel,
  formatMainChallenges,
  getProjectGoalLabel,
  getBudgetRangeLabel,
  getEngagementFormatLabel,
  getPreferredContactLabel,
} from '@/lib/briefing';
import { BriefingStep1 } from './BriefingStep1';
import BriefingStep2 from './BriefingStep2';
import { BriefingStep3 } from './BriefingStep3';
import { BriefingStep4 } from './BriefingStep4';
import { BriefingStep5 } from './BriefingStep5';
import { BriefingStep6 } from './BriefingStep6';

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'] as const;

export function BriefingForm({ recipientEmail }: { recipientEmail: string }) {
  const { t } = useLang();
  const STEPS = STEP_KEYS.map((key, i) => ({ id: i + 1, key, title: t(`briefing.steps.${key}.title`) }));
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<BriefingFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(briefingSchema) as any,
    defaultValues: {
      mainChallenge: [],
      mainChallengeOther: '',
      productTypeOther: '',
      goalDescription: '',
      name: '',
      email: '',
      whatsapp: '',
      deadline: '',
    } as Partial<BriefingFormData>,
  });

  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = form;

  const totalSteps = STEPS.length;
  const progressPercent = (currentStep / totalSteps) * 100;
  const stepKeys = STEPS.map((s) => s.key);
  const currentStepKey = stepKeys[currentStep - 1];
  const currentStepTitle = STEPS[currentStep - 1].title;

  const stepContentRef = useRef<HTMLDivElement>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (currentStep === totalSteps) {
      clearErrors(['name', 'email', 'whatsapp', 'preferredContact']);
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Move o foco pro início da nova etapa (WCAG 2.4.3): ao avançar/voltar, o
  // usuário de teclado/leitor de tela precisa de um ponto de foco previsível
  // em vez de ficar preso no botão "Próximo"/"Voltar" da etapa anterior.
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    stepContentRef.current?.focus();
  }, [currentStepKey]);

  const goNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStepKey);
    const ok = await trigger(fieldsToValidate as (keyof BriefingFormData)[]);
    if (ok && currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      // Limpa erros do step de contato antes de navegar pra ele, evitando
      // que a validação Zod do schema completo os mostre prematuramente.
      if (nextStep === totalSteps) {
        clearErrors(['name', 'email', 'whatsapp', 'preferredContact']);
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
      const emailParams = {
        Nome: data.name,
        Email: data.email,
        WhatsApp: data.whatsapp,
        Contato_Preferido: getPreferredContactLabel(data.preferredContact),
        Momento_Empresa: getCompanyStageLabel(data.companyStage),
        Tamanho_Time: getTeamSizeLabel(data.teamSize),
        Tipo_Produto: data.productType === 'outro' ? data.productTypeOther : getProductTypeLabel(data.productType),
        Estagio_Produto: getProductStageLabel(data.productStage),
        Desafio_Principal: formatMainChallenges(data.mainChallenge),
        Outro_Desafio: data.mainChallengeOther?.trim() || '—',
        Objetivo_Projeto: getProjectGoalLabel(data.projectGoal),
        Descricao_Objetivo: data.goalDescription,
        Prazo: data.deadline,
        Faixa_Investimento: getBudgetRangeLabel(data.budgetRange),
        Formato_Trabalho: getEngagementFormatLabel(data.engagementFormat),
        _subject: 'Novo Briefing de Projeto! 🚀',
        _template: 'box',
      };

      // Persiste no admin pra alimentar o pipeline de leads — não bloqueia o envio se falhar.
      const { _subject, _template, ...leadFields } = emailParams;
      fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, ...leadFields }),
      }).catch(() => {});

      const res = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
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
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
          {t('briefing.steps.successTitle')}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          {t('briefing.steps.successText')}
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 32px', borderRadius: '100px',
            background: 'var(--color-primary-text)', color: '#fff', fontWeight: 700,
            fontSize: '15px', textDecoration: 'none',
          }}
        >
          {t('briefing.steps.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '40px' }}>

        {/* Progress bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            <span>{t('briefing.steps.progress').replace('{current}', String(currentStep)).replace('{total}', String(totalSteps))}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={currentStep}
            aria-valuetext={`${t('briefing.steps.progress').replace('{current}', String(currentStep)).replace('{total}', String(totalSteps))}: ${currentStepTitle}`}
            style={{ height: '4px', borderRadius: '100px', background: 'var(--color-border)', overflow: 'hidden' }}
          >
            <div style={{
              height: '100%', borderRadius: '100px', background: '#ff5625',
              width: `${progressPercent}%`, transition: 'width 0.3s ease-out',
            }} />
          </div>
        </div>

        {/* Anúncio de mudança de etapa pra leitores de tela (WCAG 4.1.3) */}
        <div aria-live="polite" className="sr-only">
          {t('briefing.steps.progress').replace('{current}', String(currentStep)).replace('{total}', String(totalSteps))}: {currentStepTitle}
        </div>

        {/* Step content */}
        <div style={{ minHeight: '320px' }} key={currentStepKey} ref={stepContentRef} tabIndex={-1}>
          {currentStepKey === 'step1' && (
            <BriefingStep1 register={register} error={errors.companyStage} teamSizeError={errors.teamSize} />
          )}
          {currentStepKey === 'step2' && (
            <BriefingStep2
              register={register}
              error={errors.productType}
              otherError={errors.productTypeOther}
              stageError={errors.productStage}
            />
          )}
          {currentStepKey === 'step3' && (
            <BriefingStep3 register={register} error={errors.mainChallenge as any} otherError={errors.mainChallengeOther} />
          )}
          {currentStepKey === 'step4' && (
            <BriefingStep4 register={register} error={errors.projectGoal} descriptionError={errors.goalDescription} />
          )}
          {currentStepKey === 'step5' && (
            <BriefingStep5 register={register} errors={{ deadline: errors.deadline, engagementFormat: errors.engagementFormat }} />
          )}
          {currentStepKey === 'step6' && (
            <BriefingStep6 register={register} errors={errors} />
          )}
        </div>

        {submitStatus === 'error' && (
          <div
            role="alert"
            style={{
              marginTop: '24px', padding: '16px', borderRadius: '14px',
              border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)', color: '#f87171',
            }}>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>{t('briefing.steps.errorTitle')}</p>
            <p style={{ fontSize: '13px' }}>{errorMessage}</p>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)',
        }}>
          <button
            type="button"
            onClick={goPrev}
            disabled={currentStep === 1}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px', borderRadius: '14px', fontSize: '15px', fontWeight: 600,
              color: currentStep === 1 ? 'var(--color-border-subtle)' : 'var(--color-text-muted)',
              background: 'transparent', border: 'none',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={18} />
            {t('briefing.steps.back')}
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={goNext}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '12px 28px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
                color: '#fff', background: 'var(--color-primary-text)', border: 'none', cursor: 'pointer',
              }}
            >
              {t('briefing.steps.next')}
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
                color: '#fff', background: 'var(--color-primary-text)', border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" />{t('briefing.steps.submitting')}</>
              ) : t('briefing.steps.submit')}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function getFieldsForStep(stepKey: string): (keyof BriefingFormData)[] {
  const map: Record<string, (keyof BriefingFormData)[]> = {
    step1: ['companyStage', 'teamSize'],
    step2: ['productType', 'productTypeOther', 'productStage'],
    step3: ['mainChallenge', 'mainChallengeOther'],
    step4: ['projectGoal', 'goalDescription'],
    step5: ['deadline', 'budgetRange', 'engagementFormat'],
    step6: ['name', 'email', 'whatsapp', 'preferredContact'],
  };
  return map[stepKey] ?? [];
}

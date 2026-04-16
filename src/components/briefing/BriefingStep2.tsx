'use client';

import { useFormContext } from 'react-hook-form';
import {
  BriefingFormData,
  ADVOCACIA_FORMAT,
  ADVOCACIA_FOCUS,
  SAUDE_ATTENDANCE_TYPE,
  SAUDE_FOCUS,
  COMERCIO_SALES_TYPE,
  COMERCIO_LOGISTICS,
  SERVICOS_CLOSURE_MODEL,
  YES_NO,
  GENERIC_RAIOX_PAIN_OPTIONS,
} from '../../lib/briefing';

/* ─── Shared style tokens ─────────────────────────────────── */
const S = {
  title: {
    fontSize: 'clamp(20px, 3vw, 26px)',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
    lineHeight: 1.2,
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: '#a8a29e',
    lineHeight: 1.6,
    margin: 0,
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    color: '#a8a29e',
    marginBottom: '8px',
  } as React.CSSProperties,
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: '#131313',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: '#131313',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '100px',
  } as React.CSSProperties,
  error: {
    fontSize: '12px',
    color: '#ef4444',
  } as React.CSSProperties,
};

function optionStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: selected ? 'rgba(255,86,37,0.08)' : '#131313',
    border: `1px solid ${selected ? '#ff5625' : '#2a2a2a'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: selected ? '#fff' : '#a8a29e',
    transition: 'all 0.15s',
  };
}

const checkboxStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  flexShrink: 0,
  accentColor: '#ff5625',
  cursor: 'pointer',
};

/* ─── Section wrapper ─────────────────────────────────────── */
function StepWrapper({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
      <div>
        <h3 style={S.title}>{title}</h3>
        {subtitle && <p style={S.subtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── Radio / Checkbox group ──────────────────────────────── */
function OptionGroup({
  label,
  error,
  children,
  columns = 1,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}) {
  const cols = columns === 3 ? 'repeat(3,1fr)' : columns === 2 ? 'repeat(2,1fr)' : '1fr';
  return (
    <div style={S.field}>
      <span style={S.label}>{label}</span>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '8px' }}>
        {children}
      </div>
      {error && <p style={S.error}>{error}</p>}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────── */
export default function BriefingStep2() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BriefingFormData>();

  const businessSegment = watch('businessSegment');

  /* ── Advocacia ─────────────────────────────────────────────── */
  if (businessSegment === 'advocacia') {
    return (
      <StepWrapper
        title="Raio-X do seu Escritório"
        subtitle="Conte-nos como sua banca atua hoje para entendermos qual a melhor estratégia digital para você."
      >
        <div style={S.field}>
          <label style={S.label}>Quais as suas principais áreas de atuação? *</label>
          <input
            style={S.input}
            placeholder="Ex: Direito Civil, Família, Trabalhista..."
            {...register('advocacia_practiceAreas')}
          />
          {errors.advocacia_practiceAreas && <p style={S.error}>{errors.advocacia_practiceAreas.message}</p>}
        </div>

        <OptionGroup label="Qual o formato de atendimento principal? *" error={errors.advocacia_format?.message} columns={3}>
          {ADVOCACIA_FORMAT.map((f) => (
            <label key={f} style={optionStyle(watch('advocacia_format') === f)}>
              <input type="radio" value={f} {...register('advocacia_format')} style={checkboxStyle} />
              <span style={{ textTransform: 'capitalize' }}>{f}</span>
            </label>
          ))}
        </OptionGroup>

        <OptionGroup label="Você realiza triagem/qualificação dos clientes antes de atender? *" error={errors.advocacia_screening?.message} columns={2}>
          {YES_NO.map((opt) => (
            <label key={opt} style={optionStyle(watch('advocacia_screening') === opt)}>
              <input type="radio" value={opt} {...register('advocacia_screening')} style={checkboxStyle} />
              <span>{opt === 'sim' ? 'Sim, já filtramos os contatos' : 'Não, atendo todos que chegam'}</span>
            </label>
          ))}
        </OptionGroup>

        <OptionGroup label="Qual o foco dos casos que você deseja atrair? *" error={errors.advocacia_caseFocus?.message} columns={2}>
          {ADVOCACIA_FOCUS.map((f) => (
            <label key={f} style={optionStyle(watch('advocacia_caseFocus') === f)}>
              <input type="radio" value={f} {...register('advocacia_caseFocus')} style={checkboxStyle} />
              <span>{f === 'volume' ? 'Volume de Ações' : 'Casos Estratégicos (Alto Valor)'}</span>
            </label>
          ))}
        </OptionGroup>
      </StepWrapper>
    );
  }

  /* ── Saúde ─────────────────────────────────────────────────── */
  if (businessSegment === 'saude') {
    return (
      <StepWrapper
        title="Raio-X da Saúde"
        subtitle="Queremos entender como é a rotina de agendamentos e atendimentos no seu consultório/clínica."
      >
        <OptionGroup label="Qual a modalidade de atendimento mais comum? *" error={errors.saude_attendanceType?.message} columns={3}>
          {SAUDE_ATTENDANCE_TYPE.map((opt) => (
            <label key={opt} style={optionStyle(watch('saude_attendanceType') === opt)}>
              <input type="radio" value={opt} {...register('saude_attendanceType')} style={checkboxStyle} />
              <span style={{ textTransform: 'capitalize' }}>{opt === 'ambos' ? 'Particular e Convênio' : opt}</span>
            </label>
          ))}
        </OptionGroup>

        <div style={S.field}>
          <label style={S.label}>De onde vem o maior volume de agendamentos hoje? *</label>
          <input
            style={S.input}
            placeholder="Ex: Indicações, Doctoralia, WhatsApp, Instagram..."
            {...register('saude_mainVolume')}
          />
          {errors.saude_mainVolume && <p style={S.error}>{errors.saude_mainVolume.message}</p>}
        </div>

        <OptionGroup label="A clínica utiliza algum software médico/prontuário digital atual? *" error={errors.saude_hasMedicalSoftware?.message} columns={2}>
          {YES_NO.map((opt) => (
            <label key={opt} style={optionStyle(watch('saude_hasMedicalSoftware') === opt)}>
              <input type="radio" value={opt} {...register('saude_hasMedicalSoftware')} style={checkboxStyle} />
              <span style={{ textTransform: 'capitalize' }}>{opt}</span>
            </label>
          ))}
        </OptionGroup>

        <OptionGroup label="Qual o foco de volume que você busca? *" error={errors.saude_focus?.message} columns={3}>
          {SAUDE_FOCUS.map((f) => (
            <label key={f} style={optionStyle(watch('saude_focus') === f)}>
              <input type="radio" value={f} {...register('saude_focus')} style={checkboxStyle} />
              <span style={{ textTransform: 'capitalize' }}>{f}</span>
            </label>
          ))}
        </OptionGroup>
      </StepWrapper>
    );
  }

  /* ── Comércio ───────────────────────────────────────────────── */
  if (businessSegment === 'comercio') {
    const channels = [
      { id: 'loja_fisica', label: 'Loja Física' },
      { id: 'ecommerce', label: 'E-commerce Próprio (Site)' },
      { id: 'instagram_whatsapp', label: 'Instagram e WhatsApp' },
      { id: 'marketplace', label: 'Marketplaces (MercadoLivre, Shopee, etc)' },
    ];
    const selected = watch('comercio_salesChannel') ?? [];

    return (
      <StepWrapper title="Raio-X do Comércio" subtitle="Como funciona a sua dinâmica de vendas e estoque?">
        <OptionGroup label="Quais seus canais de venda atuais? (Selecione todos que se aplicam) *" error={errors.comercio_salesChannel?.message as string} columns={2}>
          {channels.map((c) => (
            <label key={c.id} style={optionStyle(selected.includes(c.label))}>
              <input type="checkbox" value={c.label} {...register('comercio_salesChannel')} style={checkboxStyle} />
              <span>{c.label}</span>
            </label>
          ))}
        </OptionGroup>

        <OptionGroup label="Qual seu formato principal de venda? *" error={errors.comercio_salesType?.message} columns={2}>
          {COMERCIO_SALES_TYPE.map((opt) => (
            <label key={opt} style={optionStyle(watch('comercio_salesType') === opt)}>
              <input type="radio" value={opt} {...register('comercio_salesType')} style={checkboxStyle} />
              <span>{opt === 'varejo_atacado' ? 'Varejo e Atacado' : opt}</span>
            </label>
          ))}
        </OptionGroup>

        <OptionGroup label="Como funciona a sua logística principal hoje? *" error={errors.comercio_logistics?.message} columns={3}>
          {COMERCIO_LOGISTICS.map((opt) => (
            <label key={opt} style={optionStyle(watch('comercio_logistics') === opt)}>
              <input type="radio" value={opt} {...register('comercio_logistics')} style={checkboxStyle} />
              <span>Entrega {opt}</span>
            </label>
          ))}
        </OptionGroup>

        <OptionGroup label="Você possui um sistema ERP ou gerenciador de estoque atual? *" error={errors.comercio_hasERP?.message} columns={2}>
          {YES_NO.map((opt) => (
            <label key={opt} style={optionStyle(watch('comercio_hasERP') === opt)}>
              <input type="radio" value={opt} {...register('comercio_hasERP')} style={checkboxStyle} />
              <span>{opt === 'sim' ? 'Sim, controlo o estoque via sistema' : 'Não, faço manual ou não tenho'}</span>
            </label>
          ))}
        </OptionGroup>
      </StepWrapper>
    );
  }

  /* ── Serviços ───────────────────────────────────────────────── */
  if (businessSegment === 'servicos') {
    return (
      <StepWrapper
        title="Raio-X de Serviços"
        subtitle="Entenda e maximize suas contratações mapeando a forma como você atrai contatos hoje."
      >
        <OptionGroup label="Qual o modelo principal de fechamento do seu serviço? *" error={errors.servicos_closureModel?.message} columns={3}>
          {SERVICOS_CLOSURE_MODEL.map((opt) => (
            <label key={opt} style={optionStyle(watch('servicos_closureModel') === opt)}>
              <input type="radio" value={opt} {...register('servicos_closureModel')} style={checkboxStyle} />
              <span>{opt === 'orcamento' ? 'Orçamento Personalizado' : opt === 'visita' ? 'Visita Técnica' : 'Tabela de Preço Fixa'}</span>
            </label>
          ))}
        </OptionGroup>

        <div style={S.field}>
          <label style={S.label}>Em média, qual o volume de propostas enviadas mensalmente? *</label>
          <input
            style={S.input}
            placeholder="Ex: Entre 10 a 30, Mais de 50 propostas, etc."
            {...register('servicos_proposalVolume')}
          />
          {errors.servicos_proposalVolume && <p style={S.error}>{errors.servicos_proposalVolume.message}</p>}
        </div>

        <div style={S.field}>
          <label style={S.label}>Qual é a principal dor/obstáculo da sua equipe comercial hoje? *</label>
          <input
            style={S.input}
            placeholder="Ex: Muitos contatos não qualificados, Preço da concorrência..."
            {...register('servicos_mainPainPoint')}
          />
          {errors.servicos_mainPainPoint && <p style={S.error}>{errors.servicos_mainPainPoint.message}</p>}
        </div>
      </StepWrapper>
    );
  }

  /* ── Fallback genérico ─────────────────────────────────────── */
  const painPointsError = errors.genericRaioXPainPoints?.message;
  const selectedPains = (watch('genericRaioXPainPoints') ?? []) as string[];

  return (
    <StepWrapper
      title="Raio-X de Negócios"
      subtitle="Marque o que mais se aplica hoje. Se quiser, complemente com detalhes no campo abaixo."
    >
      <div style={S.field}>
        <label style={S.label}>
          O que mais te incomoda em vendas ou em atrair clientes?{' '}
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {GENERIC_RAIOX_PAIN_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              style={optionStyle(selectedPains.includes(opt.id))}
            >
              <input
                type="checkbox"
                value={opt.id}
                {...register('genericRaioXPainPoints')}
                style={checkboxStyle}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {painPointsError && <p style={S.error}>{painPointsError}</p>}
      </div>

      <div style={S.field}>
        <label style={S.label}>Quer detalhar melhor? (opcional)</label>
        <textarea
          rows={4}
          maxLength={500}
          placeholder="Ex.: horários de pico, tipo de cliente, o que já tentou fazer…"
          style={S.textarea}
          {...register('outro_operationDetails')}
        />
        {errors.outro_operationDetails && <p style={S.error}>{errors.outro_operationDetails.message}</p>}
      </div>
    </StepWrapper>
  );
}

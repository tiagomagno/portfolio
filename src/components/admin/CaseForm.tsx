'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch, FormProvider, useFormContext, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ATUACAO_CATEGORIES, slugify, type AtuacaoCategory } from '@/data/portfolio';
import { caseFormSchema, emptyCaseFormDefaults, type CaseFormData } from '@/lib/caseForm';
import { uploadFile } from '@/lib/adminUpload';
import PillTabs from '@/components/ui/PillTabs';
import ImageField from './ImageField';

const SECTIONS = [
  { id: 'basico', label: 'Dados básicos' },
  { id: 'imagens', label: 'Imagens' },
  { id: 'overview', label: 'Visão Geral' },
  { id: 'diagnosis', label: 'Diagnóstico' },
  { id: 'design', label: 'Design' },
  { id: 'handoff', label: 'Handoff' },
  { id: 'impact', label: 'Impacto' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
  fontFamily: 'inherit',
  color: '#1a1a1a',
  background: '#fff',
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' };
const hintStyle: React.CSSProperties = { fontSize: '11px', color: 'rgba(26,26,26,0.55)', margin: '6px 0 0' };
const errorStyle: React.CSSProperties = { fontSize: '12px', color: '#b91c1c', marginTop: '4px', display: 'block' };

export default function CaseForm({
  mode,
  slug,
  initialData,
  onSuccess,
  onCancel,
}: {
  mode: 'create' | 'edit';
  slug?: string;
  initialData?: CaseFormData;
  /** Quando fornecido, chamado em vez de navegar pra /admin/cases após salvar (uso dentro de um Sheet). */
  onSuccess?: () => void;
  /** Quando fornecido, o botão "Cancelar" chama isso em vez de navegar pra /admin/cases. */
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basico');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');

  const form = useForm<CaseFormData>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: initialData ?? emptyCaseFormDefaults,
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const empresa = watch('empresa');
  useEffect(() => {
    if (!slugTouched) setValue('slug', slugify(empresa || ''));
  }, [empresa, slugTouched, setValue]);

  function scrollToSection(id: string) {
    setActiveSection(id);
    document.getElementById('admin-sheet-scroll')?.scrollTo({ top: 0 });
  }

  async function onSubmit(data: CaseFormData) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const url = mode === 'create' ? '/api/admin/cases' : `/api/admin/cases/${slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setSubmitError(err?.error ?? 'Erro ao salvar.');
        return;
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/cases');
      }
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '100%' }}>
        <div style={{ position: 'sticky', top: 0, background: '#f5f3f0', padding: '16px 0', zIndex: 30, marginBottom: '24px' }}>
          <PillTabs tabs={SECTIONS} activeId={activeSection} onChange={scrollToSection} />
        </div>

        <FormSection id="basico" title="Dados básicos" activeSection={activeSection}>
          <Field>
            <label style={labelStyle}>Empresa / nome do case</label>
            <input {...register('empresa')} style={inputStyle} placeholder="Ex: Acme Ltda." />
            {errors.empresa && <span style={errorStyle}>{errors.empresa.message}</span>}
          </Field>

          <Field>
            <label style={labelStyle}>URL (slug)</label>
            <input
              {...register('slug')}
              style={inputStyle}
              onChange={(e) => {
                setSlugTouched(true);
                setValue('slug', e.target.value);
              }}
            />
            <p style={hintStyle}>Mudar depois de publicado quebra o link atual.</p>
            {errors.slug && <span style={errorStyle}>{errors.slug.message}</span>}
          </Field>

          <Field>
            <label style={labelStyle}>Categorias</label>
            <CategoryPicker />
            <p style={hintStyle}>Aparecem no filtro do portfólio e no card do case.</p>
            {errors.atuacao && <span style={errorStyle}>{errors.atuacao.message as string}</span>}
          </Field>

          <Field full>
            <label style={labelStyle}>Produtos / entregáveis</label>
            <StringArrayField name="produtos" placeholder="Ex: Identidade Visual" />
            <p style={hintStyle}>Resumo exibido enquanto o case não tem case study completo.</p>
            {errors.produtos && <span style={errorStyle}>{errors.produtos.message as string}</span>}
          </Field>
        </FormSection>

        <FormSection id="imagens" title="Imagens" activeSection={activeSection}>
          <CoverAndHeroFields />
          <GalleryField />
        </FormSection>

        <FormSection id="overview" title="01 · Visão Geral e Contexto de Negócio" activeSection={activeSection}>
          <Field>
            <label style={labelStyle}>Papel</label>
            <input {...register('role')} style={inputStyle} placeholder="Ex: Design e Desenvolvimento de Site" />
          </Field>
          <Field>
            <label style={labelStyle}>Ano</label>
            <input {...register('year')} style={{ ...inputStyle, maxWidth: '160px' }} placeholder="Ex: 2024" />
          </Field>
          <Field full>
            <label style={labelStyle}>Subtítulo do topo (hero)</label>
            <TextArea {...register('heroSubtitle')} rows={2} />
          </Field>
          <Field full>
            <label style={labelStyle}>Contexto</label>
            <TextArea {...register('overview.context')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Problema de Negócio</label>
            <TextArea {...register('overview.businessProblem')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Objetivos & KPIs</label>
            <StringArrayField name="overview.goals" placeholder="Ex: Consolidar a presença digital" />
          </Field>
          <Field full>
            <label style={labelStyle}>Seu Papel & Escopo</label>
            <TextArea {...register('overview.roleScope')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Restrições & Prazos</label>
            <StringArrayField name="overview.constraints" placeholder="Ex: Prazo definido previamente" />
          </Field>
        </FormSection>

        <FormSection id="diagnosis" title="02 · Diagnóstico, Pesquisa e Alinhamento Estratégico" activeSection={activeSection}>
          <Field full>
            <label style={labelStyle}>Metodologia</label>
            <TextArea {...register('diagnosis.methodology')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Por que essa abordagem?</label>
            <TextArea {...register('diagnosis.whyThisApproach')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Principal Insight</label>
            <TextArea {...register('diagnosis.insight')} rows={2} />
          </Field>
          <Field full>
            <label style={labelStyle}>Gestão de Stakeholders</label>
            <TextArea {...register('diagnosis.stakeholderManagement')} rows={3} />
          </Field>
        </FormSection>

        <FormSection id="design" title="03 · Arquitetura, Decisões de Design e UI" activeSection={activeSection}>
          <Field full>
            <label style={labelStyle}>Hipótese Central</label>
            <TextArea {...register('design.hypothesis')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Alternativas Descartadas</label>
            <AlternativesField />
          </Field>
          <Field full>
            <label style={labelStyle}>Edge Cases & Fluxos</label>
            <TextArea {...register('design.edgeCases')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Design System</label>
            <TextArea {...register('design.designSystem')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Validação & Usabilidade</label>
            <TextArea {...register('design.usabilityValidation')} rows={3} />
          </Field>
        </FormSection>

        <FormSection id="handoff" title="04 · Viabilidade Técnica e Handoff" activeSection={activeSection}>
          <Field full>
            <label style={labelStyle}>Colaboração com Engenharia</label>
            <TextArea {...register('handoff.engineeringCollaboration')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Especificação & Documentação</label>
            <TextArea {...register('handoff.specDocumentation')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Estratégia de Lançamento</label>
            <TextArea {...register('handoff.launchStrategy')} rows={3} />
          </Field>
        </FormSection>

        <FormSection id="impact" title="05 · Impacto, Resultados e Aprendizados" activeSection={activeSection}>
          <Field full>
            <label style={labelStyle}>Resultados Quantitativos</label>
            <MetricsField />
          </Field>
          <Field full>
            <label style={labelStyle}>Impacto Qualitativo</label>
            <TextArea {...register('impact.qualitativeImpact')} rows={3} />
          </Field>
          <Field full>
            <label style={labelStyle}>Post-mortem — o que faria diferente</label>
            <TextArea {...register('impact.postMortem')} rows={3} />
          </Field>
        </FormSection>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', paddingBottom: '64px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Salvando...' : mode === 'create' ? 'Criar case' : 'Salvar alterações'}
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(26,26,26,0.55)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Cancelar
            </button>
          ) : (
            <Link href="/admin/cases" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(26,26,26,0.55)', textDecoration: 'none' }}>
              Cancelar
            </Link>
          )}
          {submitError && <span style={errorStyle} role="alert">{submitError}</span>}
        </div>
      </form>
    </FormProvider>
  );
}

/* ── Seções e campos ── */

/** Só a seção com id === activeSection fica visível — as outras ficam com `display: none`
 * (não desmontadas, pra não perder estado local de inputs não controlados) em vez de
 * empilhadas com scroll, pra virar uma navegação por abas de verdade. */
function FormSection({ id, title, activeSection, children }: { id: string; title: string; activeSection: string; children: React.ReactNode }) {
  const active = id === activeSection;
  return (
    <section
      id={`section-${id}`}
      style={{ display: active ? 'block' : 'none', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}
    >
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 20px' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 24px', alignItems: 'start' }}>{children}</div>
    </section>
  );
}

/** `full` estende o campo pelas 2 colunas do grid da seção — usado em textareas e campos de
 * lista/tabela, que ficam espremidos demais em meia largura. Campos curtos (inputs de uma
 * linha, selects) ficam em meia largura por padrão e se pareiam automaticamente na mesma linha. */
function Field({ children, full, style }: { children: React.ReactNode; full?: boolean; style?: React.CSSProperties }) {
  return <div style={{ gridColumn: full ? '1 / -1' : undefined, ...style }}>{children}</div>;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />;
}

function CategoryPicker() {
  const { watch, setValue } = useFormContext<CaseFormData>();
  const atuacao = watch('atuacao');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function toggle(cat: AtuacaoCategory) {
    setValue('atuacao', atuacao.includes(cat) ? atuacao.filter((c) => c !== cat) : [...atuacao, cat], { shouldValidate: true });
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', maxWidth: '360px' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          ...inputStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: atuacao.length ? '#1a1a1a' : 'rgba(26,26,26,0.45)' }}>
          {atuacao.length ? atuacao.join(', ') : 'Selecione as categorias'}
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.55)', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 20,
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '6px',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {ATUACAO_CATEGORIES.map((cat) => {
            const active = atuacao.includes(cat);
            return (
              <label
                key={cat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#1a1a1a',
                  cursor: 'pointer',
                }}
              >
                <input type="checkbox" checked={active} onChange={() => toggle(cat)} />
                {cat}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Campo de lista de strings simples (produtos, objetivos, restrições) — sem useFieldArray
 * (que espera arrays de objeto); controla direto via watch/setValue. */
function StringArrayField({ name, placeholder }: { name: Path<CaseFormData>; placeholder?: string }) {
  const { control, register, setValue } = useFormContext<CaseFormData>();
  const values = (useWatch({ control, name }) as unknown as string[]) ?? [];

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        {values.map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px' }}>
            <input {...register(`${name}.${i}` as Path<CaseFormData>)} style={inputStyle} placeholder={placeholder} />
            <RemoveButton onClick={() => setValue(name, values.filter((_, idx) => idx !== i) as never)} />
          </div>
        ))}
      </div>
      <AddButton label="+ Adicionar" onClick={() => setValue(name, [...values, ''] as never)} />
    </div>
  );
}

function AlternativesField() {
  const { control, register } = useFormContext<CaseFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'design.discardedAlternatives' });
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        {fields.map((field, i) => (
          <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px' }}>
            <input {...register(`design.discardedAlternatives.${i}.title`)} style={inputStyle} placeholder="Título" />
            <input {...register(`design.discardedAlternatives.${i}.reason`)} style={inputStyle} placeholder="Motivo do descarte" />
            <RemoveButton onClick={() => remove(i)} />
          </div>
        ))}
      </div>
      <AddButton label="+ Adicionar alternativa" onClick={() => append({ title: '', reason: '' })} />
    </div>
  );
}

function MetricsField() {
  const { control, register } = useFormContext<CaseFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: 'impact.metrics' });
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
        {fields.map((field, i) => (
          <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px' }}>
            <input {...register(`impact.metrics.${i}.value`)} style={inputStyle} placeholder="Valor (ex: +42%)" />
            <input {...register(`impact.metrics.${i}.label`)} style={inputStyle} placeholder="Rótulo" />
            <RemoveButton onClick={() => remove(i)} />
          </div>
        ))}
      </div>
      <AddButton label="+ Adicionar métrica" onClick={() => append({ value: '', label: '' })} />
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ padding: '8px 14px', borderRadius: '8px', border: '1px dashed var(--color-border)', background: 'transparent', color: '#1a1a1a', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
    >
      {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remover"
      title="Remover"
      style={{ width: '36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#fff', color: 'rgba(26,26,26,0.55)', cursor: 'pointer', fontSize: '14px' }}
    >
      ×
    </button>
  );
}

/* ── Imagens (capa/hero/galeria) — preview local + upload sequencial ── */

function CoverAndHeroFields() {
  const { watch, setValue } = useFormContext<CaseFormData>();
  const coverImage = watch('coverImage');
  const heroImage = watch('heroImage');
  const heroColor = watch('heroColor');
  const [heroMode, setHeroMode] = useState<'image' | 'color'>(heroColor ? 'color' : 'image');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function handleSingleUpload(field: 'coverImage' | 'heroImage', file: File) {
    const previous = watch(field);
    const localUrl = URL.createObjectURL(file);
    setValue(field, localUrl);
    setUploadingField(field);
    setMessage('');
    try {
      const url = await uploadFile(file);
      setValue(field, url);
    } catch {
      setValue(field, previous);
      setMessage('Erro ao enviar imagem.');
    } finally {
      setUploadingField(null);
      URL.revokeObjectURL(localUrl);
    }
  }

  function selectHeroMode(mode: 'image' | 'color') {
    setHeroMode(mode);
    if (mode === 'image') setValue('heroColor', '');
    else setValue('heroImage', '');
  }

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <ImageField
          label="Capa"
          hint="Recomendado: 1600×1200px (4:3). Aparece na home e nos cards do portfólio."
          value={coverImage || null}
          uploading={uploadingField === 'coverImage'}
          onUpload={(file) => handleSingleUpload('coverImage', file)}
          onRemove={() => setValue('coverImage', '')}
        />
      </div>

      <div>
        <span style={labelStyle}>Imagem de topo</span>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['image', 'color'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => selectHeroMode(mode)}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                border: heroMode === mode ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: heroMode === mode ? 'var(--color-primary)' : 'transparent',
                color: heroMode === mode ? '#fff' : 'rgba(26,26,26,0.6)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {mode === 'image' ? 'Imagem' : 'Cor'}
            </button>
          ))}
        </div>

        {heroMode === 'image' ? (
          <ImageField
            label=""
            hint=""
            value={heroImage || null}
            uploading={uploadingField === 'heroImage'}
            onUpload={(file) => handleSingleUpload('heroImage', file)}
            onRemove={() => setValue('heroImage', '')}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="color"
              value={heroColor || '#1a1a1a'}
              onChange={(e) => setValue('heroColor', e.target.value)}
              style={{ width: '48px', height: '48px', padding: 0, border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
            />
            <input
              type="text"
              value={heroColor || ''}
              onChange={(e) => setValue('heroColor', e.target.value)}
              placeholder="#1a1a1a"
              style={{ ...inputStyle, width: '120px' }}
            />
          </div>
        )}
        <p style={hintStyle}>Recomendado: 1920×1080px (16:9). Sem imagem nem cor, usa a capa.</p>
        {message && <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', marginTop: '8px', display: 'block' }}>{message}</span>}
      </div>
    </>
  );
}

function GalleryField() {
  const { control, setValue } = useFormContext<CaseFormData>();
  const gallery = (useWatch({ control, name: 'gallery' }) as CaseFormData['gallery']) ?? [];
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleGalleryUpload(files: FileList) {
    setUploading(true);
    setMessage('');
    let current = gallery;
    let hadError = false;
    for (const file of Array.from(files)) {
      const localUrl = URL.createObjectURL(file);
      current = [...current, { url: localUrl, active: true }];
      setValue('gallery', current);
      try {
        const url = await uploadFile(file);
        current = current.map((item) => (item.url === localUrl ? { ...item, url } : item));
        setValue('gallery', current);
      } catch {
        hadError = true;
        current = current.filter((item) => item.url !== localUrl);
        setValue('gallery', current);
      } finally {
        URL.revokeObjectURL(localUrl);
      }
    }
    if (hadError) setMessage('Erro ao enviar uma ou mais imagens da galeria.');
    setUploading(false);
  }

  function toggleActive(index: number) {
    setValue('gallery', gallery.map((item, i) => (i === index ? { ...item, active: !item.active } : item)));
  }

  function removeImage(index: number) {
    setValue('gallery', gallery.filter((_, i) => i !== index));
  }

  return (
    <div style={{ marginTop: '28px', gridColumn: '1 / -1' }}>
      <span style={labelStyle}>Galeria</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
        {gallery.map((item, i) => (
          <div key={item.url + i} style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', opacity: item.active ? 1 : 0.4 }}>
            <Image src={item.url} alt={`Galeria ${i + 1}`} fill sizes="140px" style={{ objectFit: 'cover' }} unoptimized />
            {!item.active && (
              <span style={{ position: 'absolute', bottom: '4px', left: '4px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                Desativada
              </span>
            )}
            <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '4px' }}>
              <button
                onClick={() => toggleActive(i)}
                type="button"
                title={item.active ? 'Desativar' : 'Ativar'}
                style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.65)', color: '#fff', cursor: 'pointer', fontSize: '12px', lineHeight: 1 }}
              >
                {item.active ? '◐' : '○'}
              </button>
              <button
                onClick={() => removeImage(i)}
                type="button"
                title="Excluir"
                style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.65)', color: '#fff', cursor: 'pointer', fontSize: '12px', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <label style={{ display: 'inline-block', padding: '10px 16px', borderRadius: '8px', border: '1px dashed var(--color-border)', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer' }}>
        {uploading ? 'Enviando...' : '+ Adicionar imagens'}
        <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} style={{ display: 'none' }} disabled={uploading} />
      </label>
      {message && <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', marginLeft: '12px' }}>{message}</span>}
      <p style={hintStyle}>Recomendado: 1200×900px (4:3) por imagem.</p>
    </div>
  );
}

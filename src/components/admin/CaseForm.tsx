'use client';

import { useEffect, useState } from 'react';
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
const hintStyle: React.CSSProperties = { fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px' };
const errorStyle: React.CSSProperties = { fontSize: '12px', color: '#b91c1c', marginTop: '4px', display: 'block' };

export default function CaseForm({
  mode,
  slug,
  initialData,
}: {
  mode: 'create' | 'edit';
  slug?: string;
  initialData?: CaseFormData;
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
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      router.push('/admin/cases');
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '840px' }}>
        <div style={{ position: 'sticky', top: 0, background: '#f5f3f0', padding: '16px 0', zIndex: 10, marginBottom: '24px' }}>
          <PillTabs tabs={SECTIONS} activeId={activeSection} onChange={scrollToSection} />
        </div>

        <FormSection id="basico" title="Dados básicos">
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Empresa / nome do case</label>
            <input {...register('empresa')} style={inputStyle} placeholder="Ex: Acme Ltda." />
            {errors.empresa && <span style={errorStyle}>{errors.empresa.message}</span>}
          </Field>

          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>URL (slug)</label>
            <p style={hintStyle}>Gerada automaticamente a partir do nome. Editável — mas mudar depois de publicado quebra o link atual.</p>
            <input
              {...register('slug')}
              style={inputStyle}
              onChange={(e) => {
                setSlugTouched(true);
                setValue('slug', e.target.value);
              }}
            />
            {errors.slug && <span style={errorStyle}>{errors.slug.message}</span>}
          </Field>

          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Categorias</label>
            <p style={hintStyle}>Usadas no filtro do portfólio e exibidas no card do case. Escolha uma ou mais.</p>
            <CategoryPicker />
            {errors.atuacao && <span style={errorStyle}>{errors.atuacao.message as string}</span>}
          </Field>

          <Field>
            <label style={labelStyle}>Produtos / entregáveis</label>
            <p style={hintStyle}>Curtos, exibidos como resumo quando o case ainda não tem case study completo.</p>
            <StringArrayField name="produtos" placeholder="Ex: Identidade Visual" />
            {errors.produtos && <span style={errorStyle}>{errors.produtos.message as string}</span>}
          </Field>
        </FormSection>

        <FormSection id="imagens" title="Imagens">
          <CoverAndHeroFields />
          <GalleryField />
        </FormSection>

        <FormSection id="overview" title="01 · Visão Geral e Contexto de Negócio">
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Papel</label>
            <input {...register('role')} style={inputStyle} placeholder="Ex: Design e Desenvolvimento de Site" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <Field>
              <label style={labelStyle}>Ano</label>
              <input {...register('year')} style={inputStyle} placeholder="Ex: 2024" />
            </Field>
          </div>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Subtítulo do topo (hero)</label>
            <TextArea {...register('heroSubtitle')} rows={2} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Contexto</label>
            <TextArea {...register('overview.context')} rows={3} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Problema de Negócio</label>
            <TextArea {...register('overview.businessProblem')} rows={3} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Objetivos & KPIs</label>
            <StringArrayField name="overview.goals" placeholder="Ex: Consolidar a presença digital" />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Seu Papel & Escopo</label>
            <TextArea {...register('overview.roleScope')} rows={3} />
          </Field>
          <Field>
            <label style={labelStyle}>Restrições & Prazos</label>
            <StringArrayField name="overview.constraints" placeholder="Ex: Prazo definido previamente" />
          </Field>
        </FormSection>

        <FormSection id="diagnosis" title="02 · Diagnóstico, Pesquisa e Alinhamento Estratégico">
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Metodologia</label>
            <TextArea {...register('diagnosis.methodology')} rows={3} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Por que essa abordagem?</label>
            <TextArea {...register('diagnosis.whyThisApproach')} rows={3} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Principal Insight</label>
            <TextArea {...register('diagnosis.insight')} rows={2} />
          </Field>
          <Field>
            <label style={labelStyle}>Gestão de Stakeholders</label>
            <TextArea {...register('diagnosis.stakeholderManagement')} rows={3} />
          </Field>
        </FormSection>

        <FormSection id="design" title="03 · Arquitetura, Decisões de Design e UI">
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Hipótese Central</label>
            <TextArea {...register('design.hypothesis')} rows={3} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Alternativas Descartadas</label>
            <AlternativesField />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Edge Cases & Fluxos</label>
            <TextArea {...register('design.edgeCases')} rows={3} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Design System</label>
            <TextArea {...register('design.designSystem')} rows={3} />
          </Field>
          <Field>
            <label style={labelStyle}>Validação & Usabilidade</label>
            <TextArea {...register('design.usabilityValidation')} rows={3} />
          </Field>
        </FormSection>

        <FormSection id="handoff" title="04 · Viabilidade Técnica e Handoff">
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Colaboração com Engenharia</label>
            <TextArea {...register('handoff.engineeringCollaboration')} rows={3} />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Especificação & Documentação</label>
            <TextArea {...register('handoff.specDocumentation')} rows={3} />
          </Field>
          <Field>
            <label style={labelStyle}>Estratégia de Lançamento</label>
            <TextArea {...register('handoff.launchStrategy')} rows={3} />
          </Field>
        </FormSection>

        <FormSection id="impact" title="05 · Impacto, Resultados e Aprendizados">
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Resultados Quantitativos</label>
            <MetricsField />
          </Field>
          <Field style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Impacto Qualitativo</label>
            <TextArea {...register('impact.qualitativeImpact')} rows={3} />
          </Field>
          <Field>
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
          <Link href="/admin/cases" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(26,26,26,0.55)', textDecoration: 'none' }}>
            Cancelar
          </Link>
          {submitError && <span style={errorStyle} role="alert">{submitError}</span>}
        </div>
      </form>
    </FormProvider>
  );
}

/* ── Seções e campos ── */

function FormSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={`section-${id}`} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '28px', marginBottom: '24px', scrollMarginTop: '80px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 20px' }}>{title}</h2>
      {children}
    </section>
  );
}

function Field({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={style}>{children}</div>;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />;
}

function CategoryPicker() {
  const { watch, setValue } = useFormContext<CaseFormData>();
  const atuacao = watch('atuacao');
  function toggle(cat: AtuacaoCategory) {
    setValue('atuacao', atuacao.includes(cat) ? atuacao.filter((c) => c !== cat) : [...atuacao, cat], { shouldValidate: true });
  }
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {ATUACAO_CATEGORIES.map((cat) => {
        const active = atuacao.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: active ? 'var(--color-primary)' : 'transparent',
              color: active ? '#fff' : 'rgba(26,26,26,0.6)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        );
      })}
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
          hint="Home, listagem do portfólio e card de próximo case. Formato recomendado: 1600×1200px (4:3)."
          value={coverImage || null}
          uploading={uploadingField === 'coverImage'}
          onUpload={(file) => handleSingleUpload('coverImage', file)}
          onRemove={() => setValue('coverImage', '')}
        />
      </div>

      <div>
        <span style={labelStyle}>Imagem de topo</span>
        <p style={hintStyle}>Banner do topo da página de detalhamento: imagem (1920×1080px, 16:9) ou uma cor sólida. Se nenhuma for definida, usa a capa.</p>
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
    <div style={{ marginTop: '28px' }}>
      <span style={labelStyle}>Galeria</span>
      <p style={hintStyle}>Posts, mockup do site, telas do app etc. Formato recomendado: 1200×900px (4:3) por imagem.</p>
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
    </div>
  );
}

/** Server-only: converte CaseFormData validado em payload do Prisma. Não importar de client components. */
import { Prisma } from '@prisma/client';
import type { CaseFormData } from '@/lib/caseForm';

/** Seções de narrativa só são salvas se tiverem algum conteúdo — evita gravar um objeto
 * cheio de strings/arrays vazias pra um case recém-criado com só os dados básicos. */
function sectionOrNull(section: Record<string, unknown>): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  const hasContent = Object.values(section).some((v) =>
    Array.isArray(v) ? v.some((item) => (typeof item === 'string' ? item.trim().length > 0 : Boolean(item))) : typeof v === 'string' ? v.trim().length > 0 : false
  );
  return hasContent ? (section as unknown as Prisma.InputJsonValue) : Prisma.JsonNull;
}

export function caseFormToPrismaData(data: CaseFormData) {
  const cleanGoals = data.overview.goals.filter((g) => g.trim().length > 0);
  const cleanConstraints = data.overview.constraints.filter((c) => c.trim().length > 0);
  const cleanProdutos = data.produtos.filter((p) => p.trim().length > 0);

  return {
    slug: data.slug,
    empresa: data.empresa,
    atuacao: data.atuacao as unknown as Prisma.InputJsonValue,
    produtos: cleanProdutos as unknown as Prisma.InputJsonValue,
    coverImage: data.coverImage.trim() || null,
    heroImage: data.heroImage.trim() || null,
    heroColor: data.heroColor.trim() || null,
    gallery: (data.gallery.length > 0 ? data.gallery : Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
    role: data.role.trim() || null,
    year: data.year.trim() || null,
    heroSubtitle: data.heroSubtitle.trim() || null,
    overview: sectionOrNull({ ...data.overview, goals: cleanGoals, constraints: cleanConstraints }),
    diagnosis: sectionOrNull(data.diagnosis),
    design: sectionOrNull(data.design),
    handoff: sectionOrNull(data.handoff),
    impact: sectionOrNull(data.impact),
  };
}

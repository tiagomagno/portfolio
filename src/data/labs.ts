import { prisma } from '@/lib/prisma';

export const LAB_STATUSES = ['MVP no ar', 'Em desenvolvimento', 'Protótipo', 'Em breve'] as const;
export type LabStatus = (typeof LAB_STATUSES)[number];

export interface LabItem {
  id: string;
  title: string;
  tagline: string;
  status: LabStatus;
  /** Link do produto; vazio = sem botão "Acessar". */
  href: string;
  /** Imagem do card; vazio = card só com texto. */
  image: string;
  /** Par de cores do fundo do card (definido pela posição, não é editável). */
  gradient: [string, string];
}

/** Padrões usados enquanto não há projetos cadastrados no admin (e como carga inicial). */
export const DEFAULT_LAB_ITEMS: Omit<LabItem, 'id' | 'gradient'>[] = [
  {
    title: 'Design System Lab',
    tagline: 'Simula a mesma paleta em mobile e desktop, valida a regra 60/30/10 e dá feedback heurístico de hierarquia visual.',
    status: 'MVP no ar',
    href: '',
    image: '/labs/design-system-lab.png',
  },
  {
    title: 'Dine — Comanda Digital',
    tagline: 'Gestão de comandas por QR Code pra bares e restaurantes, com separação automática de pedidos entre bar e cozinha.',
    status: 'MVP no ar',
    href: '',
    image: '/labs/dine.png',
  },
  {
    title: 'Seu Mercado',
    tagline: 'Escaneia o QR Code da nota fiscal do mercado e organiza preços e gastos automaticamente, sem digitar nada.',
    status: 'Protótipo',
    href: '',
    image: '/labs/seu-mercado.png',
  },
  {
    title: 'Webtools',
    tagline: 'Mais de 80 ferramentas gratuitas — conversores, calculadoras e utilitários rodando 100% no navegador, sem upload.',
    status: 'MVP no ar',
    href: 'https://webtools.tiagosmagno.com.br',
    image: '/labs/webtools.png',
  },
];

const GRADIENTS: [string, string][] = [
  ['#1a1a1a', '#2a2a2a'],
  ['#0f2a1f', '#1a1a1a'],
  ['#2e2210', '#1a1a1a'],
  ['#2e1509', '#1a1a1a'],
];

const withGradient = (i: number): [string, string] => GRADIENTS[i % GRADIENTS.length];

/** Projetos visíveis do Lab, em ordem. Sem linhas no banco (ou banco fora do ar) usa os padrões. */
export async function getLabItems(): Promise<LabItem[]> {
  try {
    const rows = await prisma.labItem.findMany({ orderBy: { order: 'asc' } });
    if (rows.length > 0) {
      return rows
        .filter((r) => r.visible)
        .map((r, i) => ({
          id: r.id,
          title: r.title,
          tagline: r.tagline,
          status: (LAB_STATUSES as readonly string[]).includes(r.status) ? (r.status as LabStatus) : 'Protótipo',
          href: r.href,
          image: r.image,
          gradient: withGradient(i),
        }));
  }
  } catch (err) {
    console.error('getLabItems falhou:', err);
  }
  return DEFAULT_LAB_ITEMS.map((d, i) => ({ ...d, id: `default-${i}`, gradient: withGradient(i) }));
}

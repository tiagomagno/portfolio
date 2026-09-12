import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Stats from '@/components/Stats';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Cases from '@/components/Cases';
import TalkCTA from '@/components/TalkCTA';
import Skills from '@/components/Skills';
import Services from '@/components/Services';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Divider from '@/components/Divider';
import { prisma } from '@/lib/prisma';
import { getAllCaseAssetOverrides } from '@/data/caseAssets';
import { getHiddenPortfolioSlugs } from '@/data/portfolioVisibility';

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: Hero,
  about: About,
  stats: Stats,
  work: Work,
  experience: Experience,
  cases: Cases,
  talkCta: TalkCTA,
  skills: Skills,
  services: Services,
  faq: Faq,
  contact: Contact,
};

const DEFAULT_ORDER = ['hero', 'about', 'stats', 'work', 'experience', 'cases', 'skills', 'services', 'faq', 'talkCta', 'contact'];

// Schema.org HowTo para a seção "Processo" (Discover/Design/Develop/Deploy) — o site já
// tinha o conteúdo ideal pra featured snippets, só faltava a marcação estruturada (AEO).
const PROCESS_HOWTO_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Como funciona o processo de design de produto do Tiago Magno',
  description: 'Do zero ao ar, com método: descoberta, design, desenvolvimento e lançamento.',
  step: [
    { '@type': 'HowToStep', name: 'Kickoff com Stakeholders', text: 'Alinhamento de expectativas, prazos e North Star do projeto.' },
    { '@type': 'HowToStep', name: 'Research & Benchmarking', text: 'Desk research, entrevistas com usuários e análise competitiva.' },
    { '@type': 'HowToStep', name: 'Síntese e Priorização', text: 'Mapeamento de oportunidades e definição do escopo validado.' },
    { '@type': 'HowToStep', name: 'Arquitetura de Informação', text: 'Organização de fluxos, sitemap e hierarquia de navegação.' },
    { '@type': 'HowToStep', name: 'Wireframes e Fluxos', text: 'Estrutura de telas em baixa fidelidade para validar caminhos.' },
    { '@type': 'HowToStep', name: 'UI Design (Alta Fidelidade)', text: 'Interfaces finais com identidade visual e design system.' },
    { '@type': 'HowToStep', name: 'Hand-off para Devs', text: 'Documentação detalhada e alinhamento com engenharia.' },
    { '@type': 'HowToStep', name: 'Suporte e Validação', text: 'Presença ativa durante o desenvolvimento para garantir fidelidade.' },
    { '@type': 'HowToStep', name: 'QA de Interface', text: 'Revisão das telas implementadas antes da entrega final.' },
    { '@type': 'HowToStep', name: 'QA e Testes Finais', text: 'Revisão técnica de UX/UI antes do go-live em staging.' },
    { '@type': 'HowToStep', name: 'Go-Live', text: 'Produto entregue com monitoramento da estabilidade inicial.' },
    { '@type': 'HowToStep', name: 'Pós-lançamento e Dados', text: 'Análise de métricas e feedback para priorizar os próximos passos.' },
  ],
};

// Reflete a ordem/visibilidade definida em /admin/sections sem precisar de novo deploy.
export const revalidate = 60;

async function getSectionOrder(): Promise<string[]> {
  try {
    const sections = await prisma.homeSection.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
    if (sections.length === 0) return DEFAULT_ORDER;
    const order = sections.map((s) => s.key).filter((key) => key in SECTION_COMPONENTS);
    // "faq" é novo — se o admin ainda não configurou a seção em /admin/sections,
    // insere antes do contato em vez de deixá-la de fora até a próxima config manual.
    if (!order.includes('faq')) {
      const contactIndex = order.indexOf('contact');
      const insertAt = contactIndex === -1 ? order.length : contactIndex;
      order.splice(insertAt, 0, 'faq');
    }
    return order;
  } catch {
    return DEFAULT_ORDER;
  }
}

export default async function Home() {
  const [order, overrides, hiddenSlugs] = await Promise.all([
    getSectionOrder(),
    getAllCaseAssetOverrides(),
    getHiddenPortfolioSlugs(),
  ]);
  const overridesBySlug = Object.fromEntries(overrides);

  return (
    <>
      <Header />
      <main id="main-content">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PROCESS_HOWTO_JSON_LD) }}
        />
        {order.map((key, i) => {
          const section = key === 'cases'
            ? <Cases key={key} overrides={overridesBySlug} hiddenSlugs={[...hiddenSlugs]} />
            : (() => {
                const Section = SECTION_COMPONENTS[key];
                return Section ? <Section key={key} /> : null;
              })();
          if (!section) return null;
          return (
            <div key={key}>
              {i > 0 && <Divider />}
              {section}
            </div>
          );
        })}
      </main>
      <Footer />
    </>
  );
}

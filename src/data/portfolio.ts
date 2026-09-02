export type AtuacaoCategory =
  | 'Redes Sociais'
  | 'Identidade Visual'
  | 'Produtos Digitais'
  | 'Fotografia'
  | 'Design Gráfico'
  | 'Sistemas Web'
  | 'Consultoria UX/UI';

export interface CaseStudyData {
  role: string;
  year: string;
  heroSubtitle: string;
  overview: {
    context: string;
    businessProblem: string;
    goals: string[];
    roleScope: string;
    constraints: string[];
  };
  diagnosis: {
    methodology: string;
    whyThisApproach: string;
    insight: string;
    stakeholderManagement: string;
  };
  design: {
    hypothesis: string;
    discardedAlternatives: { title: string; reason: string }[];
    edgeCases: string;
    designSystem: string;
    usabilityValidation: string;
  };
  handoff: {
    engineeringCollaboration: string;
    specDocumentation: string;
    launchStrategy: string;
  };
  impact: {
    metrics: { value: string; label: string }[];
    qualitativeImpact: string;
    postMortem: string;
  };
}

export interface PortfolioItem {
  id: number;
  empresa: string;
  atuacao: AtuacaoCategory[];
  produtos: string[];
  image?: string;
  caseStudy?: CaseStudyData;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const TBD = 'A preencher.';

/**
 * Base narrativa comum aos projetos de Produtos Digitais (sites institucionais, catálogos, portais).
 * Reflete o processo padrão relatado pelo autor; cada item sobrescreve apenas o que for específico dele.
 */
const PD_BASE: CaseStudyData = {
  role: 'Design e Desenvolvimento de Site',
  year: TBD,
  heroSubtitle: TBD,
  overview: {
    context:
      'A maioria dos projetos de Produtos Digitais veio por indicação — de agências onde o autor atuava ou de conhecidos — e envolvia empresas que precisavam de presença digital: ou o primeiro site institucional, ou o redesign de um site com linguagem visual defasada.',
    businessProblem:
      'Site desatualizado ou inexistente, com uma linguagem visual que não representava mais a empresa nem transmitia a seriedade do negócio.',
    goals: [
      'Modernizar a linguagem visual e a experiência de navegação',
      'Consolidar a presença digital da empresa',
      'Refletir com clareza a proposta de valor e a identidade do negócio',
    ],
    roleScope:
      'Processo completo de design e desenvolvimento: briefing, pesquisa de referências, wireframe, criação visual, desenvolvimento e testes até a entrega — com apoio na criação de um conteúdo inicial de referência quando necessário.',
    constraints: [
      'Prazo e orçamento definidos previamente, com pouca negociação',
      'Entrega padrão em CMS (WordPress)',
      'Conteúdo final dependente da participação do cliente',
    ],
  },
  diagnosis: {
    methodology:
      'Briefing inicial, reunião de kickoff, benchmark e pesquisa de referências na área de atuação do cliente, seguidos de wireframe já com conteúdo e imagens de referência para alinhar a linguagem visual antes da criação.',
    whyThisApproach:
      'Esse processo dá ao cliente uma visão concreta do que está sendo construído, apoiada em análise real de concorrentes — o que evita retrabalho e alinha expectativas desde o início.',
    insight:
      'Identificar o que os concorrentes não oferecem e transformar isso em diferencial, seja uma função melhor, seja uma linguagem visual mais forte.',
    stakeholderManagement:
      'Relação próxima e colaborativa com o cliente: apresentação de opções com justificativa de mercado, mantendo abertura para ele redirecionar a direção, com pontos de feedback ao longo do projeto.',
  },
  design: {
    hypothesis:
      'Estruturar o site como uma narrativa linear alinhada ao objetivo central do negócio, priorizando clareza de leitura e visibilidade dos CTAs — já que a maioria desses projetos tem geração de contato ou venda como fim último.',
    discardedAlternatives: [
      {
        title: 'Conteúdo ou seções sem relação direta com o objetivo do cliente',
        reason: 'Qualquer elemento que não reforçasse o que o cliente queria comunicar foi descartado ao longo do processo.',
      },
    ],
    edgeCases:
      'Responsivo/mobile first obrigatório em todos os projetos, além de formulários com variações (contato, trabalhe conosco, ouvidoria).',
    designSystem: 'Figma como ferramenta principal (em projetos mais antigos, Adobe Photoshop e Adobe XD).',
    usabilityValidation:
      'Validação por apresentação guiada das telas ao cliente, com diagramas de layout e interação por projeto, e checagem do número de cliques necessários para completar cada fluxo.',
  },
  handoff: {
    engineeringCollaboration: 'Entrega em WordPress — padrão da maioria dos projetos da época.',
    specDocumentation: 'Dados de acesso e código-fonte entregues ao cliente (prática consolidada nos projetos mais recentes).',
    launchStrategy:
      'Publicação na hospedagem e domínio do próprio cliente, com treinamento por vídeo e/ou reunião de finalização, e suporte a dúvidas por 1 a 3 meses após a entrega.',
  },
  impact: {
    metrics: [],
    qualitativeImpact: 'Retorno positivo do cliente, sem registros de insatisfação — apenas ajustes pontuais de finalização.',
    postMortem:
      'Sem métricas formais de acompanhamento na maior parte dos casos; o foco esteve em entregar bom desempenho técnico (pontuação no Google PageSpeed).',
  },
};

type PDOverrides = {
  role?: string;
  heroSubtitle?: string;
  overview?: Partial<CaseStudyData['overview']>;
  diagnosis?: Partial<CaseStudyData['diagnosis']>;
  design?: Partial<CaseStudyData['design']>;
  handoff?: Partial<CaseStudyData['handoff']>;
  impact?: Partial<CaseStudyData['impact']>;
};

function pd(overrides: PDOverrides): CaseStudyData {
  return {
    ...PD_BASE,
    ...(overrides.role !== undefined ? { role: overrides.role } : {}),
    ...(overrides.heroSubtitle !== undefined ? { heroSubtitle: overrides.heroSubtitle } : {}),
    overview: { ...PD_BASE.overview, ...overrides.overview },
    diagnosis: { ...PD_BASE.diagnosis, ...overrides.diagnosis },
    design: { ...PD_BASE.design, ...overrides.design },
    handoff: { ...PD_BASE.handoff, ...overrides.handoff },
    impact: { ...PD_BASE.impact, ...overrides.impact },
  };
}

/**
 * Base narrativa comum aos projetos de Identidade Visual (marcas novas e aplicações sobre marcas existentes).
 */
const IV_BASE: CaseStudyData = {
  role: 'Identidade Visual',
  year: TBD,
  heroSubtitle: TBD,
  overview: {
    context:
      'Cliente típico de Identidade Visual: em grande parte empresas novas que ainda não tinham marca, buscando criar sua identidade do zero — poucos foram redesigns de marcas já consolidadas.',
    businessProblem: 'Ausência de uma identidade visual estruturada que representasse o negócio com clareza e consistência.',
    goals: [
      'Criar uma marca com significado real, conectada ao nome, ao histórico e ao momento do negócio',
      'Definir uma personalidade visual clara, alinhada ao posicionamento desejado',
      'Entregar um sistema completo, pronto para aplicação em diferentes materiais',
    ],
    roleScope: 'Criação completa da identidade visual — do conceito do símbolo ao manual de marca com aplicações gráficas e digitais.',
    constraints: [
      'Sem restrições de orçamento relevantes',
      'Processo conduzido por meio de apresentação de propostas, com ajuste de direção quando necessário',
    ],
  },
  diagnosis: {
    methodology:
      'Pesquisa de referências e concorrentes, somada à investigação do histórico da marca/nome, do momento atual da empresa e do objetivo pretendido com a nova identidade — briefing feito nas primeiras reuniões, já com esboços para captar o que ressoa com o cliente.',
    whyThisApproach:
      'Apresentar de 2 a 3 caminhos de criação, já com a personalidade de marca embutida em cada opção, permite ao cliente decidir a vertente com base no que ele imagina para o negócio dali pra frente.',
    insight: 'O símbolo funciona melhor quando carrega um significado real — histórico, pessoal ou sentimental — em vez de ser apenas decorativo.',
    stakeholderManagement:
      'Processo colaborativo de validação: o próprio cliente aponta as direções que não quer seguir, e a equipe refina a partir disso.',
  },
  design: {
    hypothesis:
      'Construir o símbolo a partir de uma referência concreta do negócio (nome, mercado, atividade), garantindo que a marca tenha significado e não seja apenas esteticamente agradável.',
    discardedAlternatives: [
      {
        title: 'Direções visuais sem conexão direta com o negócio ou o nome do cliente',
        reason: 'Descartadas nas validações — o próprio cliente aponta quando uma direção não reflete o que ele imagina para a empresa.',
      },
    ],
    edgeCases: 'Tom de marca (mais séria ou mais divertida) varia conforme o perfil do cliente; a equipe cria variantes a partir da leitura inicial do briefing.',
    designSystem: 'Sistema completo — paleta, tipografia, grid de construção do símbolo e elementos gráficos de apoio — estruturado dentro do próprio manual de identidade visual.',
    usabilityValidation: 'Validação por apresentação de caminhos ao cliente (2 a 3 opções), com ajustes guiados pelas preferências dele até fechar a direção final.',
  },
  handoff: {
    engineeringCollaboration: 'Não há etapa de desenvolvimento técnico — a colaboração nessa fase é com produção gráfica e digital para validar as aplicações da marca.',
    specDocumentation:
      'Manual de marca com cerca de 34 páginas, cobrindo desde a construção da ideia e os desenhos iniciais até a versão final da identidade.',
    launchStrategy:
      'Entrega do manual de marca completo, com aplicações prontas em materiais gráficos (caderno, calendário, agenda), digitais (redes sociais, wallpaper de celular) e brindes (canetas, garrafas, pendrive, cartão).',
  },
  impact: {
    metrics: [],
    qualitativeImpact: 'Retorno positivo dos clientes — muitos deles em sua primeira experiência criando uma identidade visual profissional para o próprio negócio.',
    postMortem:
      'Grande aprendizado sobre como o cliente pensa e quais são seus desejos reais para a marca — algumas dessas identidades seguem em uso ativo até hoje, nas empresas que vingaram.',
  },
};

function iv(overrides: PDOverrides): CaseStudyData {
  return {
    ...IV_BASE,
    ...(overrides.role !== undefined ? { role: overrides.role } : {}),
    ...(overrides.heroSubtitle !== undefined ? { heroSubtitle: overrides.heroSubtitle } : {}),
    overview: { ...IV_BASE.overview, ...overrides.overview },
    diagnosis: { ...IV_BASE.diagnosis, ...overrides.diagnosis },
    design: { ...IV_BASE.design, ...overrides.design },
    handoff: { ...IV_BASE.handoff, ...overrides.handoff },
    impact: { ...IV_BASE.impact, ...overrides.impact },
  };
}

/**
 * Base narrativa comum aos projetos de Redes Sociais (gestão contínua ou trabalhos pontuais).
 */
const RS_BASE: CaseStudyData = {
  role: 'Gestão de Redes Sociais',
  year: TBD,
  heroSubtitle: TBD,
  overview: {
    context:
      'Clientes que buscavam estabelecer ou reforçar presença no mercado digital através das redes sociais — a maioria dando os primeiros passos nesse canal.',
    businessProblem: 'Ausência de presença digital estruturada ou conteúdo que representasse o negócio de forma consistente nas redes sociais.',
    goals: [
      'Estabelecer a marca no mercado digital',
      'Gerar conteúdo consistente que mostrasse o produto/serviço real',
      'Construir uma rotina de postagem sustentável',
    ],
    roleScope:
      'Gestão completa de redes sociais: planejamento de conteúdo, captação de foto e vídeo, produção das artes e publicação, com validação do cliente antes de cada postagem.',
    constraints: [
      'Resistência da maioria dos clientes em investir em tráfego pago',
      'Frequência de postagem em torno de 3 a 4 vezes por semana, dentro dos formatos de carrossel e post único disponíveis na época',
    ],
  },
  diagnosis: {
    methodology:
      'Definição de um combo inicial de conteúdo para contas começando do zero: apresentação da marca, da estrutura física, de quem está por trás do negócio e da busca pela qualidade.',
    whyThisApproach: 'Esse combo inicial cria contexto e confiança antes de partir para conteúdo de produto/serviço específico.',
    insight: 'Mostrar o produto real — sem embelezar artificialmente — gera mais credibilidade do que uma imagem irreal que não corresponde ao que o cliente recebe.',
    stakeholderManagement:
      'Reuniões periódicas para apresentar os próximos posts e alinhar aprovação; conteúdo (incluindo vídeos) era mostrado pronto para validação do cliente antes da publicação.',
  },
  design: {
    hypothesis:
      'Construir o feed com variedade de formatos (carrosséis explicativos, posts únicos, conteúdo de eventos e promoções) girando em torno da autenticidade do produto/serviço real.',
    discardedAlternatives: [
      {
        title: 'Imagens excessivamente produzidas/idealizadas',
        reason: 'Optou-se por mostrar o produto real entregue ao cliente, evitando o efeito de "foto de propaganda" que não corresponde à realidade.',
      },
    ],
    edgeCases: 'Conteúdo educativo/técnico (como aulas ou processos) nem sempre foi explorado — em alguns casos por não ter sido solicitado pelo cliente.',
    designSystem: 'Identidade visual do feed alinhada à marca de cada cliente; formatos disponíveis na época eram carrossel e post único, antes da consolidação de reels/stories como padrão.',
    usabilityValidation: 'Validação de cada peça diretamente com o cliente antes da publicação, em reuniões de alinhamento.',
  },
  handoff: {
    engineeringCollaboration: 'Não aplicável — produção e publicação de conteúdo, sem etapa de desenvolvimento técnico.',
    specDocumentation: 'Planejamento de conteúdo e calendário de postagens compartilhado com o cliente antes da produção.',
    launchStrategy: 'Publicação direta nos perfis do cliente, seguindo a frequência combinada de postagens.',
  },
  impact: {
    metrics: [],
    qualitativeImpact: 'Feedback positivo da maioria dos clientes, geralmente relatado de forma informal (boca a boca) — sem acesso direto a métricas e analytics das contas.',
    postMortem: 'A resistência a investir em tráfego pago limitou o alcance potencial da estratégia de conteúdo na maioria dos casos.',
  },
};

function rs(overrides: PDOverrides): CaseStudyData {
  return {
    ...RS_BASE,
    ...(overrides.role !== undefined ? { role: overrides.role } : {}),
    ...(overrides.heroSubtitle !== undefined ? { heroSubtitle: overrides.heroSubtitle } : {}),
    overview: { ...RS_BASE.overview, ...overrides.overview },
    diagnosis: { ...RS_BASE.diagnosis, ...overrides.diagnosis },
    design: { ...RS_BASE.design, ...overrides.design },
    handoff: { ...RS_BASE.handoff, ...overrides.handoff },
    impact: { ...RS_BASE.impact, ...overrides.impact },
  };
}

/**
 * Base narrativa comum aos projetos de Design Gráfico (peças avulsas: catálogo, media kit, embalagem, capa).
 */
const DG_BASE: CaseStudyData = {
  role: 'Design Gráfico',
  year: TBD,
  heroSubtitle: TBD,
  overview: {
    context:
      'Trabalhos pontuais de design gráfico, muitas vezes complementando ou aplicando uma identidade visual já existente (ou criada em paralelo) sobre uma peça específica — catálogo, media kit, embalagem ou capa de livro.',
    businessProblem:
      'Necessidade de uma peça gráfica específica, bem produzida, para uso comercial ou institucional (divulgação, portfólio profissional, apresentação de produto).',
    goals: [
      'Produzir uma peça final profissional, alinhada à identidade do cliente',
      'Aproveitar bem o material fornecido pelo cliente (fotos, conteúdo, referências)',
      'Entregar em formato pronto para uso (impressão ou distribuição digital)',
    ],
    roleScope: 'Design da peça gráfica do início ao fim — estruturação, diagramação e finalização para entrega em alta qualidade.',
    constraints: [
      'Projetos pontuais, sem vínculo de gestão contínua',
      'Uso do material (fotos, conteúdo, arte) fornecido pelo próprio cliente na maioria dos casos',
    ],
  },
  diagnosis: {
    methodology: 'Levantamento do material disponível (fotos, conteúdo, identidade existente) e definição da estrutura da peça antes da diagramação.',
    whyThisApproach: 'Aproveitar o material já existente do cliente garante consistência com a identidade da marca e agiliza a entrega de projetos pontuais.',
    insight: 'Peças gráficas bem executadas em cima de fotos de qualidade e conteúdo já validado tendem a ter resultado mais rápido e satisfatório.',
    stakeholderManagement: 'Contato direto e pontual com o cliente (ou sócios) para validar estrutura e versões da peça.',
  },
  design: {
    hypothesis: 'Diagramar a peça respeitando a identidade visual já existente do cliente (ou criando uma nova quando necessário), priorizando a qualidade do material fornecido.',
    discardedAlternatives: [
      {
        title: 'Versões alternativas de diagramação/capa',
        reason: 'Nos projetos com mais liberdade criativa (como capas), foram produzidas 2 a 3 versões para o cliente escolher a que melhor representava a proposta.',
      },
    ],
    edgeCases: 'Organização de conteúdo extenso por categoria (catálogos grandes) e adequação da arte para diferentes formatos de impressão (embalagem, capa, papelaria).',
    designSystem: 'Identidade visual do próprio cliente (existente ou criada em paralelo) como base do sistema gráfico da peça.',
    usabilityValidation: 'Validação por apresentação de versões ao cliente até fechar a estrutura final.',
  },
  handoff: {
    engineeringCollaboration: 'Não aplicável — entrega de arte finalizada, sem etapa de desenvolvimento técnico.',
    specDocumentation: 'Arquivo final entregue pronto para impressão ou distribuição digital (PDF, alta resolução).',
    launchStrategy: 'Entrega direta do arquivo final ao cliente, pronto para uso comercial ou institucional.',
  },
  impact: {
    metrics: [],
    qualitativeImpact:
      'Retorno positivo dos clientes; alguns desses projetos representam marcos pessoais na trajetória (ex: primeira embalagem, primeiro catálogo, nome creditado numa capa de livro).',
    postMortem: 'Projetos pontuais e antigos, com menos detalhamento disponível hoje — mas lembrados com carinho pela variedade de formatos explorados.',
  },
};

function dg(overrides: PDOverrides): CaseStudyData {
  return {
    ...DG_BASE,
    ...(overrides.role !== undefined ? { role: overrides.role } : {}),
    ...(overrides.heroSubtitle !== undefined ? { heroSubtitle: overrides.heroSubtitle } : {}),
    overview: { ...DG_BASE.overview, ...overrides.overview },
    diagnosis: { ...DG_BASE.diagnosis, ...overrides.diagnosis },
    design: { ...DG_BASE.design, ...overrides.design },
    handoff: { ...DG_BASE.handoff, ...overrides.handoff },
    impact: { ...DG_BASE.impact, ...overrides.impact },
  };
}

/**
 * Base narrativa comum aos projetos de Sistemas Web (trabalhos como funcionário CLT em sistemas internos).
 */
const SW_BASE: CaseStudyData = {
  role: 'Design e Desenvolvimento de Interface (UX/UI)',
  year: TBD,
  heroSubtitle: TBD,
  overview: {
    context:
      'Projetos desenvolvidos como funcionário CLT, atuando na parte visual e de UX de sistemas internos — os primeiros trabalhos após a formatura.',
    businessProblem: 'Sistema interno que precisava de uma camada de interface e experiência de uso bem estruturada.',
    goals: [
      'Estruturar a interface do sistema com boa usabilidade',
      'Acompanhar a evolução do projeto de ferramentas mais antigas (Photoshop) para um fluxo de design mais moderno (Figma)',
    ],
    roleScope: 'Design de interface e UX do sistema, como parte da equipe interna da empresa.',
    constraints: [
      'Vínculo CLT, dentro da estrutura e prioridades internas da empresa',
      'Ferramental disponível evoluiu ao longo do projeto (de Photoshop para Figma)',
    ],
  },
  diagnosis: {
    methodology: 'Levantamento de requisitos internos junto ao time e às áreas envolvidas no sistema.',
    whyThisApproach: 'Como funcionário interno, o acesso direto às áreas de negócio permitia entender de perto as necessidades reais do sistema.',
    insight: 'A evolução do ferramental de design ao longo do projeto trouxe ganhos diretos de qualidade e velocidade na criação das interfaces.',
    stakeholderManagement: 'Colaboração direta com o time interno da empresa e demais áreas envolvidas no sistema.',
  },
  design: {
    hypothesis: 'Estruturar interfaces claras para sistemas internos de gestão, equilibrando usabilidade com a complexidade das regras de negócio.',
    discardedAlternatives: [
      {
        title: 'Manter o fluxo de trabalho apenas no Photoshop',
        reason: 'A migração para o Figma trouxe mais agilidade e recursos para o processo de design de interface.',
      },
    ],
    edgeCases: 'Fluxos internos de validação e regras de negócio específicas de cada sistema.',
    designSystem: 'Photoshop nos projetos mais antigos, migrando para Figma.',
    usabilityValidation: 'Validação interna com o time e as áreas envolvidas no sistema.',
  },
  handoff: {
    engineeringCollaboration: 'Colaboração direta com a equipe de desenvolvimento interna da empresa, como parte do mesmo time.',
    specDocumentation: 'Telas e fluxos entregues à equipe de desenvolvimento interna.',
    launchStrategy: 'Lançamento conduzido internamente pela empresa, como parte do processo do próprio sistema.',
  },
  impact: {
    metrics: [],
    qualitativeImpact: 'Experiência formativa como primeiro trabalho após a formatura, com aprendizado direto em ambiente profissional de sistemas.',
    postMortem: 'Marco de início de carreira em UX/UI para sistemas, logo após a graduação.',
  },
};

function sw(overrides: PDOverrides): CaseStudyData {
  return {
    ...SW_BASE,
    ...(overrides.role !== undefined ? { role: overrides.role } : {}),
    ...(overrides.heroSubtitle !== undefined ? { heroSubtitle: overrides.heroSubtitle } : {}),
    overview: { ...SW_BASE.overview, ...overrides.overview },
    diagnosis: { ...SW_BASE.diagnosis, ...overrides.diagnosis },
    design: { ...SW_BASE.design, ...overrides.design },
    handoff: { ...SW_BASE.handoff, ...overrides.handoff },
    impact: { ...SW_BASE.impact, ...overrides.impact },
  };
}

/**
 * Base narrativa comum aos projetos de Consultoria UX/UI.
 */
const UX_BASE: CaseStudyData = {
  role: 'Consultoria UX/UI',
  year: TBD,
  heroSubtitle: TBD,
  overview: {
    context: 'Consultorias pontuais para avaliar ou reestruturar a experiência digital de um negócio já existente.',
    businessProblem:
      'Falta de organização digital estruturada — seja ausência de identidade/presença online, seja necessidade de avaliação de um produto digital já existente.',
    goals: [
      'Diagnosticar os principais problemas de experiência/organização digital do cliente',
      'Apresentar recomendações claras e acionáveis',
      'Apoiar a implementação, quando dentro do escopo',
    ],
    roleScope: 'Consultoria de UX/UI, com investigação, geração de relatórios e apresentação de recomendações ao cliente.',
    constraints: ['Implementação das mudanças recomendadas, em alguns casos, ficou a cargo do time interno do cliente'],
  },
  diagnosis: {
    methodology: 'Reuniões, visitas presenciais (quando aplicável) e investigação direta do produto/negócio para levantar os principais problemas.',
    whyThisApproach: 'O contato próximo com o negócio real do cliente permite recomendações mais precisas do que uma análise remota.',
    insight: 'Muitos negócios têm potencial digital não explorado simplesmente por falta de organização e conhecimento básico de mercado digital.',
    stakeholderManagement: 'Apresentação formal de relatórios e recomendações ao cliente, com espaço para dúvidas antes da implementação.',
  },
  design: {
    hypothesis: 'Priorizar as mudanças de maior impacto para a experiência do cliente/usuário final, dentro da realidade de cada negócio.',
    discardedAlternatives: [
      {
        title: 'Recomendações fora do escopo real do cliente',
        reason: 'O foco foi sempre em recomendações acionáveis dentro da realidade e dos recursos do cliente.',
      },
    ],
    edgeCases: 'Avaliação de fluxos e telas já existentes em produtos digitais de terceiros.',
    designSystem: 'Análise em cima do sistema/identidade já existente do cliente, quando aplicável.',
    usabilityValidation: 'Relatórios de investigação e apontamentos apresentados formalmente ao cliente.',
  },
  handoff: {
    engineeringCollaboration: 'Variável — em alguns casos, o time interno do cliente ficou responsável por implementar as recomendações.',
    specDocumentation: 'Relatórios detalhados com os pontos investigados e as recomendações de mudança.',
    launchStrategy: 'Apresentação formal das recomendações ao cliente, que assume a implementação.',
  },
  impact: {
    metrics: [],
    qualitativeImpact: 'Clientes bem recebidos pelas recomendações e relatórios apresentados.',
    postMortem: 'Consultorias pontuais, sem acompanhamento direto da implementação na maioria dos casos.',
  },
};

function ux(overrides: PDOverrides): CaseStudyData {
  return {
    ...UX_BASE,
    ...(overrides.role !== undefined ? { role: overrides.role } : {}),
    ...(overrides.heroSubtitle !== undefined ? { heroSubtitle: overrides.heroSubtitle } : {}),
    overview: { ...UX_BASE.overview, ...overrides.overview },
    diagnosis: { ...UX_BASE.diagnosis, ...overrides.diagnosis },
    design: { ...UX_BASE.design, ...overrides.design },
    handoff: { ...UX_BASE.handoff, ...overrides.handoff },
    impact: { ...UX_BASE.impact, ...overrides.impact },
  };
}

/**
 * Base narrativa comum aos ensaios de Fotografia (atividade paralela, como hobby).
 */
const FT_BASE: CaseStudyData = {
  role: 'Fotografia',
  year: TBD,
  heroSubtitle: TBD,
  overview: {
    context:
      'Projetos de fotografia realizados como hobby pessoal — área que sempre gostou, incluindo aulas na faculdade e compra de equipamento próprio.',
    businessProblem: 'Necessidade de um ensaio fotográfico profissional que capturasse a linguagem visual desejada por quem seria fotografado.',
    goals: [
      'Capturar imagens alinhadas à linguagem e ao objetivo de uso de quem estava sendo fotografado',
      'Produzir um resultado que pudesse ser usado profissionalmente após o ensaio',
    ],
    roleScope: 'Ensaio fotográfico completo: planejamento, captação e entrega das fotos tratadas.',
    constraints: ['Atividade paralela, como hobby — não como frente principal de atuação profissional'],
  },
  diagnosis: {
    methodology: 'Conversa prévia para entender o estilo e a linguagem que a pessoa queria transmitir nas fotos.',
    whyThisApproach: 'Alinhar a expectativa de estilo antes do ensaio evita retrabalho e garante que o resultado sirva ao uso pretendido.',
    insight:
      'Conceitos de composição, enquadramento e narrativa visual aprendidos na fotografia acabaram influenciando diretamente a forma como você pensa layout, redes sociais e composição de cena em outras áreas do trabalho até hoje.',
    stakeholderManagement: 'Relação próxima e de confiança, já que os dois ensaios foram feitos para amigas.',
  },
  design: {
    hypothesis: 'Capturar imagens que já vinham com uma direção clara de linguagem por parte da pessoa fotografada.',
    discardedAlternatives: [
      {
        title: 'Ensaio genérico sem direção prévia',
        reason: 'Preferiu-se sempre alinhar previamente o estilo e o ambiente desejado antes da sessão.',
      },
    ],
    edgeCases: 'Adequação da composição e iluminação ao ambiente escolhido para cada ensaio.',
    designSystem: 'Equipamento próprio de fotografia, com tratamento de imagem em pós-produção.',
    usabilityValidation: 'Seleção e validação das fotos finais junto à pessoa fotografada.',
  },
  handoff: {
    engineeringCollaboration: 'Não aplicável — entrega das fotos tratadas diretamente à pessoa fotografada.',
    specDocumentation: 'Fotos entregues em alta resolução, tratadas.',
    launchStrategy: 'Entrega direta das fotos finais.',
  },
  impact: {
    metrics: [],
    qualitativeImpact: 'Resultado muito bem recebido — fotos usadas pelas duas pessoas até hoje.',
    postMortem:
      'Os dois únicos ensaios considerados realmente satisfatórios dentro dessa fase de hobby com fotografia — o aprendizado de composição, narrativa visual e cena carregou para outras áreas do trabalho (redes sociais, layout, estratégia).',
  },
};

function ft(overrides: PDOverrides): CaseStudyData {
  return {
    ...FT_BASE,
    ...(overrides.role !== undefined ? { role: overrides.role } : {}),
    ...(overrides.heroSubtitle !== undefined ? { heroSubtitle: overrides.heroSubtitle } : {}),
    overview: { ...FT_BASE.overview, ...overrides.overview },
    diagnosis: { ...FT_BASE.diagnosis, ...overrides.diagnosis },
    design: { ...FT_BASE.design, ...overrides.design },
    handoff: { ...FT_BASE.handoff, ...overrides.handoff },
    impact: { ...FT_BASE.impact, ...overrides.impact },
  };
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    empresa: 'Mr. Temaki',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
    image: '/cases/mr-temaki.png',
    caseStudy: rs({
      role: 'Gestão de Redes Sociais e Fotografia',
      heroSubtitle: 'Gestão de redes sociais para um restaurante de sushi, com produção própria de fotografia e vídeo.',
      overview: {
        context: 'Restaurante de sushi — um dos clientes de gestão mais longa e intensa, com cobertura de eventos e ações.',
        roleScope:
          'Gestão completa das redes sociais por um bom período, incluindo captação de fotos e vídeos próprios (sushi por categoria, histórico da marca, curiosidades, estrutura do rodízio) e cobertura de eventos.',
      },
      design: {
        hypothesis:
          'Explorar categorias de sushi, histórico e curiosidades da marca, além de carrosséis sobre a estrutura do restaurante e o funcionamento do rodízio.',
      },
      handoff: {
        launchStrategy: 'Frequência de cerca de 4 postagens por semana.',
      },
      impact: {
        qualitativeImpact: 'Um dos poucos clientes que investiu em tráfego pago — período de crescimento de vendas percebido.',
      },
    }),
  },
  {
    id: 2,
    empresa: 'Santa Cris',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
    caseStudy: rs({
      heroSubtitle: 'Publicações iniciais em redes sociais, como proposta pontual.',
      overview: {
        context: 'Trabalho pontual — apenas uma ou duas publicações iniciais, como proposta, sem contrato de gestão mensal.',
        roleScope: 'Produção de conteúdo inicial pontual, sem gestão contínua.',
      },
    }),
  },
  {
    id: 3,
    empresa: 'Alqafiltros',
    atuacao: ['Redes Sociais', 'Identidade Visual'],
    produtos: ['Gestão de Redes Sociais', 'Marca e Identidade Visual'],
    image: '/cases/alqafiltros.png',
    caseStudy: rs({
      role: 'Gestão de Redes Sociais (projeto experimental)',
      heroSubtitle: 'Gestão de redes sociais para uma empresa de filtros de água, com foco em produtos.',
      overview: {
        context: 'Projeto que começou como teste/experimental de redes sociais, com trabalhos pontuais complementares ao longo do tempo.',
        roleScope: 'Postagens focadas em produtos — filtros de água e água ionizada.',
      },
    }),
  },
  {
    id: 4,
    empresa: 'Sopa no Pote',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
    caseStudy: rs({
      heroSubtitle: 'Publicações iniciais em redes sociais, como proposta pontual.',
      overview: {
        context: 'Trabalho pontual — apenas uma ou duas publicações iniciais, como proposta, sem contrato de gestão mensal.',
        roleScope: 'Produção de conteúdo inicial pontual, sem gestão contínua.',
      },
    }),
  },
  {
    id: 5,
    empresa: 'Esfihaiolo',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
    caseStudy: rs({
      role: 'Gestão de Redes Sociais e Fotografia',
      heroSubtitle: 'Gestão de redes sociais para uma esfiharia artesanal, com produção própria de fotografia e vídeo.',
      overview: {
        context: 'Esfiharia artesanal — cliente de gestão longa e intensa, junto com Mr. Temaki e Aquarium Scuba.',
        roleScope: 'Gestão completa das redes sociais, mostrando o processo artesanal e imagens de cada tipo de esfiha.',
      },
      impact: {
        qualitativeImpact: 'Um dos poucos clientes que investiu em tráfego pago, com bom desempenho.',
      },
    }),
  },
  {
    id: 6,
    empresa: 'Refrisul',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
    image: '/cases/refrisul.png',
    caseStudy: rs({
      heroSubtitle: 'Publicações iniciais em redes sociais, como proposta pontual.',
      overview: {
        context: 'Trabalho pontual — apenas uma ou duas publicações iniciais, como proposta, sem contrato de gestão mensal.',
        roleScope: 'Produção de conteúdo inicial pontual, sem gestão contínua.',
      },
    }),
  },
  {
    id: 7,
    empresa: 'Aquarium Scuba',
    atuacao: ['Redes Sociais', 'Identidade Visual'],
    produtos: ['Gestão de Redes Sociais', 'Identidade Visual'],
    image: '/cases/aquarium-scuba.png',
    caseStudy: rs({
      role: 'Gestão de Redes Sociais e Fotografia',
      heroSubtitle: 'Gestão de redes sociais para uma escola de mergulho.',
      overview: {
        context: 'Escola de mergulho — cliente de gestão contínua, com conteúdo focado nas aulas oferecidas.',
      },
      design: {
        edgeCases:
          'Conteúdo educativo sobre as aulas não foi explorado o suficiente — lacuna reconhecida, já que não foi solicitado um conteúdo mais técnico na época.',
      },
      impact: {
        postMortem: 'Autoavaliação: faltou conteúdo mais explicativo sobre as aulas — hoje a abordagem seria diferente.',
      },
    }),
  },
  {
    id: 8,
    empresa: 'Brava Sport',
    atuacao: ['Produtos Digitais', 'Redes Sociais', 'Identidade Visual', 'Design Gráfico'],
    produtos: ['Site Institucional', 'Redes Sociais', 'Identidade Visual', 'Adesivos e Posters'],
    image: '/cases/brava-sport.png',
    caseStudy: pd({
      role: 'Design, Desenvolvimento e Gestão de Redes Sociais',
      heroSubtitle: 'Redesign de site e gestão de redes sociais para uma academia, alinhados à nova identidade visual da marca.',
      overview: {
        context:
          'Projeto que chegou por indicação de uma amiga que trabalha na Brava Sport até hoje. A academia havia acabado de renovar sua identidade visual e precisava alinhar site e redes sociais a essa nova linguagem.',
        businessProblem: 'Site e redes sociais desalinhados com a identidade visual recém-criada da academia.',
        goals: [
          'Conectar a nova identidade visual ao site institucional',
          'Apresentar modalidades, horários, profissionais e estrutura logo na primeira dobra',
          'Manter presença ativa e consistente nas redes sociais',
        ],
        roleScope:
          'Redesign completo do site, gestão contínua de redes sociais e produção de peças gráficas (adesivos e outras mídias) ao longo de cerca de três anos de parceria.',
      },
      diagnosis: {
        stakeholderManagement:
          'Relação de longo prazo, mas com desafio recorrente: o cliente tinha retorno lento nas validações, o que por vezes fazia definições se perderem ao longo do tempo.',
      },
      design: {
        hypothesis:
          'Contar a história da academia logo na entrada do site — identidade visual, modalidades, horários e estrutura — gerando atrativo imediato para quem busca se matricular.',
      },
      handoff: {
        engineeringCollaboration:
          'Site entregue em WordPress, no período de forte adoção da plataforma pela equipe — hoje o mesmo projeto seria construído em código próprio.',
      },
      impact: {
        qualitativeImpact: 'Site e redes sociais ficaram em uso por um bom período.',
        postMortem:
          'O site foi posteriormente remodelado por outro profissional, e a gestão de redes sociais repassada a outro prestador de serviço — ciclo natural após anos de parceria.',
      },
    }),
  },
  {
    id: 9,
    empresa: 'Conergia',
    atuacao: ['Produtos Digitais', 'Redes Sociais', 'Identidade Visual'],
    produtos: ['Site Institucional', 'Redes Sociais', 'Identidade Visual'],
    image: '/cases/conergia.png',
    caseStudy: pd({
      role: 'Identidade Visual e Desenvolvimento de Site',
      heroSubtitle: 'Identidade visual e site institucional criados do zero para consolidar a presença digital da empresa.',
      overview: {
        context: 'Projeto que veio por indicação de um amigo.',
        roleScope:
          'Criação da identidade visual completa e desenvolvimento do site institucional. A gestão de redes sociais não fez parte do escopo contratado, mas alguns posts de aplicação da nova identidade foram produzidos como parte da entrega de branding.',
      },
      design: {
        hypothesis:
          'Construir uma identidade visual forte o suficiente para guiar sozinha a linguagem do site, com aplicação consistente em todas as páginas.',
      },
      handoff: {
        launchStrategy: 'Site publicado no domínio próprio do cliente.',
      },
      impact: {
        qualitativeImpact: 'Cliente satisfeito com o resultado; site ficou em uso por bastante tempo.',
        postMortem: 'Não há confirmação se a empresa segue ativa atualmente.',
      },
    }),
  },
  {
    id: 10,
    empresa: 'Massagear para Curar',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
    caseStudy: rs({
      heroSubtitle: 'Publicações iniciais em redes sociais, como proposta pontual.',
      overview: {
        context: 'Trabalho pontual — apenas uma ou duas publicações iniciais, como proposta, sem contrato de gestão mensal.',
        roleScope: 'Produção de conteúdo inicial pontual, sem gestão contínua.',
      },
    }),
  },
  {
    id: 11,
    empresa: 'Alleane Calazans',
    atuacao: ['Fotografia'],
    produtos: ['Ensaio Fotográfico Pessoal'],
    caseStudy: ft({
      heroSubtitle: 'Ensaio fotográfico pessoal para uma modelo, com direção visual definida pela própria cliente.',
      overview: {
        context: 'Cliente já era modelo e tinha noção clara da linguagem, do tipo de fotos e dos ambientes que queria.',
      },
    }),
  },
  {
    id: 12,
    empresa: 'Nadia Saldanha',
    atuacao: ['Fotografia'],
    produtos: ['Ensaio Fotográfico Pessoal'],
    caseStudy: ft({
      heroSubtitle: 'Ensaio fotográfico pessoal para uma apresentadora de TV.',
      overview: {
        context: 'Cliente é apresentadora de TV até hoje; confiava bastante no resultado das fotos.',
      },
      impact: {
        qualitativeImpact: 'Algumas das fotos seguem em uso até hoje pela cliente.',
      },
    }),
  },
  {
    id: 13,
    empresa: 'Icon',
    atuacao: ['Sistemas Web', 'Produtos Digitais', 'Identidade Visual', 'Fotografia'],
    produtos: ['Sistema SGDI', 'Site Institucional', 'Identidade Visual', 'Fotografia de Eventos'],
    caseStudy: sw({
      heroSubtitle: 'Design de interface para sistema de gestão ligado à Lei de Informática, com escopo estendido a identidade visual e site.',
      overview: {
        context:
          'Trabalho como funcionário CLT na Icon — sistema de gerenciamento (SGDI) ligado à Lei de Informática, controlando dinheiro de projetos internos, validações e captação de receita.',
        roleScope:
          'Design de interface do sistema, iniciado no Photoshop e migrado para Figma, além de identidade visual, site institucional e cobertura fotográfica de eventos de divulgação do sistema.',
      },
      impact: {
        postMortem: 'Cerca de 1 ano e meio dedicado ao projeto, que foi concluído — sem confirmação se segue em uso pelo cliente hoje.',
      },
    }),
  },
  {
    id: 14,
    empresa: 'Orla Bardott',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade visual estilosa para um ateliê de arte.',
      overview: {
        context: 'Ateliê de arte — cliente com contato mais direto e presente ao longo de toda a construção da marca.',
      },
      design: {
        hypothesis: 'Construir uma marca estilosa, alinhada ao universo artístico do ateliê.',
      },
      impact: {
        qualitativeImpact: 'Marca segue em uso ativo.',
      },
    }),
  },
  {
    id: 15,
    empresa: 'Tecmaster',
    atuacao: ['Produtos Digitais', 'Identidade Visual'],
    produtos: ['Site Institucional', 'Marca e Identidade Visual'],
    caseStudy: pd({
      role: 'Identidade Visual e Desenvolvimento de Site',
      heroSubtitle: 'Identidade visual completa e site institucional para uma indústria, com apresentação presencial do projeto na fábrica.',
      overview: {
        context:
          'Cliente com duas empresas do setor industrial (Tecmaster e MMEngenharia). O projeto incluiu visitas presenciais às fábricas para apresentação do site.',
        roleScope:
          'Criação da identidade visual completa (símbolo, logotipo e sistema) e desenvolvimento do site institucional em WordPress.',
      },
      handoff: {
        launchStrategy: 'Apresentação do projeto realizada presencialmente na fábrica do cliente, além dos processos padrão de entrega.',
      },
      impact: {
        qualitativeImpact: 'Entrega concluída e usada por um bom tempo.',
        postMortem: 'Ainda não há confirmação se a empresa segue ativa atualmente.',
      },
    }),
  },
  {
    id: 16,
    empresa: 'Grupo Conecta',
    atuacao: ['Consultoria UX/UI', 'Produtos Digitais', 'Identidade Visual'],
    produtos: ['Design de Interfaces (UI)', 'Site Institucional', 'Identidade Visual'],
    caseStudy: ux({
      heroSubtitle: 'Consultoria completa de organização digital para um negócio familiar.',
      overview: {
        context:
          'Negócio familiar (marido e mulher) sem organização digital — sem identidade corporativa, sem noção de redes sociais/impulsionamento, sem saber vender online.',
        roleScope:
          'Escopo amplo: desenvolvimento de 3 sites, identidade visual completa, aplicação física da marca (loja e escritório) e apoio na apresentação de vendas dos produtos. Envolveu diversas reuniões e visitas presenciais à loja.',
      },
      handoff: {
        engineeringCollaboration: 'Acompanhamento direto e contínuo do cliente ao longo de todo o processo, incluindo visitas físicas à loja.',
      },
    }),
  },
  {
    id: 17,
    empresa: 'Yrlana Arquitetura',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Marca pessoal para uma arquiteta, construída a partir das linhas técnicas de desenho CAD.',
      overview: {
        context: 'Marca pessoal de uma arquiteta.',
      },
      design: {
        hypothesis:
          'O símbolo (um "Y") foi construído a partir das linhas de desenho técnico (CAD), remetendo diretamente à área de atuação dela.',
      },
      impact: {
        qualitativeImpact: 'Cliente adorou o resultado e usa a marca até hoje — simples, mas muito utilizada.',
      },
    }),
  },
  {
    id: 18,
    empresa: 'Shantiyog',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade intimista para um espaço de mantras e práticas holísticas.',
      overview: {
        context: 'Projeto de uma amiga que estava abrindo um espaço de mantras/práticas holísticas.',
      },
      design: {
        hypothesis: 'Marca intimista, com um símbolo mais forte e expressivo do que o próprio nome escrito.',
      },
    }),
  },
  {
    id: 19,
    empresa: 'PSMX',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade visual tecnológica para uma empresa do grupo de importação química e industrial.',
      overview: {
        context: 'Uma das empresas de um mesmo grupo cliente, que trabalha com importação de produtos químicos e maquinário.',
      },
      design: {
        hypothesis: 'Pegada tecnológica, moderna e dinâmica, alinhada às demais marcas do grupo.',
      },
    }),
  },
  {
    id: 20,
    empresa: 'Lifeauto',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade moderna e minimalista para um aplicativo veicular.',
      overview: {
        context: 'Aplicativo veicular de um amigo, ainda ativo hoje.',
      },
      design: {
        hypothesis: 'Marca moderna e minimalista, construída com poucos elementos simbólicos.',
      },
    }),
  },
  {
    id: 21,
    empresa: 'Ippax Ceramics',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Aplicação de identidade tecnológica para uma empresa do grupo de importação química e industrial.',
      overview: {
        context:
          'Uma das empresas de um grupo cliente que já possuía marca — trabalho de aplicação da identidade sobre uma marca existente, no ramo de importação de produtos químicos e maquinário.',
        roleScope: 'Aplicação da identidade visual já existente, em vez de criação do zero.',
      },
      design: {
        hypothesis: 'Pegada tecnológica, moderna e dinâmica, alinhada às demais marcas do grupo.',
      },
    }),
  },
  {
    id: 22,
    empresa: 'Ippax Trading Group',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Aplicação de identidade tecnológica para uma empresa do grupo de importação química e industrial.',
      overview: {
        context:
          'Uma das empresas de um grupo cliente que já possuía marca — trabalho de aplicação da identidade sobre uma marca existente, no ramo de importação de produtos químicos e maquinário.',
        roleScope: 'Aplicação da identidade visual já existente, em vez de criação do zero.',
      },
      design: {
        hypothesis: 'Pegada tecnológica, moderna e dinâmica, alinhada às demais marcas do grupo.',
      },
    }),
  },
  {
    id: 23,
    empresa: 'MMEngenharia',
    atuacao: ['Produtos Digitais', 'Identidade Visual'],
    produtos: ['Site Institucional', 'Identidade Visual'],
    caseStudy: pd({
      role: 'Identidade Visual e Desenvolvimento de Site',
      heroSubtitle: 'Identidade visual completa e site institucional para uma indústria do setor de engenharia.',
      overview: {
        context:
          'Segunda empresa do mesmo cliente do Tecmaster, também do setor industrial — projeto conduzido em paralelo, com visita presencial à fábrica.',
        roleScope:
          'Criação da identidade visual completa (símbolo, logotipo e sistema) e desenvolvimento do site institucional em WordPress.',
      },
      handoff: {
        launchStrategy: 'Apresentação do projeto realizada presencialmente na fábrica do cliente, além dos processos padrão de entrega.',
      },
      impact: {
        qualitativeImpact: 'Entrega concluída e usada por um bom tempo.',
        postMortem: 'Ainda não há confirmação se a empresa segue ativa atualmente.',
      },
    }),
  },
  {
    id: 24,
    empresa: 'Aurora',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade intimista para uma clínica de inseminação artificial.',
      overview: {
        context: 'Grupo de médicos especializado em inseminação artificial.',
      },
      design: {
        hypothesis: 'Marca mais original e intimista, com temática de maternidade e nascimento.',
      },
    }),
  },
  {
    id: 25,
    empresa: 'Betech Group',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade tecnológica para uma empresa de metalurgia e usinagem de peças customizadas.',
      overview: {
        context:
          'Empresa de metalurgia/mecânica cuja fábrica foi visitada pessoalmente — construção de peças customizadas para o Distrito Industrial, usando CAD e modelagem 3D.',
        roleScope: 'Aplicação da identidade visual sobre uma marca já existente.',
      },
      design: {
        hypothesis: 'Pegada tecnológica, moderna e dinâmica.',
      },
    }),
  },
  {
    id: 26,
    empresa: 'Burgus',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade visual para um hub de coworking no bairro Coroado, em Manaus.',
      overview: {
        context:
          'Coworking com salas para alugar a profissionais que precisavam de endereço comercial e fiscal, no bairro Coroado, em Manaus.',
      },
      design: {
        hypothesis: 'Pegada tecnológica e moderna, alinhada ao conceito de espaço compartilhado de trabalho.',
      },
    }),
  },
  {
    id: 27,
    empresa: 'Doce Mel',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade visual para uma marca de doces caseiros.',
      overview: {
        context: 'Marca de doces caseiros, feitos pelo marido de uma amiga sua.',
        roleScope: 'Aplicação da identidade visual sobre uma marca já existente.',
      },
    }),
  },
  {
    id: 28,
    empresa: 'ELSX',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade visual tecnológica para uma empresa do grupo de importação química e industrial.',
      overview: {
        context: 'Uma das empresas de um mesmo grupo cliente, que trabalha com importação de produtos químicos e maquinário.',
      },
      design: {
        hypothesis: 'Pegada tecnológica, moderna e dinâmica, alinhada às demais marcas do grupo.',
      },
    }),
  },
  {
    id: 29,
    empresa: 'Hit Spoiler',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
    caseStudy: iv({
      heroSubtitle: 'Identidade visual para uma tentativa de portal de notícias de entretenimento.',
      overview: {
        context:
          'Projeto pensado como portal de notícias de entretenimento; a iniciativa não avançou, mas a logo foi criada por completo.',
      },
      impact: {
        postMortem: 'O site/portal não chegou a sair do papel, mas a identidade visual foi finalizada por inteiro.',
      },
    }),
  },
  {
    id: 30,
    empresa: 'Grupo Tapajós',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Design e Desenvolvimento (projeto interno)',
      heroSubtitle: 'Redesign do site institucional durante o período como integrante do time interno da empresa.',
      overview: {
        context: 'Projeto tocado enquanto era funcionário do Grupo Tapajós, durante um período de um ano na empresa.',
        roleScope: 'Redesign completo do site institucional, conduzido praticamente a duas pessoas.',
      },
      diagnosis: {
        stakeholderManagement:
          'Foi preciso convencer a empresa a arriscar mudar o site vigente para uma linguagem mais moderna e minimalista — o anterior estava bastante datado.',
      },
      impact: {
        qualitativeImpact: 'Site publicado e ainda no ar até hoje, sem alterações desde então.',
        postMortem:
          'Hoje o site já carece de atualização e seria construído com outro formato/abordagem, mas segue como um projeto marcante da trajetória.',
      },
    }),
  },
  {
    id: 31,
    empresa: 'M2Smart',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Identidade Visual e Desenvolvimento de Site',
      heroSubtitle: 'Site institucional enxuto para uma consultoria em fase de abertura.',
      overview: {
        context: 'Empresa de um amigo que estava abrindo uma consultoria.',
        roleScope:
          'Site simples de duas páginas (Sobre e Contato) e criação da identidade visual. Conteúdo já veio pronto do cliente, apenas aplicado ao layout.',
      },
      handoff: {
        engineeringCollaboration: 'Entregue em WordPress.',
      },
      impact: {
        postMortem: 'Não há confirmação se o negócio vingou.',
      },
    }),
  },
  {
    id: 32,
    empresa: 'MasterHouse',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      heroSubtitle: 'Site institucional com integração de API para uma plataforma de venda de cursos.',
      overview: {
        context: 'Cliente indicado por um amigo, que vendia cursos e trouxe o conteúdo já estruturado em PDF.',
        roleScope: 'Site com várias páginas e integração com a API do cliente para gestão dos cursos.',
      },
      design: {
        edgeCases: 'Integração com API própria do cliente para venda de cursos, além do responsivo padrão.',
      },
      impact: {
        qualitativeImpact: 'Projeto guardado até hoje pela equipe como referência técnica.',
      },
    }),
  },
  {
    id: 33,
    empresa: 'Sidi Telecom',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      heroSubtitle: 'Site institucional para uma empresa de internet corporativa.',
      overview: {
        context:
          'Indicação do mesmo amigo que trouxe o projeto MasterHouse. Empresa do ramo de internet para empresas.',
        roleScope:
          'Conteúdo já veio definido pelo cliente; layout criado a partir de pesquisa de referências, incluindo um site de referência específico usado como base.',
      },
    }),
  },
  {
    id: 34,
    empresa: 'Duarte Comunicação',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Catálogo'],
    caseStudy: pd({
      role: 'Design e Desenvolvimento de Site Catálogo',
      heroSubtitle: 'Site catálogo para pedidos customizados de uma gráfica especializada em comunicação e eventos.',
      overview: {
        context: 'Cliente do ramo de comunicação, eventos e produção gráfica/criativa.',
        roleScope: 'Site em formato catálogo para pedidos customizados, entregue em WordPress.',
      },
      impact: {
        qualitativeImpact: 'Site segue ativo até hoje.',
        postMortem:
          'O cliente pretende futuramente migrar para um e-commerce completo em código próprio — projeto ainda não realizado.',
      },
    }),
  },
  {
    id: 35,
    empresa: 'Cermam',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      heroSubtitle: 'Redesign de site institucional, migrado posteriormente de WordPress para código próprio.',
      overview: {
        context:
          'Indicação do mesmo amigo dos projetos Tecmaster/MasterHouse/Sidi Telecom. Cliente já tinha um site, que foi redesenhado.',
      },
      handoff: {
        engineeringCollaboration: 'Entregue inicialmente em WordPress, depois migrado para código próprio.',
      },
    }),
  },
  {
    id: 36,
    empresa: 'Portal Tucumã',
    atuacao: ['Produtos Digitais'],
    produtos: ['Portal de Notícias'],
    caseStudy: pd({
      role: 'Estruturação de Componentes e Desenvolvimento',
      heroSubtitle: 'Estruturação de componentes de um portal de notícias regional, com foco em performance no Google.',
      overview: {
        context:
          'Cliente que hoje não é mais ativo. A identidade visual do portal foi criada por outro profissional contratado pelo cliente — o trabalho aqui foi estruturar a experiência do portal em cima dela.',
        roleScope:
          'Estruturação dos componentes de visualização de notícias (hierarquia editorial, layout de categorias) em WordPress, a partir da identidade já definida.',
      },
      diagnosis: {
        methodology:
          'Pesquisa de referência em portais de grande porte (Globo, Veja, Folha de S.Paulo) para definir a melhor forma de exibição das notícias, com foco em bom posicionamento no Google.',
      },
    }),
  },
  {
    id: 37,
    empresa: 'Noticias Mais360',
    atuacao: ['Produtos Digitais'],
    produtos: ['Portal de Notícias'],
    caseStudy: pd({
      role: 'Estruturação de Componentes e Desenvolvimento',
      heroSubtitle: 'Portal de notícias estruturado a partir do modelo do Portal Tucumã, para o mesmo grupo de comunicação.',
      overview: {
        context: 'Mesmo cliente do Portal Tucumã — o Notícias Mais360 é praticamente uma cópia estrutural desse primeiro portal.',
        roleScope:
          'Estruturação dos componentes de visualização de notícias (hierarquia editorial, layout de categorias) em WordPress, a partir da identidade já definida.',
      },
      diagnosis: {
        methodology:
          'Pesquisa de referência em portais de grande porte (Globo, Veja, Folha de S.Paulo) para definir a melhor forma de exibição das notícias, com foco em bom posicionamento no Google.',
      },
    }),
  },
  {
    id: 38,
    empresa: 'Ws Agencia',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      heroSubtitle: 'Site institucional apresentando a agência, seus objetivos e equipe.',
      overview: {
        context: 'Cliente do Rio de Janeiro, com relação de trabalho contínua até hoje.',
        roleScope: 'Site institucional sobre a própria agência: objetivos e equipe.',
      },
      impact: {
        qualitativeImpact: 'Site segue funcional, com a parceria de trabalho ativa até hoje.',
      },
    }),
  },
  {
    id: 39,
    empresa: 'Concerto Amazonico',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Design e Desenvolvimento de Site (projeto colaborativo)',
      heroSubtitle: 'Landing page de um evento cultural, com forte identidade fotográfica e regional.',
      overview: {
        context: 'Site para divulgação de um evento, feito sem remuneração, mas com bastante liberdade artística.',
        roleScope: 'Landing page com uso intenso de fotografia e um conceito visual bem regional.',
      },
      diagnosis: {
        whyThisApproach:
          'A liberdade criativa concedida pelo cliente permitiu explorar uma linguagem visual mais autoral do que o padrão institucional.',
      },
      impact: {
        qualitativeImpact: 'Projeto guardado até hoje como referência de portfólio.',
      },
    }),
  },
  {
    id: 40,
    empresa: 'De Carona',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Design e Desenvolvimento Full-stack',
      heroSubtitle: 'Sistema de agendamento de caronas para eventos, desenvolvido para o TCC de uma amiga.',
      overview: {
        context: 'Projeto para o trabalho de conclusão de curso (TCC) de uma amiga.',
        businessProblem:
          'Precisava de uma plataforma funcional para apresentação acadêmica, com o conceito de caronas compartilhadas para eventos amazônicos — numa época anterior à popularização de apps como o Uber.',
        roleScope:
          'Além do design, desenvolvimento completo do sistema de agendamento e hospedagem em servidor próprio para a apresentação.',
      },
      handoff: {
        engineeringCollaboration: 'Hospedado em servidor próprio da equipe, especificamente para a apresentação acadêmica.',
      },
      impact: {
        qualitativeImpact: 'Cumpriu seu papel de apoiar a apresentação do TCC.',
      },
    }),
  },
  {
    id: 41,
    empresa: 'Ianomamir',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Catálogo'],
    caseStudy: pd({
      role: 'Desenvolvimento de Site (customização WordPress)',
      heroSubtitle: 'Site de catálogo de pedidos para uma marca de peças em resina.',
      overview: {
        context: 'Cliente é uma amiga que abriu uma empresa de peças de resina.',
        roleScope:
          'Site funcional focado em catálogo de pedidos, sem venda direta — a cliente queria apenas registrar pedidos, não processar pagamento pelo site. A identidade visual já existia (criada pela própria cliente); o trabalho foi de customização de WordPress sobre essa marca.',
      },
    }),
  },
  {
    id: 42,
    empresa: 'Indicai',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Redesign de Sistema',
      heroSubtitle: 'Redesign de sistema para um cliente recorrente do setor automotivo.',
      overview: {
        context:
          'Projeto de um cliente recorrente (Gabriel), que também trouxe os projetos Brasil Truck, Connecta Car, DokDEtran e Security Assistencia.',
        roleScope: 'Redesign de um sistema (não apenas site) — função exata do sistema não documentada com precisão.',
      },
    }),
  },
  {
    id: 43,
    empresa: 'As Pencas',
    atuacao: ['Produtos Digitais'],
    produtos: ['E-commerce (Loja Virtual)'],
    caseStudy: pd({
      role: 'Identidade Visual, Design e Desenvolvimento de E-commerce',
      heroSubtitle: 'Identidade visual e e-commerce construídos do zero em WordPress.',
      overview: {
        context: 'Projeto que veio por indicação da Ws Agencia.',
        roleScope: 'Criação completa: logotipo, identidade visual e loja virtual (e-commerce) em WordPress.',
      },
      design: {
        discardedAlternatives: [
          {
            title: 'Plataforma de e-commerce pronta',
            reason:
              'A escolha inicial foi construir a loja em WordPress para manter controle total sobre a identidade visual, mesmo sendo tecnicamente mais trabalhoso.',
          },
        ],
      },
      impact: {
        qualitativeImpact: 'Tecnicamente o projeto funcionou bem e foi um desafio interessante de construir.',
        postMortem:
          'Poucos meses após o lançamento, o cliente descontinuou a solução por não gostar do formato de e-commerce em WordPress, migrando para uma plataforma online pronta — o que descaracterizou a identidade visual criada. Mesmo assim, segue como um dos projetos mais lembrados.',
      },
    }),
  },
  {
    id: 44,
    empresa: 'Brasil Truck',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      heroSubtitle: 'Site institucional para uma empresa do setor de caminhões.',
      overview: {
        context: 'Projeto do cliente recorrente Gabriel (mesmo do Indicai, Connecta Car, DokDEtran e Security Assistencia).',
        roleScope: 'Site institucional construído do zero, focado em apresentar a estrutura da empresa.',
      },
    }),
  },
  {
    id: 45,
    empresa: 'Clinica Recanto PSI',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Manutenção e Redesign de Site',
      heroSubtitle: 'Manutenção e redesign pontual de site abandonado pelo criador original.',
      overview: {
        context: 'Projeto que veio via Ws Agencia. Diferente da maioria, não foi um redesign completo.',
        roleScope:
          'Trabalho de manutenção de um site em WordPress cujo criador original havia parado de dar suporte, incluindo correções e redesign pontual de algumas páginas.',
      },
    }),
  },
  {
    id: 46,
    empresa: 'Connecta Car',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      heroSubtitle: 'Site institucional para uma empresa de aluguel de veículos.',
      overview: {
        context: 'Projeto do cliente recorrente Gabriel.',
        roleScope: 'Site institucional para empresa de aluguel de veículos, construído do zero.',
      },
    }),
  },
  {
    id: 47,
    empresa: 'Delirio Tropical',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Redesign de Site',
      heroSubtitle: 'Redesign de site institucional para uma agência, com evolução posterior para código próprio.',
      overview: {
        context: 'Projeto que veio por indicação da Ws Agencia.',
      },
      handoff: {
        engineeringCollaboration: 'Entregue inicialmente em WordPress, migrado depois para código próprio.',
      },
    }),
  },
  {
    id: 48,
    empresa: 'DokDEtran',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Redesign de Site',
      heroSubtitle: 'Redesign de site institucional para uma empresa de serviços de despachante.',
      overview: {
        context:
          'Projeto do cliente recorrente Gabriel — empresa relacionada a placas, seguros e serviços de despachante.',
        roleScope: 'Redesign de site institucional, com conteúdo já fornecido pelo cliente.',
      },
      impact: {
        qualitativeImpact: 'Site segue funcional até hoje.',
      },
    }),
  },
  {
    id: 49,
    empresa: 'Placas Detran',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      role: 'Redesign de Site',
      heroSubtitle: 'Redesign de site institucional para uma empresa de serviços veiculares.',
      overview: {
        context: 'Projeto do cliente recorrente Gabriel, mesmo segmento do DokDEtran.',
        roleScope: 'Redesign de site institucional, com conteúdo já fornecido pelo cliente.',
      },
    }),
  },
  {
    id: 50,
    empresa: 'Security Assistencia',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
    caseStudy: pd({
      heroSubtitle: 'Site institucional para uma empresa de seguros veiculares.',
      overview: {
        context: 'Projeto do cliente recorrente Gabriel (mesmo do Brasil Truck), do ramo de seguros veiculares.',
      },
    }),
  },
  {
    id: 51,
    empresa: 'RD Alimentos',
    atuacao: ['Produtos Digitais', 'Design Gráfico'],
    produtos: ['Site Catálogo', 'Catálogo Impresso e Digital'],
    caseStudy: pd({
      role: 'Design Gráfico, Design e Desenvolvimento de Site',
      heroSubtitle: 'Reformulação completa do catálogo (impresso para digital) e redesign do site institucional.',
      overview: {
        context: 'Projeto que veio por indicação do Robertson, de Curitiba.',
        businessProblem: 'Catálogo impresso desatualizado e site institucional que precisava de reformulação.',
        roleScope:
          'Reformulação completa do catálogo impresso em versão digital, além do redesign do site — entregue em WordPress, com uma versão adicional em código próprio deixada como base para uma futura migração para e-commerce.',
      },
      handoff: {
        engineeringCollaboration: 'Entregue em WordPress, com uma versão em código próprio preparada como alternativa/base futura.',
      },
      impact: {
        qualitativeImpact: 'Cliente gostou muito do site e do catálogo; a solução segue em vigor até hoje.',
      },
    }),
  },
  {
    id: 52,
    empresa: 'Quest',
    atuacao: ['Sistemas Web'],
    produtos: ['Sistema E-learn (LMS)'],
    caseStudy: sw({
      heroSubtitle: 'Primeiras interfaces de um sistema de e-learning (LMS), já com fluxo de trabalho em Figma.',
      overview: {
        context: 'Trabalho como funcionário CLT na Quest — projeto mais online, já com Figma como ferramenta desde o início.',
        roleScope: 'Desenvolvimento das primeiras interfaces do sistema E-learn (LMS).',
      },
      impact: {
        postMortem: 'Projeto foi posteriormente descontinuado (segundo o que você acredita, sem confirmação total).',
      },
    }),
  },
  {
    id: 53,
    empresa: 'PetLove',
    atuacao: ['Consultoria UX/UI'],
    produtos: ['Design de Interfaces (UI) para Sistema'],
    caseStudy: ux({
      heroSubtitle: 'Avaliação de UX de um aplicativo existente, com entrega de relatórios de recomendação.',
      overview: {
        context: 'Cliente já tinha logo e produto; pediu avaliação do design do aplicativo existente.',
        roleScope: 'Investigação e geração de relatórios sobre pontos de melhoria do aplicativo, apresentados formalmente ao cliente.',
      },
      handoff: {
        engineeringCollaboration: 'Implementação das mudanças recomendadas ficou a cargo do time interno do cliente.',
      },
    }),
  },
  {
    id: 54,
    empresa: 'Suanne Mauroka',
    atuacao: ['Design Gráfico'],
    produtos: ['Media Kit Profissional'],
    caseStudy: dg({
      heroSubtitle: 'Redesign de media kit profissional com fotos em alta qualidade.',
      overview: {
        context: 'Cliente já tinha um modelo de media kit e pediu redesign.',
        roleScope:
          'Redesign completo do media kit, reaproveitando fotos em alta qualidade enviadas pela cliente e o conteúdo novo, trabalhando em cima dos elementos da identidade que ela já tinha.',
      },
    }),
  },
  {
    id: 55,
    empresa: 'Quimifix',
    atuacao: ['Design Gráfico'],
    produtos: ['Catálogo de Produtos'],
    caseStudy: dg({
      heroSubtitle: 'Primeiro catálogo de produtos criado — catálogo extenso de produtos químicos.',
      overview: {
        context:
          'Projeto com um amigo (hoje sem contato); catálogo de produtos químicos com cerca de 80 páginas, organizado por categoria — foi o primeiro catálogo da sua trajetória.',
      },
    }),
  },
  {
    id: 56,
    empresa: 'Leliane Picanço',
    atuacao: ['Design Gráfico'],
    produtos: ['Design de Capa de Livro'],
    caseStudy: dg({
      heroSubtitle: 'Design de capa de livro, com arte fornecida pela autora.',
      overview: {
        context: 'A autora já veio com o desenho/arte pronta; o trabalho foi estruturar a capa completa (frente e verso).',
      },
      impact: {
        qualitativeImpact: 'Marco pessoal: nome creditado numa capa de livro publicada.',
      },
    }),
  },
  {
    id: 57,
    empresa: 'Márcia Machado',
    atuacao: ['Design Gráfico'],
    produtos: ['Media Kit Profissional'],
    caseStudy: dg({
      heroSubtitle: 'Media kit profissional com identidade visual criada do zero.',
      overview: {
        context: 'Diferente de outros media kits do portfólio, aqui a identidade visual também foi criada do zero.',
        roleScope:
          'Criação da identidade visual e do media kit, com fotos profissionais e conteúdo de validações de redes sociais (formato usado à época para demonstrar relevância digital).',
      },
    }),
  },
  {
    id: 58,
    empresa: 'Paper Plus',
    atuacao: ['Design Gráfico'],
    produtos: ['Design de Embalagens'],
    caseStudy: dg({
      heroSubtitle: 'Nova logo e design de embalagens para uma linha de papéis.',
      overview: {
        context: 'Empresa de papéis (papel higiênico e linha geral), cada linha com nome regional próprio.',
        roleScope:
          'Desenvolvimento da nova logo e aplicação do design nas embalagens de cada linha de produto — primeira experiência da equipe com design de embalagem.',
      },
    }),
  },
  {
    id: 59,
    empresa: 'Cisne',
    atuacao: ['Design Gráfico'],
    produtos: ['Catálogo de Produtos'],
    caseStudy: dg({
      heroSubtitle: 'Catálogo digital em PDF para divulgação de cursos.',
      overview: {
        context:
          'Cliente já tinha logo e identidade, mas não tinha um catálogo em PDF para divulgação por e-mail e WhatsApp. Projeto que começou como catálogo de produtos e migrou para catálogo de cursos, com contato direto com os sócios.',
      },
    }),
  },
];

export const ATUACAO_CATEGORIES: AtuacaoCategory[] = [
  'Produtos Digitais',
  'Identidade Visual',
  'Redes Sociais',
  'Design Gráfico',
  'Sistemas Web',
  'Consultoria UX/UI',
  'Fotografia',
];

export function getPortfolioItemBySlug(slug: string): PortfolioItem | undefined {
  return PORTFOLIO_ITEMS.find((item) => slugify(item.empresa) === slug);
}

export function getCaseStudyItems(): PortfolioItem[] {
  return PORTFOLIO_ITEMS.filter((item) => !!item.caseStudy);
}

export type AtuacaoCategory =
  | 'Redes Sociais'
  | 'Identidade Visual'
  | 'Produtos Digitais'
  | 'Fotografia'
  | 'Design Gráfico'
  | 'Sistemas Web'
  | 'Consultoria UX/UI';

export interface PortfolioItem {
  id: number;
  empresa: string;
  atuacao: AtuacaoCategory[];
  produtos: string[];
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    empresa: 'Mr. Temaki',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
  },
  {
    id: 2,
    empresa: 'Santa Cris',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
  },
  {
    id: 3,
    empresa: 'Alqafiltros',
    atuacao: ['Redes Sociais', 'Identidade Visual'],
    produtos: ['Gestão de Redes Sociais', 'Marca e Identidade Visual'],
  },
  {
    id: 4,
    empresa: 'Sopa no Pote',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
  },
  {
    id: 5,
    empresa: 'Esfihaiolo',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
  },
  {
    id: 6,
    empresa: 'Refrisul',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
  },
  {
    id: 7,
    empresa: 'Aquarium Scuba',
    atuacao: ['Redes Sociais', 'Identidade Visual'],
    produtos: ['Gestão de Redes Sociais', 'Identidade Visual'],
  },
  {
    id: 8,
    empresa: 'Brava Sport',
    atuacao: ['Produtos Digitais', 'Redes Sociais', 'Identidade Visual', 'Design Gráfico'],
    produtos: ['Site Institucional', 'Redes Sociais', 'Identidade Visual', 'Adesivos e Posters'],
  },
  {
    id: 9,
    empresa: 'Conergia',
    atuacao: ['Produtos Digitais', 'Redes Sociais', 'Identidade Visual'],
    produtos: ['Site Institucional', 'Redes Sociais', 'Identidade Visual'],
  },
  {
    id: 10,
    empresa: 'Massagear para Curar',
    atuacao: ['Redes Sociais'],
    produtos: ['Gestão de Conteúdo Digital'],
  },
  {
    id: 11,
    empresa: 'Alleane Calazans',
    atuacao: ['Fotografia'],
    produtos: ['Ensaio Fotográfico Pessoal'],
  },
  {
    id: 12,
    empresa: 'Nadia Saldanha',
    atuacao: ['Fotografia'],
    produtos: ['Ensaio Fotográfico Pessoal'],
  },
  {
    id: 13,
    empresa: 'Icon',
    atuacao: ['Sistemas Web', 'Produtos Digitais', 'Identidade Visual', 'Fotografia'],
    produtos: ['Sistema SGDI', 'Site Institucional', 'Identidade Visual', 'Fotografia de Eventos'],
  },
  {
    id: 14,
    empresa: 'Orla Bardott',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 15,
    empresa: 'Tecmaster',
    atuacao: ['Produtos Digitais', 'Identidade Visual'],
    produtos: ['Site Institucional', 'Marca e Identidade Visual'],
  },
  {
    id: 16,
    empresa: 'Grupo Conecta',
    atuacao: ['Consultoria UX/UI', 'Produtos Digitais', 'Identidade Visual'],
    produtos: ['Design de Interfaces (UI)', 'Site Institucional', 'Identidade Visual'],
  },
  {
    id: 17,
    empresa: 'Yrlana Arquitetura',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 18,
    empresa: 'Shantiyog',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 19,
    empresa: 'PSMX',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 20,
    empresa: 'Lifeauto',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 21,
    empresa: 'Ippax Ceramics',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 22,
    empresa: 'Ippax Trading Group',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 23,
    empresa: 'MMEngenharia',
    atuacao: ['Produtos Digitais', 'Identidade Visual'],
    produtos: ['Site Institucional', 'Identidade Visual'],
  },
  {
    id: 24,
    empresa: 'Aurora',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 25,
    empresa: 'Betech Group',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 26,
    empresa: 'Burgus',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 27,
    empresa: 'Doce Mel',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 28,
    empresa: 'ELSX',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 29,
    empresa: 'Hit Spoiler',
    atuacao: ['Identidade Visual'],
    produtos: ['Marca e Identidade Visual'],
  },
  {
    id: 30,
    empresa: 'Grupo Tapajós',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 31,
    empresa: 'M2Smart',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 32,
    empresa: 'MasterHouse',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 33,
    empresa: 'Sidi Telecom',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 34,
    empresa: 'Duarte Comunicação',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Catálogo'],
  },
  {
    id: 35,
    empresa: 'Cermam',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 36,
    empresa: 'Portal Tucumã',
    atuacao: ['Produtos Digitais'],
    produtos: ['Portal de Notícias'],
  },
  {
    id: 37,
    empresa: 'Noticias Mais360',
    atuacao: ['Produtos Digitais'],
    produtos: ['Portal de Notícias'],
  },
  {
    id: 38,
    empresa: 'Ws Agencia',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 39,
    empresa: 'Concerto Amazonico',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 40,
    empresa: 'De Carona',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 41,
    empresa: 'Ianomamir',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Catálogo'],
  },
  {
    id: 42,
    empresa: 'Indicai',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 43,
    empresa: 'As Pencas',
    atuacao: ['Produtos Digitais'],
    produtos: ['E-commerce (Loja Virtual)'],
  },
  {
    id: 44,
    empresa: 'Brasil Truck',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 45,
    empresa: 'Clinica Recanto PSI',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 46,
    empresa: 'Connecta Car',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 47,
    empresa: 'Delirio Tropical',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 48,
    empresa: 'DokDEtran',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 49,
    empresa: 'Placas Detran',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 50,
    empresa: 'Security Assistencia',
    atuacao: ['Produtos Digitais'],
    produtos: ['Site Institucional'],
  },
  {
    id: 51,
    empresa: 'RD Alimentos',
    atuacao: ['Produtos Digitais', 'Design Gráfico'],
    produtos: ['Site Catálogo', 'Catálogo Impresso e Digital'],
  },
  {
    id: 52,
    empresa: 'Quest',
    atuacao: ['Sistemas Web'],
    produtos: ['Sistema E-learn (LMS)'],
  },
  {
    id: 53,
    empresa: 'PetLove',
    atuacao: ['Consultoria UX/UI'],
    produtos: ['Design de Interfaces (UI) para Sistema'],
  },
  {
    id: 54,
    empresa: 'Suanne Mauroka',
    atuacao: ['Design Gráfico'],
    produtos: ['Media Kit Profissional'],
  },
  {
    id: 55,
    empresa: 'Quimifix',
    atuacao: ['Design Gráfico'],
    produtos: ['Catálogo de Produtos'],
  },
  {
    id: 56,
    empresa: 'Leliane Picanço',
    atuacao: ['Design Gráfico'],
    produtos: ['Design de Capa de Livro'],
  },
  {
    id: 57,
    empresa: 'Márcia Machado',
    atuacao: ['Design Gráfico'],
    produtos: ['Media Kit Profissional'],
  },
  {
    id: 58,
    empresa: 'Paper Plus',
    atuacao: ['Design Gráfico'],
    produtos: ['Design de Embalagens'],
  },
  {
    id: 59,
    empresa: 'Cisne',
    atuacao: ['Design Gráfico'],
    produtos: ['Catálogo de Produtos'],
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

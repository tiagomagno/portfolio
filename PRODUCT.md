# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Empresas, startups, scale-ups e times de produto avaliando contratar Tiago Magno como parceiro sênior de UX/UI em regime PJ — seja para um projeto pontual, um retainer mensal, um squad dedicado ou um diagnóstico de curto prazo. O visitante típico chega decidindo se vale a pena conversar: quer ver portfólio real, entender como o processo funciona e confirmar que há rigor metodológico por trás do trabalho antes de iniciar contato.

## Product Purpose

Portfólio pessoal que funciona também como material de vendas: mostrar 20+ anos de trabalho em UX/UI, produtos digitais e design de comunicação, e converter esse histórico em leads qualificados via o fluxo de briefing (`/briefing`) e o formulário de contato. Sucesso é o visitante avançar até o briefing ou entrar em contato reconhecendo que Tiago é um parceiro sênior confiável, não apenas mais um freelancer de portfólio genérico.

## Positioning

Combinação de trajetória longa (2003–2025, passando por agências, estúdio próprio e squads de produto em empresas como Grupo Stefanini e Grupo Tapajós) com rigor de processo explícito — diagnóstico antes de proposta, entrega documentada, evolução contínua pós-lançamento — e disposição para parceria de longo prazo, não só projeto pontual. O diferencial é a mistura de senioridade comprovada com um modelo de engajamento estruturado (sprint avulso, retainer, squad dedicado, diagnóstico pontual) que a maioria dos freelancers não formaliza.

## Operating Context

- Fluxo de captação principal: formulário de briefing multi-etapas em `/briefing` (React Hook Form + Zod) e formulário de contato direto (via formsubmit.co) na home.
- Contato direto também por WhatsApp e e-mail, expostos no rodapé/seção de contato.
- Site bilíngue (pt-BR / en-US) via `LangContext`, com todo o conteúdo duplicado em `src/lib/translations.ts`.
- Portfólio real com 59+ projetos catalogados em `src/data/portfolio.ts`, alguns com case study completo (`caseStudy`), outros ainda "a preencher".
- Seção de Consultoria apresenta o modelo de engajamento (Diagnóstico / Execução / Escala) e os 4 formatos de contratação.
- Seção de Experiência lista a trajetória profissional real (7 posições, 2003–2025).

## Capabilities and Constraints

- Stack: Next.js (App Router) + TypeScript, estilização majoritariamente inline (não Tailwind utilitário nos componentes principais), framer-motion para animações de entrada e das pill tabs.
- Paleta e sistema visual já definidos nesta sessão: fundo claro/off-white predominante, texto quase-preto, laranja (`--color-primary: #ff5625`) usado só em detalhes pequenos (badges, números, links ativos, hover), nunca em blocos grandes. Cantos arredondados generosos em quase todos os elementos.
- Marca é só o nome "Tiago Magno" (texto, sem logo/wordmark gráfico) — decisão explícita de não usar mais a marca "Magno Produtos Digitais".
- Não inventar depoimentos, logos de clientes, métricas ou conteúdo biográfico — só usar dados reais já fornecidos (portfólio, experiência profissional).
- Regra permanente de leitura de referências visuais: quando o usuário manda uma imagem de referência, por padrão ele quer a **estrutura** (composição, colunas, hierarquia de texto/botão/imagem), não a paleta de cores do exemplo — ver memória do projeto.

## Brand Commitments

- Nome: Tiago Magno (sem submarca).
- Tom: profissional, sóbrio, "sênior/elitista" — deliberadamente afastado de um visual dark+laranja saturado que existia antes.
- Cor de marca: laranja `#ff5625`, usado como acento discreto, não como cor dominante.

## Evidence on Hand

- Portfólio real: 59+ projetos em `src/data/portfolio.ts`, com nome de empresa, categorias de atuação e, para parte deles, case study completo (contexto, processo, métricas, aprendizados).
- Trajetória profissional real (2003–2025): Grupo Stefanini, Grupo Tapajós, Magno Design Studio, ITJC, Luna Comunicação, ICON Soluções & Consultoria, FUCAPI.
- Sem depoimentos, logos de clientes ou métricas de resultado adicionais disponíveis no momento — não inventar até que sejam fornecidos.

## Product Principles

- Rigor de processo é o argumento central de venda: cada seção (Processo, Consultoria, Experiência) existe pra provar método, não só mostrar peças bonitas.
- Nunca fabricar prova social (depoimentos, logos, métricas) — só usar o que já foi fornecido.
- Referência visual enviada pelo usuário = pedido estrutural por padrão, não estilístico.
- Cor como tempero, não base: laranja aparece para guiar o olho (ativo, destaque pequeno), nunca para preencher grandes áreas.
- Conteúdo bilíngue é tratado como cidadão de primeira classe — toda mudança de texto precisa existir em pt-BR e en-US.

# Portfolio Designer

## Visão geral
Site de portfólio (Next.js). Bootstrapped com create-next-app. Versão antiga estática preservada em `_old_static/`.

## Stack
Next.js + TypeScript + Tailwind, framer-motion, react-hook-form + zod, xlsx (parsing), Dockerfile incluso.

## Estrutura
- `src/` — código (App Router)
- `public/` — assets
- `_old_static/` — versão estática anterior
- `Dockerfile`

## Comandos principais
- `npm install && npm run dev`
- `npm run build && npm start`
- Docker: `docker build -t portfolio-designer . && docker run -p 3000:3000 portfolio-designer`

## Observações
Usa a lib `xlsx` — provavelmente importa dados de portfólio de planilhas.

---

_Este arquivo serve como ficha técnica do projeto para o Claude. Quando esta pasta é aberta, o Claude lê este arquivo automaticamente para entender o projeto rapidamente._

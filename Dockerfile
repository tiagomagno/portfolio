# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências (prisma precisa vir antes do npm ci, que roda "prisma generate" no postinstall)
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# Copia o restante do source
COPY . .

# Variáveis de build (serão sobrescritas pelas env do Coolify em runtime)
ARG TRELLO_API_KEY
ARG TRELLO_TOKEN
ARG TRELLO_CONTACT_LIST_ID
ARG TRELLO_LEADS_LIST_ID

# Build da aplicação
RUN npm run build

# ---- Stage 2: Runner ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Cria usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# CLI do Prisma pra rodar "npx prisma db push"/"npm run db:seed" manualmente no
# container (a build standalone abaixo não inclui ferramentas de CLI, só o
# necessário pra rodar o server.js) — versão presa igual ao package.json.
RUN npm install -g prisma@6.19.3

# Copia apenas o necessário do build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

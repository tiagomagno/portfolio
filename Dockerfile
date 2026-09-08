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
# O chown evita erro de permissão quando o "db push" tenta regenerar o client
# (rodando como usuário "nextjs", não root).
RUN npm install -g prisma@6.19.3 && chown -R nextjs:nodejs /usr/local/lib/node_modules/prisma

# Copia apenas o necessário do build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# bcryptjs é usado pelo prisma/seed.mjs, que roda como script Node puro (fora do
# bundler do Next) — sem esse pacote, "npm run db:seed" falha com MODULE_NOT_FOUND,
# já que o bundler embute o bcryptjs direto nos bundles das rotas em vez de deixá-lo
# como pacote separado.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

# ============================================================
# IMAGE DOCKER DU SITE OHIHO (refonte 2026-09), construction en 3 étapes.
# Même schéma que ~/apps/ohiho sur le VPS : pas de base de données, le
# conteneur lance directement le serveur Next.js.
# ============================================================

# ---------- Étape 1 : dépendances ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Étape 2 : compilation ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
# Les polices next/font sont téléchargées au build : sans réseau ici, le build échoue.
RUN npm run build

# ---------- Étape 3 : image finale ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]

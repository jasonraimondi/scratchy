FROM node:18-alpine as base
WORKDIR /app
RUN apk --no-cache add curl && \
    curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm && \
    chmod +x /bin/pnpm && \
    chown node:node /app
USER node
COPY --chown=node:node ./web/package.json ./web/pnpm-lock.yaml /app/web/


FROM base as builder
ENV NODE_ENV=production
COPY --chown=node:node .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --chown=node:node api/package.json api/pnpm-lock.yaml /app/api/
RUN pnpm install --production=false --frozen-lockfile
COPY --chown=node:node web/ /app/web/
COPY --chown=node:node api/ /app/api/
ARG VITE_ENABLE_DEBUG
ARG VITE_API_URL
ARG VITE_APP
ARG VITE_TRPC_URL_HTTP
ARG VITE_TRPC_URL_WS
ENV \
  VITE_ENABLE_DEBUG=${VITE_ENABLE_DEBUG} \
  VITE_API_URL=${VITE_API_URL} \
  VITE_APP=${VITE_APP} \
  VITE_TRPC_URL_HTTP=${VITE_TRPC_URL_HTTP} \
  VITE_TRPC_URL_WS=${VITE_TRPC_URL_WS}
#RUN pnpm svelte-kit sync
#RUN pnpm gen
RUN pnpm --prefix web build


FROM base as final
WORKDIR /app/web
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --production=true
COPY --from=builder --chown=node:node /app/web/.npmrc /app/web/postcss.config.cjs /app/web/svelte.config.js /app/web/tsconfig.json /app/web/vite.config.ts /app/web/
COPY --from=builder --chown=node:node /app/web/.svelte-kit/ /app/web/.svelte-kit/
COPY --from=builder --chown=node:node /app/web/dist/ /app/web/dist/
CMD node --enable-source-maps ./dist/index.js

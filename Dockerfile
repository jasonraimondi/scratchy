FROM node:18 as base
ARG VITE_API_URL
ARG VITE_APP
ENV \
  VITE_ENABLE_DEBUG=0 \
  VITE_API_URL=${VITE_API_URL} \
  VITE_APP=${VITE_APP}
WORKDIR /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY ./web/package.json ./web/pnpm-lock.yaml /app/


FROM base as builder
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
COPY ./web/ /app/
COPY ./api/schema.graphql /api/
RUN pnpm svelte-kit sync
RUN pnpm gen
RUN pnpm build


FROM base as final
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder --chown=node:node /app/.npmrc /app/codegen.yml /app/postcss.config.cjs /app/svelte.config.js /app/tsconfig.json /app/vite.config.ts /app/
COPY --from=builder --chown=node:node /app/.svelte-kit/ /app/.svelte-kit/
COPY --from=builder --chown=node:node /app/dist/ /app/dist/
RUN chown -R node:node /app
CMD node /app/dist/index.js

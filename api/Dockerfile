FROM node:18 as base
WORKDIR /app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm \
    && chown node:node /app
USER node
COPY --chown=node:node package.json pnpm-lock.yaml ./


FROM base as builder
ENV NODE_ENV=development
COPY --chown=node:node ./prisma/ /app/prisma/
COPY --chown=node:node ./src/ /app/src/
COPY --chown=node:node ./templates/ /app/templates/
RUN pnpm install --frozen-lockfile
COPY schema.graphql tsconfig.json tsconfig.build.json /app/
COPY .env* /app/
RUN pnpm gen
RUN pnpm build


FROM base
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod
COPY --chown=node:node ./tsconfig.docker.json /app/tsconfig.json
COPY --from=builder --chown=node:node /app/schema.graphql /app/
COPY --from=builder --chown=node:node /app/prisma/ /app/prisma/
COPY --from=builder --chown=node:node /app/templates/ /app/templates/
COPY --from=builder --chown=node:node /app/dist/ /app/dist/
COPY --from=builder --chown=node:node /app/src/generated/client/ /app/dist/generated/client/
CMD node /app/dist/main.js

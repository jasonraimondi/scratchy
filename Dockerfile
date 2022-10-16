FROM node:17-alpine as appnode
ENV NODE_ENV="production"
WORKDIR /app/
RUN apk add --update --no-cache curl \
    && curl -fsSL 'https://github.com/pnpm/pnpm/releases/download/v7.1.1/pnpm-linuxstatic-x64' -o /usr/local/bin/pnpm \
    && chmod +x /usr/local/bin/pnpm \
    && mkdir -p /app/modules/prisma-generator \
    && curl -fsSL 'https://github.com/jasonraimondi/prisma-generator-nestjs-graphql/archive/refs/tags/v1.0.0-rc.7.tar.gz' | tar -xz --strip-components=1 -C /app/modules/prisma-generator

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc /app/
COPY modules/api/package.json modules/api/tsconfig.json modules/api/tsconfig.build.json /app/modules/api/
COPY modules/prisma /app/modules/prisma/


FROM appnode as builder
RUN NODE_ENV=development pnpm install
RUN pnpm --prefix /app/modules/prisma gen

## something here is mmaking me have to rerun pnpm install
COPY modules/api/ /app/modules/api/
RUN NODE_ENV=development pnpm install
RUN pnpm --prefix /app/modules/api build

#### using pnpm pack b/c as a workaround for the pnpm workspaces
#RUN pnpm --prefix /app/modules/api pack \
#    && mkdir /api-dist \
#    && tar -xzf /app/modules/api/api-0.0.1.tgz --strip-components=1 -C /api-dist

#FROM appnode
#ENV NODE_ENV=production
#RUN pnpm install --frozen-lockfile --prod
#COPY --from=builder /app/modules/prisma/generated/ /app/modules/prisma/generated/
#COPY --from=builder /app/modules/api/ /app/modules/api/

WORKDIR /app/modules/api
CMD ["node", "-r", "ts-node/register", "-r", "tsconfig-paths/register", "dist/main.js"]
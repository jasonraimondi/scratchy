FROM node:18-alpine as base
WORKDIR /app
RUN apk --no-cache add curl && \
    curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm && \
    chmod +x /bin/pnpm && \
    chown node:node /app
USER node
COPY --chown=node:node package.json pnpm-lock.yaml /app/


FROM base as builder
ENV NODE_ENV=production
COPY --chown=node:node ./prisma/ /app/prisma/
COPY --chown=node:node ./src/ /app/src/
RUN pnpm install --production=false --frozen-lockfile
COPY tsconfig.json /app/
COPY .env* /app/
RUN pnpm gen
RUN pnpm build


FROM base as tsconfig
USER root
COPY ./tsconfig.json /app/tsconfig.json
RUN apk --no-cache add sed && sed -e 's/\["src/\["dist/' -i /app/tsconfig.json


FROM base
ENV NODE_ENV=production
RUN pnpm install --production=false --frozen-lockfile
COPY --from=tsconfig --chown=node:node /app/tsconfig.json /app/tsconfig.json
COPY --from=builder --chown=node:node /app/prisma/ /app/prisma/
COPY --from=builder --chown=node:node /app/dist/ /app/dist/
COPY --from=builder --chown=node:node /app/prisma/ /app/prisma/
CMD node --enable-source-maps /app/dist/main.js

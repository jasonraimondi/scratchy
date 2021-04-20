FROM node:14-alpine as base
ENV NODE_ENV=production \
    CI=true \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN apk add --no-cache python make g++ && \
    apk add vips-dev fftw-dev --update-cache \
    --repository http://dl-3.alpinelinux.org/alpine/edge/community \
    --repository http://dl-3.alpinelinux.org/alpine/edge/main \
    && rm -fR /var/cache/apk/* \
    && mkdir -p /app \
    && chown -R node:node /app
COPY --chown=node:node package.json package-lock.json /app/
USER node

FROM base as builder
ENV NEXT_PUBLIC_API_URL="/api/"
RUN npm ci --production=false
COPY --chown=node:node next* /app/
COPY --chown=node:node tsconfig* /app/
COPY --chown=node:node postcss.config.js /app/
COPY --chown=node:node public /app/public/
COPY --chown=node:node generated /app/generated/
COPY --chown=node:node pages /app/pages/
COPY --chown=node:node graphql /app/graphql/
COPY --chown=node:node styles /app/styles/
COPY --chown=node:node src /app/src/
RUN npm run build

FROM base
RUN npm ci --production=false
COPY --from=builder --chown=node:node /app/package* /app/
COPY --from=builder --chown=node:node /app/next.config.js /app/next.config.js
COPY --from=builder --chown=node:node /app/dist/ /app/dist/
CMD ["./node_modules/.bin/next", "start"]

FROM node:14-alpine as builder
ENV NODE_ENV=production \
    CI=true
WORKDIR /app/packages/api
COPY package* /app/
RUN npm ci --production=false
COPY tsconfig* /app/
COPY src /app/src/
RUN npm run build
RUN npm prune

FROM node:14-alpine
ENV NODE_ENV=production \
    ENABLE_OUTPUT_SCHEMA=0 \
    ENABLE_DEBUGGING=0 \
    TYPEORM_SYNCHRONIZE=0 \
    TYPEORM_LOGGING=0 \
    TYPEORM_ENTITIES="dist/entity/**/*.entity.js"
WORKDIR /app
RUN mkdir -p /app && chown node:node /app
USER node
COPY --chown=node:node templates /app/templates
COPY --from=builder --chown=node:node /app/package* /app/
COPY --from=builder --chown=node:node /app/tsconfig.json /app/tsconfig.json
COPY --from=builder --chown=node:node /app/dist/src /app/dist
COPY --from=builder --chown=node:node /app/node_modules /app/node_modules
CMD ["node", "/app/dist/main.js"]

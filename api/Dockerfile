FROM node:14-alpine as builder
ENV NODE_ENV=production \
    CI=true
WORKDIR /app/packages/api
COPY package* /app/
RUN npm ci --production=false
COPY tsconfig* /app/
COPY src /app/src/
RUN npm run build

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
COPY --from=builder --chown=node:node /app/package*.json /app/
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm ci --production
COPY --from=builder --chown=node:node /app/tsconfig.json /app/tsconfig.json
COPY --from=builder --chown=node:node /app/dist /app/dist
COPY --chown=node:node templates /app/templates
CMD ["node", "/app/dist/main.js"]

# Scratchy

Install

```bash
# install dependencies
npm ci

# boot postgres and redis services
docker-compose up -d

# migrate the database
npm run migrate:up

# start the server
npm run start:dev
```

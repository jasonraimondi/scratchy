# Scratchy

![Node.js CI](https://github.com/jasonraimondi/scratchy/workflows/Node.js%20CI/badge.svg)

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

# Scratchy

[![Node.js CI](https://github.com/jasonraimondi/scratchy/workflows/Node.js%20CI/badge.svg)](https://github.com/jasonraimondi/scratchy/actions?query=workflow%3A%22Node.js+CI%22)

## Install

```bash
# install dependencies
npm ci

# boot postgres and redis services
docker-compose up -d

# migrate the database
npm run migrate:up

# start the server
npm run start:dev

# graphql playground
open http://localhost:3000/graphql 

# queue runner status via bull-board
open http://localhost:3000/admin/queues # queue runner status

# email box via mailcatcher
open http://localhost:8025 # emails
```

## Tooling:

* [NestJS](https://www.npmjs.com/package/@nestjs/cli) application with authentication via JWT
* [TypeORM](https://www.npmjs.com/package/typeorm) using Repository Pattern
* [bull](https://www.npmjs.com/package/bull) for handling queue / jobs
* [bull-board](https://www.npmjs.com/package/bull-board) for queue runner gui
* [nodemailer](https://www.npmjs.com/package/nodemailer) for sending emails over SMTP
* [handlebars](https://www.npmjs.com/package/handlebars) and  [mjml](https://www.npmjs.com/package/mjml) for email templating

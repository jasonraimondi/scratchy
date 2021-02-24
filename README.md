# Scratchy

[API](./api)


[![CI](https://github.com/jasonraimondi/scratchy/actions/workflows/unit_tests.yml/badge.svg)](https://github.com/jasonraimondi/scratchy/actions/workflows/unit_tests.yml)
[![Docker - API](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_api.yml/badge.svg)](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_api.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/575ba1fd1f6d3b678f06/maintainability)](https://codeclimate.com/github/jasonraimondi/scratchy/maintainability)
<a href="https://codeclimate.com/github/jasonraimondi/scratchy/test_coverage"><img src="https://api.codeclimate.com/v1/badges/575ba1fd1f6d3b678f06/test_coverage" /></a>

[Web](./web)

[![Docker - Web](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_web.yml/badge.svg)](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_web.yml)

## API

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
open http://localhost:3001/graphql 

# queue runner status via bull-board
open http://localhost:3001/admin/queues # queue runner status

# email box via mailcatcher
open http://localhost:8025 # emails
```

## Tooling:

* [NestJS](https://www.npmjs.com/package/@nestjs/cli) application with authentication via JWfT
* [TypeORM](https://www.npmjs.com/package/typeorm) using Repository Pattern
* [bull](https://www.npmjs.com/package/bull) for handling queue / jobs
* [bull-board](https://www.npmjs.com/package/bull-board) for queue runner gui
* [nodemailer](https://www.npmjs.com/package/nodemailer) for sending emails over SMTP
* [handlebars](https://www.npmjs.com/package/handlebars) and  [mjml](https://www.npmjs.com/package/mjml) for email templating


# Scratchy

![Node.js CI](https://github.com/jasonraimondi/scratchy/workflows/Node.js%20CI/badge.svg)

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
```

## Tooling:

* NestJS application
* Authentication via JWT
* TypeORM using Repository Pattern
* Bull for handling queue / jobs
* Email sending using nodemailer, over SMTP
* Email templates using MJML

## Modules:

* Auth
  - Login
  - Logout
  - Forgot Password
Signup
  - Register
  - Verify Email Address
User
  - Me
  - Get User
  - List Users

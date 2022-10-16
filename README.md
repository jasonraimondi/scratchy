# The Scratchy

## Getting Started

Clone the repository

```bash
cd `scratchy`
```

Boot Docker services

```bash
docker-compose up -d
```

Install Dependencies

```bash
pnpm install
```

Initialize & Seed Database

```bash
pnpm db
```

Run the generators. This generates the prisma client for the backend, and the api client library for sveltekit.

```bash
pnpm -r gen
```

Ask [Jason](@jasonraimondi) for the .env values. You can get started without this, these are only required for the oauth logins.

```bash
touch apps/api/.env
```

Start dev mode, either use overmind or look in the [Procfile](./Procfile) and use that as a starting point. You need the **api** and **web**, the generators are optional.

```bash
overmind start
```

Find a [users to login as.](libs/prisma/prisma/seed.ts);

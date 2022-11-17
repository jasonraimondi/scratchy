# Scratchy

## Getting Started

Boot Docker services

```bash
docker-compose up -d
```

Install Dependencies

```bash
pnpm install
```

The install command should also run this next generator for you in a 'postinstall' hook. This generates the prisma client for the backend, and the api client library for sveltekit. You can rerun the command with the following.

```bash
pnpm -r gen
```

Next, initialize & seed the database. This creates the actual database, and runs all migrations for you. Then it runs a [seed](api/prisma/seed.ts) command for you that sets up some sample data.

Note: If you see the error `User scratchy was denied access on the database scratchy.public`, you will need to check if the postgres running on port 5432. Likely, you have multiple postgres servers running on your host machine, and the one running on port 5432 is not able to authenticate with the `scratchy` user.

```bash
pnpm db
```

Start dev mode, either use overmind or look in the [Procfile](./Procfile) and use that as a starting point. You need the **api** and **web**, the generators are optional.

```bash
overmind start
```

### Graphql

After booting the api, you can nav to the graphiql editor here: http://localhost:5000/graphiql

// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "scratchy",
      user: "scratchy",
      password: "secret",
      port: 30532,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "db/migrations",
      tableName: "migrations",
    },
  },
};

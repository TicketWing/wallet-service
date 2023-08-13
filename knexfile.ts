const config = {
  development: {
    client: "pg",
    version: "7.2",
    connection: {
      host: "wallet-database",
      port: 5432,
      user: "admin",
      password: "Qwerty1234",
      database: "wallet-service",
    },
    migrations: {
      directory: "migrations",
      loadExtensions: [".js"],
    },
  },
};

export default config.development;

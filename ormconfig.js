require("./build/app/config").default();

const nconf = require("nconf");
const config = nconf.get('database');

module.exports = {
  name: 'migration',
  type: config.type,
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  charset: config.charset,
  migrations: ['build/migrations/*.js'],
  cli: {
    migrationsDir: 'build/migrations',
  },
};

const knexProducts = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASS,
    database: "pruebas",
  },
  pool: { min: 0, max: 10 },
});
module.exports = {
  knexProducts,
};

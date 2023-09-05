// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-sql",
//   password: "Jainam1769@sql",
// });

// module.exports = pool.promise();
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-sql", "root", "Jainam1769@sql", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "db4free.net",
  port: 3306,
  user: "ihsadb123",
  password: "ihsa@2023",
  database: "ihsadb",
  connectionLimit: 1000,
  multipleStatements: true,
});
module.exports = pool;

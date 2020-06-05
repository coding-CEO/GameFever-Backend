const mysql = require("mysql");

let db_con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net	",
  user: "sql12345846",
  password: "s119eztPgW",
  port: 3306,
  database: "sql12345846",
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "pcommersedb",
  multipleStatements: true,
});

db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!" + err);
  } else {
    console.log("connected to Database");
  }
});

module.exports = db_con;

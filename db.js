const mysql = require("mysql");

let db_con = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,

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

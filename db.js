const mysql = require("mysql");

let db_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pcommersedb",
  multipleStatements: true,
});

db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!");
  } else {
    console.log("connected to Database");
  }
});

module.exports = db_con;

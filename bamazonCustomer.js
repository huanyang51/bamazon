var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "huanyang2",
  password: "1234",
  database: "bamazon"
});

connection.connect();
connection.query(`SELECT * FROM products;`, function(err, results, fields) {
  if (err) throw err;
  console.log(results);
});
connection.end();

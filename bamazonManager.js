var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "huanyang2",
  password: "1234",
  database: "bamazon"
});
// set global viables
var columns = [
  "item_id",
  "product_name",
  "department_name",
  "price",
  "stock_quantity"
];

function viewProducts() {
  connection.query(`SELECT * FROM products;`, function(err, results, fields) {
    if (err) throw err;
    console.table(results, columns);
    start();
  });
}

function viewLowInvent() {
  connection.query(
    `SELECT * FROM products WHERE stock_quantity < 300;`,
    function(err, results, fields) {
      if (err) throw err;
      console.table(results, columns);
      start();
    }
  );
}

function addInvent() {
  inquirer
    .prompt([
      {
        name: "itemId",
        type: "input",
        message:
          "Which item would you like to add more to the inventory(item_id)?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?"
      }
    ])
    .then(answers => {
      connection.query(`SELECT * FROM products;`, function(
        err,
        results,
        fields
      ) {
        if (err) throw err;
        var item = results[answers.itemId - 1];
        var itemQuantity = item.stock_quantity + parseInt(answers.quantity);
        connection.query(
          `UPDATE products SET stock_quantity = ${itemQuantity} WHERE item_id = ${answers.itemId};`,
          function(err, results, fields) {
            if (err) throw err;
          }
        );
        console.log(
          `The stock quantity for product ${item.product_name} is updated to ${itemQuantity} successfully!`
        );
        start();
      });
    });
}

function addProduct() {
  inquirer
    .prompt([
      {
        name: "itemName",
        type: "input",
        message: "what is the name for this item?"
      },
      {
        name: "departName",
        type: "input",
        message: "Which department does this item belong to (department_name)?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the sell price for this item?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?"
      }
    ])
    .then(answers => {
      connection.query(
        `INSERT INTO products (product_name, department_name, price, stock_quantity)
        VALUES ("${answers.itemName}", "${answers.departName}", ${parseFloat(
          answers.price
        )}, ${parseInt(answers.quantity)});`,
        function(err, results, fields) {
          if (err) throw err;
          console.log(`Product ${answers.itemName} is successfully added!`);
          start();
        }
      );
    });
}

function start() {
  inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(answers => {
      switch (answers.option) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInvent();
          break;
        case "Add to Inventory":
          addInvent();
          break;
        case "Add New Product":
          addProduct();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          console.log("Sorry, something went wrong. Please try again");
      }
    });
}

connection.connect();
start();

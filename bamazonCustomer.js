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
var total = 0;
var message = "You have purchased ";
connection.connect();
start();

function start() {
  connection.query(`SELECT * FROM products;`, function(err, results, fields) {
    if (err) throw err;
    var columns = [
      "item_id",
      "product_name",
      "department_name",
      "price",
      "stock_quantity"
    ];
    console.table(results, columns);
    inquirer
      .prompt([
        {
          name: "itemId",
          message: "Which item would you like to purchase (item_id)?",
          type: "input"
        },
        {
          name: "quantity",
          message: "How many would you like to purchase?",
          type: "input"
        }
      ])
      .then(answers => {
        var item = results[answers.itemId - 1];
        var itemQuantity = item.stock_quantity - answers.quantity;
        if (itemQuantity >= 0) {
          total = total + answers.quantity * item.price;
          connection.query(
            `UPDATE products SET stock_quantity=${itemQuantity} WHERE item_id = ${answers.itemId};`,
            function(err, results, fields) {
              if (err) throw err;
            }
          );
          if (answers.quantity > 1) {
            order = `${answers.quantity} items of ${item.product_name}\n`;
          } else {
            order = `${answers.quantity} item of ${item.product_name}\n`;
          }
          message = message + order;
          next();
        } else {
          console.log(
            "Insufficient quantity! Please choose a different amount or item."
          );
          next();
        }
      });
  });
}

// ask users if they would like to continue shopping or exit.
function next() {
  inquirer
    .prompt([
      {
        name: "next",
        type: "list",
        message: "Would you like to purchase more items?",
        choices: ["Yes, show me the products", "No, that's it."]
      }
    ])
    .then(answers => {
      switch (answers.next) {
        case "Yes, show me the products":
          start();
          break;
        case "No, that's it.":
          console.log(message + `Your total cost is $${total.toFixed(2)}.`);
          connection.end();
          break;
        default:
          console.log("Sorry, something went wrong. Please try again");
      }
    });
}

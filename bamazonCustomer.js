var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
  database: "bamazonDB"
});

connection.connect(function (err) {
  if (err) throw err;
  showItems();
});

function runSearch() {
  inquirer
    .prompt([{
      name: "item_id",
      type: "input",
      message: "What is the item ID of the product would you like to buy?"
    }, {
      name: "quantity",
      type: "input",
      message: "How many units of the product would you like to buy?",
      // validate: function (value) {
      //   //console.log(value);
      //   if (isNaN(value) === false) {
      //     return true;
      //   }
      //   return false;
      // }
    }])
    .then(function (value) {
     // console.log(value);
      var item = value.quantity;
      //var quantity = answer.quantity;

      //query db to verify that item ID and quantity are current:
      var query = "SELECT * FROM products WHERE item_id = ?";
      var newQuery = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?"
      connection.query(query, [value.item_id], function (err, res) {

        if (err) throw err;

        if (res[0].stock_quantity < value.quantity) {

          console.log("Insufficient quantity");
        } else {
          connection.query(newQuery, [value.quantity, value.item_id], function (err, res) {
            if (err) throw err;
            console.log(res);
          });
        }
      });
    });
}

function showItems() {
  var query = "SELECT * FROM products";
  connection.query(query, function (err, results) {
    if (err) throw err;
    //  console.log(results);
    console.table(results);
    runSearch();
  })
}




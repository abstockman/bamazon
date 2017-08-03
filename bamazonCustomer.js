var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');

var connection = mysql.createConnection ({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazon_db'
});

connection.connect(function(err) {
  if(err) throw err;
  console.log(" ");
  console.log("Connecion is ROCK SOLID");
  console.log(" ");
  console.log("WELCOME TO BAMAZON");
  console.log(" ");
  displayItems();
});

var displayItems = function() {
  connection.query('SELECT * FROM products', function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].id + " | " + "Product: " + res[i].product_name + " | " + "Price: " + "$" + res[i].price);
      }
      console.log(" ");
      buyItems();
  })
};

var buyItems = function() {
  inquirer.prompt([
    {
      name: "ID",
      type: "input",
      message: "Type the ID of the product you would like to buy: ",
      validate: function(value) {
        if (isNaN(value) == false) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      name: "units",
      type: "input",
      message: "How many units of this product would you like to buy?",
      validate: function(value) {
        if (isNaN(value) == false) {
          return true;
        } else {
          return false;
        }
      }
    }
  ]).then(function(answer) {
    console.log(" ");
    checkQuantity();
  })
};
//
var checkQuantity = function() {
  console.log("Checking stock...");
// //   var query = 'SELECT stock_quantity, price FROM products WHERE id =?';
// //   var params = answer.id;
// //     connection.query(query, params, function(err, res) {
// //       if (res[0].stock_quantity < answer.units) {
// //         console.log("Sorry, we are out of stock!");
// //         buyItems();
// //       } else {
// //         var totalPrice = answer.units * res[0].price;
// //         var newQuantity = res[0].stock_quantity - answer.quantity;
// //         console.log("Total: $" + totalPrice);
// //       }
// //     })
}

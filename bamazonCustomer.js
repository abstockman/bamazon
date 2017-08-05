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
        console.log("ID: " + res[i].id + " | " + "Product: " + res[i].product_name + " | " + "Price: " + "$" + res[i].price + " | " + "Stock Quantity: " + res[i].stock_quantity);
      }
      console.log(" ");
      promptCustomer(res);
  })
};

// INQUIRER PROMPTS

var buyProductsPrompt = {
  type: 'input',
  message: 'Type the ID of the product you would like to buy: ',
  name: 'buy_products'
};

var quantityPrompt = {
  type: 'input',
  message: 'How many units of this product would you like to buy?',
  name: 'product_quantity'
};

var restartPrompt = {
  type: 'list',
  message: 'Would you like to buy another item?',
  choices: ["Yes", "No"],
  name: 'restart_prompt'
};

var promptCustomer = function(res) {
  inquirer.prompt([buyProductsPrompt]).then(function(inquirerResponse) {
    var chosenProductID = parseInt(inquirerResponse.buy_products);
    for (var i = 0; i < res.length; i++) {
      if(res[i].id === chosenProductID) {
        var id = i;
        inquirer.prompt([quantityPrompt]).then(function(inquirerResponse) {
          var chosenQuantity = parseInt(inquirerResponse.product_quantity);
          if((res[id].stock_quantity - chosenQuantity) >= 0) {
            var newQuantity = res[id].stock_quantity - chosenQuantity;
            var totalCost = res[id].price * chosenQuantity;
            var sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            var values = ['products', 'stock_quantity', newQuantity, 'id', chosenProductID];
            connection.query(sql, values, function(err, res) {
              if(err){
                console.log(err);
                connection.end();
              }

              // ALERT USER ON PRODUCTS BOUGT AND TOTAL COST OF TRANSACTION

              console.log("Product(s) bought!" + "\n" + "Total Cost of Transaction: $" + totalCost);
              inquirer.prompt([restartPrompt]).then(function(inquirerResponse) {
                if (inquirerResponse.restart_prompt === "Yes") {
                  displayItems();
                } else{
                  console.log("Thank You!");
                  connection.end();
                }
              })
            })
          }

          // IF THE NUMBER IS GREATER THAN THE PRODUCT'S STOCK_QUANTITY AMOUNT, ALERT THE USER AND RESTART THE PROMPTCUSTOMER FUNCTION

          else {
            console.log("Insufficient Quantity! Please enter a number less than or equal to the selected item's available quantity.");
            promptCustomer(res);
          }
        })
      }
    }
  })
}

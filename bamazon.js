var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Amartin4",
    database: "bamazon_db",
    port: 3306,
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

//=================================Inquirer introduction===============================

function startPrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true

    }]).then(function (user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log("Thank you! Come back soon!");
        }
    });
}

//=================================Inventory===============================

function inventory() {

    // instantiate
    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
        colWidths: [5, 15, 20, 10, 8]
    });

    listInventory();

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    function listInventory() {

        //Variable creation from DB connection

        connection.query("SELECT * FROM products", function (err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

                table.push(
                    [itemId, productName, departmentName, price, stockQuantity]
                );
            }
            console.log("");
            console.log("====================================================== Current Bamazon Inventory ======================================================");
            console.log("");
            console.log(table.toString());
            console.log("");

        });
    }
}
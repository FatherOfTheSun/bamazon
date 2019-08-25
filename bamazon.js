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

//=================================Inquirer ===============================

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
            console.log("Thank you! We dont want your Money anyway!");
        }
    });
}

//=================================Inventory===============================

function inventory() {


    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
        colWidths: [5, 15, 20, 10, 8]
    });

    currentInventory();


    function currentInventory() {



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
            console.log("-------------------------------Bamazon Inventory -------------------------------");
            console.log("");
            console.log(table.toString());
            console.log("");
            continuePrompt();

        });
    }
}
function continuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to make a purchase?",
        default: true

    }]).then(function (user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log("Thank you! Com again!");
        }
    });
}

function selectionPrompt() {
    inquirer.prompt([{
        type: "input",
        name: "inputID",
        message: "Enter the ID number you want to purchase!",
    },
    {
        type: "input",
        name: "inputNumber",
        message: "How many?",

    }
    ]).then(function (itemPurchase) {

        connection.query("SELECT * FROM products WHERE id=?", itemPurchase.inputID, function (err, res) {
            for (var i = 0; i < res.length; i++) {

                if (itemPurchase.inputNumber > res[i].stock_quantity) {

                    console.log("OUT OF STOCK");
                    startPrompt();
                }
                else {
                    console.log("Item Purchased");
                    console.log("You've selected:");
                    console.log("Item: " + res[i].product_name);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + itemPurchase.inputNumber);
                    console.log("Total: " + res[i].price * itemPurchase.inputNumber);

                    var newStock = (res[i].stock_quantity - itemPurchase.inputNumber);
                    var purchaseID = (itemPurchase.inputID);

                    confirmPrompt(newStock, purchaseID);
                }
            }
        });
    });
}

function confirmPrompt(newStock, purchaseID) {
    inquirer.prompt([{
        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure?",
        default: true
    }]).then(function (userConfirm) {
        if (userConfirm.confirmPurchase === true) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                stockQuantity: newStock
            },
            {
                ID: purchaseID

            }],
                function (err, res) { });
            console.log("Order has been shipped!");
            startPrompt();



        }
        else {
            console.log("Get a Job!");
            startPrompt();
        }
    });



}

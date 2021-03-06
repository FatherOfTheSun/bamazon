var Table = require('cli-table2');
var mysql = require('mysql');
var inquirer = require('inquirer');

//------------------------------------Connect to SQL database-----------------------------------------

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Amartin4",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

//----------------------------------------Inquirer introduction------------------------------

var startPrompt = function () {

    inquirer.prompt([{

        type: "list",
        name: "actionList",
        message: "Welcome Manager. What would you like to review?",
        choices: [
            "View Products",
            "Low Inventory",
            "Add Inventory",
            "Add New Product",
        ]


    }]).then(function (answer) {

        // Different functions called based on managers selection
        switch (answer.actionList) {
            case "View Products":
                inventoryProducts();
                break;

            case "Low Inventory":
                lowInventory();
                break;

            case "Add Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;
        }
    });
}




//------------------------------------View Inventory------------------------------------

function inventoryProducts() {


    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 20, 17, 10, 8]
    });

    Inventory();


    function Inventory() {



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
            startPrompt();
        });
    }
}

//<------------------------------View Low Inventory----------------------------------->


var table = new Table({
    head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
    colWidths: [10, 20, 17, 10, 8]
});




function lowInventory() {

    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {



            if (res[i].stock_quantity <= 5) {

                var itemId = res[i].id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

                table.push(
                    [itemId, productName, departmentName, price, stockQuantity]
                );
            }
        }
        console.log("");
        console.log("---------------------------------------Low Bamazon Inventory (Less than 5 in stock) -------------------------------------------------");
        console.log("");
        console.log(table.toString());
        console.log("");
        startPrompt();
    });
};


//---------------------------------Add Inventor---------------------------------

function addInventory() {

    inquirer.prompt([{

        type: "input",
        name: "inputId",
        message: "Please enter the ID number to add inventory to.",
    },
    {
        type: "input",
        name: "inputNumber",
        message: "How many units of this item for stock quantity?",

    }
    ]).then(function (managerAdd) {

        connection.query("UPDATE products SET ? WHERE ?", [{

            stock_quantity: managerAdd.inputNumber
        }, {
            id: managerAdd.inputId
        }], function (err, res) {
        });
        startPrompt();
    });
}


//-------------------------------Add New Product-----------------------------------

function addProduct() {



    inquirer.prompt([{

        type: "input",
        name: "inputName",
        message: "Please enter the name of the new product.",
    },
    {
        type: "input",
        name: "inputDepartment",
        message: "Please enter which department name of the new product.",
    },
    {
        type: "input",
        name: "inputPrice",
        message: "Please enter the price of the product (0.00).",
    },
    {
        type: "input",
        name: "inputStock",
        message: "Please enter the stock quantity of the product.",
    }

    ]).then(function (managerNew) {



        connection.query("INSERT INTO products SET ?", {
            product_name: managerNew.inputName,
            department_name: managerNew.inputDepartment,
            price: managerNew.inputPrice,
            stock_quantity: managerNew.inputStock
        }, function (err, res) { });
        startPrompt();
    });
}
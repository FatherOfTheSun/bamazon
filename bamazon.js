var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Amartin4",
    database: "bamazon_db"
});

connection.connect();

var display = function () {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err:
        console.log('__________________')
        console.log(' Welcome to Bamazon')
        console.log('___________________')
        console.log('')
        console.log(' Find Your Product')
        console.log('')
    });
    var table = new Table({
        head: ['ID', 'Product', 'Department Name', 'Price', 'Stock Quantity'],
        colWidths: [5, 25, 15, 8, 8],
        colAlign: ['left', 'center', 'center', 'right', 'right'],
        style: {
            head: ['green'],
            compact: true
        }

    });
};

const mysql = require('mysql');

let connection = mysql.createConnection({
    host     :  "localhost",
    port     :  "3306",
    user     :  "root",
    password :  "programando24",
    database :  "competencias"
});

module.exports = connection;
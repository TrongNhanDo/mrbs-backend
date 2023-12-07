const mysql = require('mysql');

const dbConnect = mysql.createPool({
   connectionLimit: 100,
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'mrbs',
});

module.exports = dbConnect;

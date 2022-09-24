const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'nodeuser',
    password: 'TIC2601',
    database: 'rabbit'
  });


connection.connect((err) => {
if (err) throw err;
console.log('Connected!');
});

module.exports = connection;
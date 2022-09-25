const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'nodeuser',
  password: 'TIC2601',
  database: 'myapp'
});


connection.connect((err) => {
if (err) throw err;
console.log('Connected!');
});

module.exports = connection;
const mysql = require('mysql');

const {
  promisify,
} = require('util');

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

const queryAsync = promisify(connection.query).bind(connection);
module.exports = queryAsync;
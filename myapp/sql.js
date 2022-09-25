const mysql = require('mysql');

const {
  promisify,
} = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodeuser',
  password: 'TIC2601',
  database: 'snp'
});


connection.connect((err) => {
if (err) throw err;
console.log('Connected!');
});

const queryAsync = promisify(connection.query).bind(connection);
const insPostSQL = `INSERT INTO posts (username, header, contents) VALUES (?, ?, ?)`;
const userinfowPassSQL = 'SELECT * FROM users WHERE username = ? AND password = ?';
const userinfonoPassSQL = 'SELECT * FROM users WHERE username = ?';
const postSQL = 'SELECT * FROM posts WHERE username = ?';
const coutPostSQL = 'SELECT COUNT(*) as count FROM posts WHERE username = ?';
const insUserSQL = 'INSERT INTO users (username, password) VALUES (?, ?)';
const deletepostSQL = 'DELETE FROM posts WHERE postid = ?';
const getpostbyIdSQL = 'SELECT * FROM posts WHERE postid = ?';
const updatepostSQL = 'UPDATE posts SET header = ?, contents = ? WHERE postId = ?';


module.exports = queryAsync;
module.exports = postSQL;
module.exports = coutPostSQL;
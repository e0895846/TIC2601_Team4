const path = require('path');

const {
  promisify,
} = require('util');

const express = require('express');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodeuser',
  password: 'TIC2601',
  database: 'myapp'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

const queryAsync = promisify(connection.query).bind(connection);

app.get('/', async (req, res) => {
  const sql = 'SELECT DISTINCT language FROM book';

  let languages = {};
  try {
    languages = await queryAsync(sql);

    res.render('book-3', {
      sql: sql,
      languages: languages
    });
  } catch (err) {
    console.log('SQL error', err);
    res.status(500).send('Something went wrong');
  }
});

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
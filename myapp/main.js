const path = require('path');

const {
  promisify,
} = require('util');

const express = require('express');
const app = express();
app.use(express.static(path.join(__dirname + '/public')));
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
  const languageSQL = 'SELECT DISTINCT language FROM book';
  const bookSQL = 'SELECT title, authors FROM Book WHERE Title like ? AND Language = ? AND Format = ?';

  let languages = {};
  let books = {};
  
  try {
    languages = await queryAsync(languageSQL);
    books = await queryAsync(bookSQL, [`%${req.query.Title}%`, req.query.Language, req.query.Format]);

    res.render('main', {
      sql: bookSQL,
      languages: languages,
      books: books
    });
  } catch (err) {
    console.log('SQL error', err);
    res.status(500).send('Something went wrong');
  }
});

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})



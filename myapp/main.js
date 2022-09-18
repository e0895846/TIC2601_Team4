//NavBar
function hideIconBar(){
  var iconBar = document.getElementById("iconBar");
  var navigation = document.getElementById("navigation");
  iconBar.setAttribute("style", "display:none;");
  navigation.classList.remove("hide");
}

function showIconBar(){
  var iconBar = document.getElementById("iconBar");
  var navigation = document.getElementById("navigation");
  iconBar.setAttribute("style", "display:block;");
  navigation.classList.add("hide");
}

//Comment
function showComment(){
  var commentArea = document.getElementById("comment-area");
  commentArea.classList.remove("hide");
}

//Reply
function showReply(){
  var replyArea = document.getElementById("reply-area");
  replyArea.classList.remove("hide");
}

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

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})



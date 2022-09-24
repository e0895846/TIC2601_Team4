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


var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})



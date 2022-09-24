var express = require('express');
var router = express.Router();
var db = require('../sql.js')
var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main Page' });
});

router.post('/login', urlencodedParser, function(req, res, next) {
  console.log('user page', req.body);
  var val = req.body;
  var username = val.username;
  var password = val.password;

  db.query('SELECT * FROM users WHERE name = ? AND password = ?', 
    [username, password], function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        res.end("Login Success")
      }
      else {
        res.end("Login fail")
      }
      console.log(result);
    })

})

module.exports = router;
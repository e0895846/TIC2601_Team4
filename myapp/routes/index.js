var express = require('express');
var router = express.Router();
var db = require('../sql.js')
var bodyParser = require('body-parser')

const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/login', (req, res, next) => {
    res.render('login')
})

router.post('/signup', (req, res) =>{
  res.render('signup');
});




module.exports = router;
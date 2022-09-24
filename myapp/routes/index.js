var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main Page' });
});

router.post('/user', function(req, res, next) {
  res.end('user page')
})

module.exports = router;
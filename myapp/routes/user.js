var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/user', function(req, res, next) {
  res.render('user', { title: 'Login Success Page' });
});

module.exports = router;
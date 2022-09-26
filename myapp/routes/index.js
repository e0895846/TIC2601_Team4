var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = db.queryAsync
var selectAllPostSQL = db.selectAllPostSQL;

/* GET home page. */
router.get('/', async(req, res, next) => {
  try{
    posts = await queryAsync(selectAllPostSQL);
    res.render('index', {
      posts: posts
    });
  }catch(error){
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
} 
});

router.post('/login', (req, res, next) => {
    res.render('login')
})

router.post('/signup', (req, res) =>{
  res.render('signup');
});




module.exports = router;
var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')
var selectAllPostSQL = db.selectAllPostSQL;
var selectPostByUser = db.selectPostByUser;
var selectPostByHeader = db.selectPostByHeader;
var selectPostByContents = db.selectPostByContents;


/* GET home page. */
router.get('/', async(req, res, next) => {
  try{
    posts = await queryAsync(selectAllPostSQL);            
    res.render('index', {
      posts : posts      
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

router.get('/search', async (req, res) =>{
  let opt = req.query.selectPicker;      
  try {
    
    if(opt == 'username'){
      posts = await queryAsync (selectPostByUser, [`%${req.query.search_content}%`]);
    }else if(opt == 'header'){
      posts = await queryAsync (selectPostByHeader, [`%${req.query.search_content}%`]);
    }else if(opt == 'contents'){
      posts = await queryAsync (selectPostByContents, [`%${req.query.search_content}%`]);
    }
        
    res.render('index', {
      posts : posts
    });
  } catch (error) {
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')
var selectPostByUser = db.selectPostByUser;
var selectPostByHeader = db.selectPostByHeader;
var selectPostByContents = db.selectPostByContents;
var selectPost = db.selectPost;


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let sql = 'SELECT * FROM data ORDER BY created_at DESC';
    posts = await queryAsync(sql);
    res.render('index', {
      req:req,
      posts: posts
    });
  } catch (error) {
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
  }
});

// router.post('/login', (req, res, next) => {
//   res.render('login')
// })

// router.post('/signup', (req, res) => {
//   res.render('signup')
// });

router.get('/search', async (req, res) => {
  let opt = req.query.selectPicker;
  try {

    if (opt == 'username') {
      posts = await queryAsync(selectPostByUser, [`%${req.query.search_content}%`]);
    } else if (opt == 'header') {
      posts = await queryAsync(selectPostByHeader, [`%${req.query.search_content}%`]);
    } else if (opt == 'contents') {
      posts = await queryAsync(selectPostByContents, [`%${req.query.search_content}%`]);
    } else {
      posts = await queryAsync(selectPost, [`%${req.query.search_content}%`, `%${req.query.search_content}%`, `%${req.query.search_content}%`]);
    }

    res.render('index', {
      posts: posts
    });
  } catch (error) {
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
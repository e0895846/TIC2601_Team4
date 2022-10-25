var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    posts = await queryAsync('SELECT d.* , v.is_upvote FROM post p LEFT JOIN data d ON d.post_id = p.post_id LEFT JOIN (SELECT * FROM vote v WHERE v.username = ?) v ON d.post_id = v.post_id ORDER BY created_at DESC LIMIT 20;', [req.session.user]);
    subscribes = await queryAsync(db.getAllCategory, [req.session.user]);
    subscribes['current'] = '/';

    res.render('index', {
      req:req,
      title:"Rabbit",
      subscribes: subscribes,
      posts: posts
    });
  } catch (error) {
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
  }
});

router.get('/search', async (req, res) => {
  let opt = req.query.selectPicker;
  try {
    posts = await queryAsync('SELECT * FROM data p WHERE p.username LIKE ? OR p.header LIKE ? OR p.content LIKE ?', [`%${req.query.search_content}%`, `%${req.query.search_content}%`, `%${req.query.search_content}%`]);
    subscribes = await queryAsync(db.getAllCategory, [req.session.user]);
    subscribes['current'] = '/';

    res.render('index', {
      req:req,
      title:"Search Results",
      subscribes: subscribes,
      posts: posts
    });
  } catch (error) {
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
  }
});

// signout
router.get('/signout', async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect('/');
    
  } catch (error) {
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
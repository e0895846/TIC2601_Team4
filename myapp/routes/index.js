var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    posts = await queryAsync('SELECT p.header, d.* , v.is_upvote FROM post p LEFT JOIN data d ON d.post_id = p.post_id LEFT JOIN (SELECT * FROM vote v WHERE v.username = ?) v ON d.post_id = v.post_id ORDER BY created_at DESC LIMIT 20;', [req.session.user]);
    categories = await queryAsync(db.getAllCategory);
    subscribes = await queryAsync(db.getAllSubscribes, [req.session.user]);
    subscribes['current'] = '/';
    trendingPost = await queryAsync('SELECT p.post_id, p.header FROM post p WHERE p.post_id IN (SELECT * FROM trending_post_id)');

    res.render('index', {
      req:req,
      title:"Rabbit",
      categories: categories,
      subscribes: subscribes,
      posts: posts,
      trendingPost:trendingPost
    });
  } catch (error) {
    console.log('SQL error', error);
    res.status(500).send('Something went wrong');
  }
});

router.get('/search', async (req, res) => {
  let opt = req.query.selectPicker;
  try {
    posts = await queryAsync('SELECT p.header, d.*, v.is_upvote FROM data d LEFT JOIN (SELECT * FROM vote v WHERE v.username = ?) v ON d.post_id = v.post_id WHERE d.username LIKE ? OR d.header LIKE ? OR d.content LIKE ?', [req.session.user, `%${req.query.search_content}%`, `%${req.query.search_content}%`, `%${req.query.search_content}%`]);
    categories = await queryAsync(db.getAllCategory);
    subscribes = await queryAsync(db.getAllSubscribes, [req.session.user]);
    subscribes['current'] = '/';

    res.render('index', {
      req:req,
      title:"Search Results",
      categories: categories,
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
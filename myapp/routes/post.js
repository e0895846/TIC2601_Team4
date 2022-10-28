var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let reply = req.body.content;
    
    try{
        post = await queryAsync("SELECT p.header, d.*, v.is_upvote, ico.parent FROM data d LEFT JOIN post p ON p.post_id = d.post_id LEFT JOIN (SELECT * FROM vote v WHERE v.username = ?) v ON v.post_id = d.post_id LEFT JOIN is_comment_of ico ON ico.child = d.post_id WHERE d.post_id = ?", [req.session.user, id]);
        replies = await queryAsync('SELECT d.*, v.is_upvote FROM data d LEFT JOIN (SELECT * FROM vote v WHERE v.username = ?) v ON d.post_id = v.post_id WHERE d.post_id IN (SELECT child FROM is_comment_of WHERE parent = ?)', [req.session.user, id]);
        isPost = await queryAsync('SELECT p.post_id FROM post p WHERE p.post_id = ?', [id]);
        subscribes = await queryAsync(db.getAllSubscribes, [req.session.user]);
        subscribes['current'] = post[0].category;
        
        res.render('post',{
            req:req,
            title: post[0].header,
            subscribes: subscribes,
            post: post[0],
            replies: replies,
            isPost:isPost
        });
        
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;
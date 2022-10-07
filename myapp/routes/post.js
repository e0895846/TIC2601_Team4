var express = require('express');
var router = express.Router();

var queryAsync = require('../mysql.js')

router.get('/signout', (req, res) => {
    //res.clearCookie('nToken');
    return res.redirect('/');
});

router.get('/:postid', async (req, res) => {
    let postid = req.params.postid;
    

    let reply = req.body.content;

    let userInfo = {};
    let posts = {};
    let countPosts = {};
    
    try{
        post = await queryAsync('SELECT header, contents FROM posts WHERE postId = ?', [postid]);
        header = post[0].header;
        contents = post[0].contents;
        replies = await queryAsync('SELECT * FROM posts WHERE postId IN (SELECT child FROM is_comment_of WHERE parent = ?)', [postid]);
        numOfReplies = await queryAsync('SELECT COUNT(*) as count FROM is_comment_of WHERE parent = ?', [postid]).count;
        
        console.log(replies);
        console.log(numOfReplies);
        res.render('post',{
            header, postid,
            posts:replies,
            numOfReplies
        });
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;
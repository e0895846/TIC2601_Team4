var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = db.queryAsync
var userinfonoPassSQL = db.userinfonoPassSQL
var postSQL = db.postSQL
var coutPostSQL = db.coutPostSQL
var updatepostSQL = db.updatepostSQL


router.post('/updatePost/:id/:username', async (req, res) =>{
        
    let postId = parseInt(req.params.id.substring(1)); 
    let username = req.params.username.substring(1);
    let header = req.body.header;
    let content = req.body.content;

    let userInfo = {};
    let posts = {};
    let countPosts = {};  

    try {
        await queryAsync(updatepostSQL,[header, content, postId]);
        userInfo = await queryAsync(userinfonoPassSQL,[username]);
        posts = await queryAsync(postSQL, [username]);
        countPosts = await queryAsync(coutPostSQL, [username]);
        
        res.render('user',{
            countPosts : countPosts,
            userInfo:userInfo,
            posts:posts
        });
    } catch (error) {
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
    
});

module.exports = router;
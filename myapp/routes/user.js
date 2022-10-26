var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')

router.get('/:username', async (req, res) => {
    let username = req.params.username;
    let header = req.body.header;
    let content = req.body.content;

    let posts = {};
    let countPosts = {};
    
    try{
        userInfo = await queryAsync('SELECT * FROM user WHERE username = ?' ,[username]);
        posts = await queryAsync('SELECT * FROM data WHERE username = ?', [username]);
        subscribes = await queryAsync(db.getAllSubscribes, [req.session.user]);
        subscribes['current'] = '/';
        
        res.render('user', {
            req:req,
            title: username,
            userInfo: userInfo[0],
            subscribes: subscribes,
            posts:posts
        });
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;
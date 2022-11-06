var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')

router.get('/:username', async (req, res) => {
    let username = req.params.username;
    userInfo = await queryAsync('SELECT * FROM user WHERE username = ?' ,[username]);

    if(userInfo[0]){       
        try{
            posts = await queryAsync('SELECT p.header, d.*, v.is_upvote FROM post p INNER JOIN data d ON p.post_id = d.post_id LEFT JOIN (SELECT * FROM vote v WHERE v.username = ?) v ON d.post_id = v.post_id WHERE d.username = ?', [req.session.user, username]);
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
        
    }else{       
        res.status(403).send('User does not exist');
    }         
});

module.exports = router;
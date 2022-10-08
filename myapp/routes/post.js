var express = require('express');
var router = express.Router();

var queryAsync = require('../mysql.js')

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let reply = req.body.content;
    
    try{
        post = await queryAsync('SELECT header, content FROM data WHERE post_id = ?', [id]);
        replies = await queryAsync('SELECT * FROM data WHERE post_id IN (SELECT child FROM is_comment_of WHERE parent = ?)', [id]);

        res.render('post',{
            req:req,
            header: post[0].header,
            content: post[0].contents,
            postId: id,
            posts: replies,
            title: "Post"
        });
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;
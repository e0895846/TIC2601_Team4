var express = require('express');
var router = express.Router();

var queryAsync = require('../mysql.js')


router.post('/post/:crud/:id?', async (req, res) =>{
    let crud = req.params.crud;
    let id = req.params.id;

    let header = req.body.header;
    let content = req.body.content;
 
    if (req.session.isLogin) {
        let loginUser = req.session.user.username;
        var category = 'test'; //replace with function to get category of post
        if (crud == 'insert'){
            await queryAsync('INSERT INTO data (username, header, category, contents) VALUES (?, ?, ?)' ,[loginUser, header, category, content]);
        } else if (crud == 'edit' || crud == 'delete') {

            let username = await queryAsync('SELECT username FROM posts WHERE postid = ?', [postId]); 
            if (req.session.user.username == username[0].username || req.session.user.isAdmin) { //Check matching user or admin
                try{
                    if (crud == 'edit') {
                        await queryAsync('UPDATE data SET header = ?, contents = ? , category = ? WHERE post_id = ?', [header, content, category, id]);
                    } else if (crud == 'delete'){
                        await queryAsync('DELETE FROM posts WHERE postid = ?', [id]);
                    }
                }catch(error){
                    console.log('SQL error', error);
                    res.status(500).send('Something went wrong');
                }
            }
        }
    }
    if (id){
        res.redirect('/post/' + id);
    }
    res.redirect('/');
});

module.exports = router;
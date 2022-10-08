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
        if (crud == 'create'){
            await queryAsync('INSERT INTO data (username, header, category, contents) VALUES (?, ?, ?)' ,[loginUser, header, category, content]);
        } else if (crud == 'edit' || crud == 'delete') {

            let username = await queryAsync('SELECT username FROM posts WHERE postid = ?', [postId]); 
            if (req.session.user.username == username[0].username || req.session.user.isAdmin) {
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

router.post('/user/:crud/:name?', async (req, res) =>{
    let crud = req.params.crud;
    let name = req.params.name;
 
    let username = req.body.username;
    let password = req.body.password;

    if ((crud == 'create' && !req.session.isLogin) || req.session.user.isAdmin) {
        await queryAsync('INSERT INTO user (username, password) VALUES (?, ?)' ,[loginUser, header, category, content]);
        req.session.user = username;
        req.session.isAdmin = false;
        req.session.isLogin = true;
    }
    else if (crud == 'edit' || crud == 'delete') {
        let loginUser = req.session.user.username;
        if (req.session.user.username == name || req.session.user.isAdmin) {
            try{
                if (crud == 'edit') {
                    await queryAsync('UPDATE user SET username = ?, password = ? WHERE username = ?', [username, password, name]);
                    req.session.user = username;
                } else if (crud == 'delete'){
                    await queryAsync('DELETE FROM user WHERE username = ?', [name]);
                    req.session.user = '';
                    req.session.isAdmin = false;
                    req.session.isLogin = false;
                }
            }catch(error){
                console.log('SQL error', error);
                res.status(500).send('Something went wrong');
            }
        }
    } else if (crud == 'admin' && req.session.user.isAdmin) {
        await queryAsync('UPDATE user SET is_admin = 1 WHERE username = ?', [name]);
    }
    if (req.session.user != ''){
        res.redirect('/user/' + req.session.user);
    }
    res.redirect('/');
});

module.exports = router;
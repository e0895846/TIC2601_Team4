var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");

var queryAsync = require('../mysql.js')

router.get('/vote/:vote/:post', async (req, res) =>{
    let vote = req.params.vote;
    let post = req.params.post;

    if (req.session.isLogin) {
        var currentVote = await queryAsync ('SELECT is_upvote FROM vote v WHERE v.post_id = ? AND v.username = ?', [post, req.session.user]);
        if (currentVote[0]) {
            if (currentVote[0].is_upvote == vote) {
                await queryAsync ('DELETE FROM vote v WHERE v.username = ? AND v.post_id = ?', [req.session.user, post]);
                if (vote == '1'){
                    await queryAsync ('UPDATE data SET reputation = reputation - 1 WHERE post_id = ?', [post]);
                } else {
                    await queryAsync ('UPDATE data SET reputation = reputation + 1 WHERE post_id = ?', [post]);
                }
            } else {
                await queryAsync ('UPDATE vote SET is_upvote = ? WHERE username = ? AND post_id = ?', [vote, req.session.user, post]);
                if (vote == '1'){
                    await queryAsync ('UPDATE data SET reputation = reputation + 2 WHERE post_id = ?', [post]);
                } else {
                    await queryAsync ('UPDATE data SET reputation = reputation - 2 WHERE post_id = ?', [post]);
                }
            }
        } else {
            await queryAsync ('INSERT INTO vote (username, post_id, is_upvote) VALUES (?, ?, ?)', [req.session.user, post, vote]);
            if (vote == '1'){
                await queryAsync ('UPDATE data SET reputation = reputation + 1 WHERE post_id = ?', [post]);
            } else {
                await queryAsync ('UPDATE data SET reputation = reputation - 1 WHERE post_id = ?', [post]);
            }
        }
    }
    res.redirect('/post/' + post);
});

router.post('/post/:crud/:id', async (req, res) =>{
    let crud = req.params.crud;
    let id = req.params.id;

    let header = req.body.header;
    let content = req.body.content;
    let category = req.body.category;

    if (req.session.isLogin) {
        let loginUser = req.session.user;
        try {
            if (crud == 'create' || crud == 'reply'){
                if (crud == 'reply') {
                    var rCategory = await queryAsync ('SELECT category FROM data WHERE post_id = ?', [id])
                    var returnPost = await queryAsync('INSERT INTO data SET ?', {username:loginUser, header:'Reply to post#' + id, category:rCategory[0].category, content:content});
                    await queryAsync('INSERT INTO is_comment_of (parent, child) VALUES (?, ?)', [id, returnPost.insertId]);
                } else {
                    var returnPost = await queryAsync('INSERT INTO data SET ?', {username:loginUser, header:header, category:category, content:content});
                    await queryAsync('INSERT INTO post (post_id) VALUES (?)', [returnPost.insertId]);
                }
            } else if (crud == 'edit' || crud == 'delete') {
                let username = await queryAsync('SELECT username FROM data WHERE post_id = ?', [id]); 
                if (req.session.user == username[0].username || req.session.isAdmin) {
                    if (crud == 'edit') {
                        var rCategory = await queryAsync ('SELECT category FROM data WHERE post_id = ?', [id])
                        await queryAsync('UPDATE data SET header = ?, content = ? , category = ? WHERE post_id = ?', [header, content, rCategory[0].category, id]);
                    } else if (crud == 'delete'){
                        await queryAsync('DELETE FROM data WHERE post_id = ?', [id]);
                    }
                }
            }
        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }
    } else {
        res.status(500).send('Please login first');
    }
    if (crud == 'edit' || crud == 'reply'){
        res.redirect('/post/'+id);
    } else {
        res.redirect('/');
    }
});

router.post('/user/:crud/:name', async (req, res, next) =>{
    let crud = req.params.crud;
    let name = req.params.name;
 
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let repeatPassword = req.body.repeatPassword;

    try {
        //create user
        if (crud == 'create' && (!req.session.isLogin || req.session.isAdmin)) {
            if((username && password && email) && (password == repeatPassword)){  
                // check used name
                let result = await queryAsync('SELECT username FROM user WHERE username = ?', [username]);
                if (result.length > 0) {
                    res.send("This username has been used");
                }
                else {
                    let salt = await bcrypt.genSalt(10);
                    let hashPassword = await bcrypt.hash(password, salt);
                    await queryAsync('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [username, hashPassword, email]);
                    req.session.user = username;
                    req.session.isAdmin = false;
                    req.session.isLogin = true;
                }
            } else if (password != repeatPassword){
                res.send('Repeat Password does not match');
            } else {
                res.send('Please enter username and password');
            }
        }
        // update user password and delete user
        else if (crud == 'edit' || crud == 'delete') {
            if (req.session.username == name || req.session.isAdmin) {
                if (crud == 'edit') {
                    await queryAsync('UPDATE user SET username = ?, password = ? WHERE username = ?', [username, password, name]);
                    req.session.user = username;
                } 
                else if (crud == 'delete') {
                    await queryAsync('DELETE FROM user WHERE username = ?', [name]);
                    req.session.user = '';
                    req.session.isAdmin = false;
                    req.session.isLogin = false;
                }
            }    
        } else if (crud == 'admin' && req.session.isAdmin) {
            await queryAsync('UPDATE user SET is_admin = 1 WHERE username = ?', [name]);
        }
    } catch (error) {
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }

    res.redirect("/");
    res.end();
});

module.exports = router;
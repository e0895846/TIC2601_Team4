var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");

var queryAsync = require('../mysql.js')

router.get('/vote/:vote/:post', async (req, res) => {
    let vote = req.params.vote;
    let post = req.params.post;

    if (req.session.isLogin) {
        var currentVote = await queryAsync('SELECT is_upvote FROM vote v WHERE v.post_id = ? AND v.username = ?', [post, req.session.user]);
        if (currentVote[0]) {
            if (currentVote[0].is_upvote == vote) {
                await queryAsync('DELETE FROM vote WHERE username = ? AND post_id = ?', [req.session.user, post]);
                if (vote == 1) {
                    await queryAsync('UPDATE data SET reputation = reputation - 1 WHERE post_id = ?', [post]);
                    await queryAsync('UPDATE user SET reputation = reputation - 1 WHERE username = (SELECT username FROM data WHERE post_id = ?)', [post]);
                } else {
                    await queryAsync('UPDATE data SET reputation = reputation + 1 WHERE post_id = ?', [post]);
                    await queryAsync('UPDATE user SET reputation = reputation + 1 WHERE username = (SELECT username FROM data WHERE post_id = ?)', [post]);
                }
            } else {
                await queryAsync('UPDATE vote SET is_upvote = ? WHERE username = ? AND post_id = ?', [vote, req.session.user, post]);
                if (vote == 1) {
                    await queryAsync('UPDATE data SET reputation = reputation + 2 WHERE post_id = ?', [post]);
                    await queryAsync('UPDATE user SET reputation = reputation + 2 WHERE username = (SELECT username FROM data WHERE post_id = ?)', [post]);
                } else {
                    await queryAsync('UPDATE data SET reputation = reputation - 2 WHERE post_id = ?', [post]);
                    await queryAsync('UPDATE user SET reputation = reputation - 2 WHERE username = (SELECT username FROM data WHERE post_id = ?)', [post]);
                }
            }
        } else {
            await queryAsync('INSERT INTO vote (username, post_id, is_upvote) VALUES (?, ?, ?)', [req.session.user, post, vote]);
            if (vote == 1) {
                await queryAsync('UPDATE data SET reputation = reputation + 1 WHERE post_id = ?', [post]);
                await queryAsync('UPDATE user SET reputation = reputation + 1 WHERE username = (SELECT username FROM data WHERE post_id = ?)', [post]);
            } else {
                await queryAsync('UPDATE data SET reputation = reputation - 1 WHERE post_id = ?', [post]);
                await queryAsync('UPDATE user SET reputation = reputation - 1 WHERE username = (SELECT username FROM data WHERE post_id = ?)', [post]);
            }
        }
    }
    res.redirect('/post/' + post);
});

router.get('/category/:category', async (req, res) => {
    let category = req.params.category;

    if (req.session.isLogin) {
        var currentSubscribe = await queryAsync('SELECT * FROM subscribe s WHERE s.username = ? AND s.category = ?', [req.session.user, category]);
        if (currentSubscribe[0]) {
            await queryAsync('DELETE FROM subscribe WHERE username = ? AND category = ?', [req.session.user, category]);
        } else {
            await queryAsync('INSERT INTO subscribe (username, category) VALUES (?, ?)', [req.session.user, category]);
        }
    }
    res.redirect('/category/' + category);
});

router.post('/post/:crud/:id', async (req, res) => {
    let crud = req.params.crud;
    let id = req.params.id;

    let header = req.body.header;
    let content = req.body.content;
    let category = req.body.category;

    if (req.session.isLogin) {
        let loginUser = req.session.user;
        try {
            if (crud == 'create' || crud == 'reply') {
                if (crud == 'reply') {
                    var rCategory = await queryAsync('SELECT category FROM data WHERE post_id = ?', [id])
                    var returnPost = await queryAsync('INSERT INTO data SET ?', { username: loginUser, category: rCategory[0].category, content: content });
                    await queryAsync('INSERT INTO is_comment_of (parent, child) VALUES (?, ?)', [id, returnPost.insertId]);
                } else {
                    var returnPost = await queryAsync('INSERT INTO data SET ?', { username: loginUser, category: category, content: content });
                    await queryAsync('INSERT INTO post (post_id, header) VALUES (?, ?)', [returnPost.insertId, header]);
                }
            } else if (crud == 'edit' || crud == 'delete') {
                let username = await queryAsync('SELECT username FROM data WHERE post_id = ?', [id]);
                if (req.session.user == username[0].username || req.session.isAdmin) {
                    if (crud == 'edit') {
                        var rCategory = await queryAsync('SELECT post_id FROM post WHERE post_id = ?', [id])
                        await queryAsync('UPDATE data SET content = ? WHERE post_id = ?', [content, id]);
                        if(rCategory[0]){
                            await queryAsync('UPDATE post SET header = ? WHERE post_id = ?', [header, id]);
                        }
                    } else if (crud == 'delete') {
                        await queryAsync('WITH RECURSIVE getAll AS (SELECT ? AS post UNION ALL SELECT ico.child AS post FROM is_comment_of ico INNER JOIN getAll ga ON ico.parent = ga.post) DELETE FROM data WHERE post_id in (SELECT * FROM getAll)', [id]);
                    }
                }
            }

            if (crud == 'edit' || crud == 'reply') {
                res.redirect('/post/' + id);
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }
    } else {
        res.status(500).send('Please login first');
    }
});

router.post('/user/:crud/:name', async (req, res, next) => {
    let crud = req.params.crud;
    let name = req.params.name;

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let repeatPassword = req.body.repeatPassword;

    try {
        //create user
        if (crud == 'create' && (!req.session.isLogin || req.session.isAdmin)) {
            if ((username && password) && (password == repeatPassword)) {
                // check used name
                let result = await queryAsync('SELECT username FROM user WHERE username = ?', [username]);
                if (result.length > 0) {
                    res.send("This username has been used");
                }
                else {
                    let salt = await bcrypt.genSalt(10);
                    let hashPassword = await bcrypt.hash(password, salt);
                    await queryAsync('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [username, hashPassword, email]);
                    // await queryAsync('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashPassword]);
                    req.session.user = username;
                    req.session.isAdmin = false;
                    req.session.isLogin = true;
                }
            } else if (password != repeatPassword) {
                res.send('Repeat Password does not match');
            } else {
                res.send('Please enter username, password and email');
            }
        }
        // update user password and delete user
        else if (crud == 'edit' || crud == 'delete') {
            if (crud == 'edit') {
                if (req.session.user == name) {
                    if (password == repeatPassword){
                        let salt = await bcrypt.genSalt(10);
                        let hashPassword = await bcrypt.hash(password, salt);
                        await queryAsync('UPDATE user SET password = ? WHERE username = ?', [hashPassword, name]);
                    } else {
                        res.send('Repeat Password does not match');
                    }
                }
            } 
            else if (crud == 'delete') {
                if (req.session.user == name || req.session.isAdmin) {
                    await queryAsync('DELETE FROM user WHERE username = ?', [name]);
                    if (!req.session.isAdmin){
                        req.session.user = '';
                        req.session.isAdmin = false;
                        req.session.isLogin = false;
                    }
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
});

module.exports = router;
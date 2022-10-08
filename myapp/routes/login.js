var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js');
var postSQL = db.postSQL
var coutPostSQL = db.coutPostSQL
var userinfowPassSQL = db.userinfowPassSQL;

router.get('/', function (req, res, next) {
    res.render('login', {
        req:req
    });
});

router.post('/login', async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    let userInfo = {};
    let posts = {};
    let countPosts = {};

    if (username && password) {
        try {
            userInfo = await queryAsync('SELECT username, is_admin FROM users WHERE username = ? AND password = ?', [username, password]);
            posts = await queryAsync(postSQL, [username]);
            countPosts = await queryAsync(coutPostSQL, [username]);

            if (userInfo.length > 0) {
                // Store user info into session
                req.session.user = userInfo[0].username; // username and password
                req.session.isAdmin = userInfo[0].is_admin; //Administrative rights
                req.session.isLogin = true; // login status

                if (req.body.referer &&
                    (req.body.referer !== undefined &&
                        req.body.referer.slice(-6) !== "/login")) {
                    res.redirect(req.body.referer);
                } else {
                    res.redirect("/");
                }
                // res.render('user',{
                //     countPosts : countPosts,
                //     posts : posts,
                //     userInfo : userInfo
                //  });
            } else {
                res.send('Incoreect username or password');
            }

        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }

    } else {
        res.send('Please enter username and password');
        res.end()
    }
});


module.exports = router;
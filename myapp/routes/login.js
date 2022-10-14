var express = require('express');
var router = express.Router();

var queryAsync = require('../mysql.js');

router.get('/', function (req, res, next) {
    res.render('login', {
         req:req,
         title: "Login/Sign Up"
        });
});

router.post('/login', async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    // reject invalid type of input
    if (typeof username != "string" || typeof password != "string"){
        response.send("Invalid parameters!");
        response.end();
        return;
       }

    if (username && password) {
        try {
            var userInfo = await queryAsync('SELECT username, is_admin FROM user WHERE username = ? AND password = ?', [username, password]);

            if (userInfo.length > 0) {
                // Store user info into session
                req.session.user = userInfo[0].username; // username and password
                req.session.isAdmin = userInfo[0].is_admin; //Administrative rights
                req.session.isLogin = true; // login status
                res.redirect("/");
            } else {
                res.send('Incorrect username or password');
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
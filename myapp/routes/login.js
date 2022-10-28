var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")

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
            var userInfo = await queryAsync('SELECT username, password, is_admin FROM user WHERE username = ?', [username]);
            if (userInfo[0]) {
                const validPassword = await bcrypt.compare(password, userInfo[0].password)
                if (validPassword) {
                    // Store user info into session
                    req.session.user = userInfo[0].username; // username and password
                    req.session.isAdmin = userInfo[0].is_admin; //Administrative rights
                    req.session.isLogin = true; // login status
                    res.redirect("/");
                } else {
                    res.send('Incorrect password');
                }
            }
            else {
                res.send("User does not exist")
            }
        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }
    } else {   
        res.send('Please enter username and password');
    }
});


module.exports = router;
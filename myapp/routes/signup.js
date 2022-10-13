var express = require('express');
var router = express.Router();

var queryAsync = require('../mysql.js')

router.post('/signup', async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){                  
        try{
            await queryAsync('INSERT INTO user (username, password) VALUES (?, ?)',[username, password]);
            console.log('Signup success')
            res.render('login');
        }catch(error){
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        } 
    }else{
        res.send('Please enter username and password');
    }  
     
});

module.exports = router;
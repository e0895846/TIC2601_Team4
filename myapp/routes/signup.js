var express = require('express');
var router = express.Router();
var db = require('../sql.js')
var bodyParser = require('body-parser')

var queryAsync = require('../mysql.js')
var insUserSQL = db.insUserSQL

router.get('/', function(req, res, next) {
    res.render('signup');
});
router.post('/', function(req, res, next) {
    res.render('signup');
});


router.post('/signup', async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){                  
        try{
            await queryAsync(insUserSQL,[username, password]);
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
var express = require('express');
var router = express.Router();
var db = require('../sql.js')
var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var queryAsync = db.queryAsync
var insUserSQL = db.insUserSQL

router.get('/goto_signup', (req, res) =>{
    res.render('signup', {title: 'Signup Page'});
});


router.post('/signup', async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){                  
        try{
            await queryAsync(insUserSQL,[username, password]);
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
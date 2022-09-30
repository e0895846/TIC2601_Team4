var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js');
var postSQL = db.postSQL
var coutPostSQL = db.coutPostSQL
var userinfowPassSQL = db.userinfowPassSQL;

router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/test', (req, res, next) => {
    console.log(req.cookies) 
    let context = {
        "name" : "username",
        "password": "password"
    }
    res.cookie('cookieName', 'cookieValue', context)
    console.log(res.cookie)
    res.send('')
})


router.post('/login', async (req, res) =>{
    let username = req.body.username;
    let password = req.body.password;
    
    console.log('Cookies: ', req.cookies)
        
    let userInfo = {};
    let posts = {};
    let countPosts = {};

      if(username && password){       
       try{
            userInfo = await queryAsync(userinfowPassSQL,[username,password]);
            posts = await queryAsync(postSQL, [username]);
            countPosts = await queryAsync(coutPostSQL, [username]);

            if(userInfo.length > 0){
                res.render('user',{
                    countPosts : countPosts,
                    posts : posts,
                    userInfo : userInfo
                 });
            }else{
                res.send('Incoreect username or password');
            }
            
       }catch(error){
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');        
       }
       
    }else{
        res.send('Please enter username and password');
    }    
});


module.exports = router;